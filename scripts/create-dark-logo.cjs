const sharp = require("C:/GitHub/ahuriri-haven-booking/node_modules/sharp");

const src = "C:/GitHub/ahuriri-haven-booking/src/assets/vulcan-retreat-logo.png";
const dst = "C:/GitHub/ahuriri-haven-booking/src/assets/vulcan-retreat-logo-dark.png";

// Step 1: Get metadata
sharp(src)
  .metadata()
  .then(meta => {
    console.log("Source:", meta.width, "x", meta.height, "channels:", meta.channels, "hasAlpha:", meta.hasAlpha);
    
    // Step 2: Read raw RGBA pixels
    return sharp(src)
      .ensureAlpha()
      .raw()
      .toBuffer();
  })
  .then(buf => {
    const w = 1024, h = 1024;
    
    // Analyze: find the range of logo colors
    let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
    let opaqueCount = 0;
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const a = buf[idx + 3];
        if (a > 200) {
          const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2];
          minR = Math.min(minR, r); maxR = Math.max(maxR, r);
          minG = Math.min(minG, g); maxG = Math.max(maxG, g);
          minB = Math.min(minB, b); maxB = Math.max(maxB, b);
          opaqueCount++;
        }
      }
    }
    
    console.log("Opaque pixels:", opaqueCount);
    console.log("R range:", minR, "-", maxR);
    console.log("G range:", minG, "-", maxG);
    console.log("B range:", minB, "-", maxB);
    
    // Step 3: Create dark variant
    // Map dark foreground pixels to cream, light pixels to transparent
    const cream = { r: 239, g: 232, b: 218 };
    const darkCream = { r: 190, g: 176, b: 155 };
    
    // Determine the median logo color
    const logoR = (minR + maxR) / 2;
    const logoG = (minG + maxG) / 2;
    const logoB = (minB + maxB) / 2;
    const logoLum = 0.299 * logoR + 0.587 * logoG + 0.114 * logoB;
    console.log("Median logo luminance:", logoLum.toFixed(1));
    
    // Threshold: pixels brighter than this are "background", darker are "foreground"
    const threshold = logoLum + 40;
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2], a = buf[idx + 3];
        
        if (a > 50) {
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          
          if (lum < threshold) {
            // Logo pixel: map to cream
            const t = Math.min(lum / threshold, 1);
            buf[idx] = Math.round(cream.r - (cream.r - darkCream.r) * t);
            buf[idx + 1] = Math.round(cream.g - (cream.g - darkCream.g) * t);
            buf[idx + 2] = Math.round(cream.b - (cream.b - darkCream.b) * t);
            buf[idx + 3] = 255;
          } else {
            // Background pixel that had some opacity: make transparent
            buf[idx] = 0;
            buf[idx + 1] = 0;
            buf[idx + 2] = 0;
            buf[idx + 3] = 0;
          }
        }
      }
    }
    
    return sharp(Buffer.from(buf), { raw: { width: w, height: h, channels: 4 } })
      .png()
      .toFile(dst);
  })
  .then(() => {
    console.log("Created dark variant with cream foreground on transparent bg");
    
    // Verify the result
    return sharp(dst).metadata();
  })
  .then(m => {
    console.log("Result:", m.width, "x", m.height, "channels:", m.channels, "hasAlpha:", m.hasAlpha, "size:", m.size);
    process.exit(0);
  })
  .catch(e => {
    console.log("Error:", e.message);
    process.exit(1);
  });
