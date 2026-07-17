const sharp = require("C:\\GitHub\\ahuriri-haven-booking\\node_modules\\sharp");
const path = require("path");

const src = "C:\\GitHub\\ahuriri-haven-booking\\src\\assets\\vulcan-retreat-logo.png";
const dst = "C:\\GitHub\\ahuriri-haven-booking\\src\\assets\\vulcan-retreat-logo-dark.png";

// Load the PNG, get raw pixel data, and create a version where
// visible pixels are brightened to cream for dark backgrounds
sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer()
  .then(buf => {
    const { width, height } = 1024; // known from metadata
    const pixels = width * height;
    
    // For each pixel: if it's opaque enough, brighten it to cream
    for (let i = 0; i < pixels; i++) {
      const idx = i * 4;
      const r = buf[idx];
      const g = buf[idx + 1];
      const b = buf[idx + 2];
      const a = buf[idx + 3];
      
      if (a > 50) {
        // Detect if this is a "dark" pixel (part of the logo) vs a "light" pixel
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        if (luminance < 200) {
          // Dark pixel - part of the main logo mark
          // Map to cream tones
          const t = luminance / 200; // 0 to ~1
          const creamR = 239; // #EFE8DA
          const creamG = 232;
          const creamB = 218;
          const warmR = 189; // slightly darker cream
          const warmG = 175;
          const warmB = 155;
          
          buf[idx] = Math.round(creamR - (creamR - warmR) * t);
          buf[idx + 1] = Math.round(creamG - (creamG - warmG) * t);
          buf[idx + 2] = Math.round(creamB - (creamB - warmB) * t);
          // Keep alpha
        }
        // Light pixels (cream/tan background area) become transparent
        else {
          buf[idx] = 0;
          buf[idx + 1] = 0;
          buf[idx + 2] = 0;
          buf[idx + 3] = 0;
        }
      }
    }
    
    return sharp(Buffer.from(buf), {
      raw: { width, height, channels: 4 }
    })
      .png()
      .toFile(dst);
  })
  .then(() => {
    console.log("Created dark variant with cream foreground");
    process.exit(0);
  })
  .catch(e => {
    console.log("Error:", e.message);
    process.exit(1);
  });
