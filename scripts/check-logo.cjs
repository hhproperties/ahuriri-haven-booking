const sharp = require("C:\\GitHub\\ahuriri-haven-booking\\node_modules\\sharp");
sharp("C:\\GitHub\\ahuriri-haven-booking\\src\\assets\\vulcan-retreat-logo.png")
  .raw()
  .toBuffer()
  .then(buf => {
    const w = 1024;
    const centerY = Math.floor(512 * w * 4);
    const vals = [];
    for (let x = 400; x < 600; x += 20) {
      const idx = centerY + x * 4;
      vals.push("px" + x + ": R=" + buf[idx] + " G=" + buf[idx+1] + " B=" + buf[idx+2] + " A=" + buf[idx+3]);
    }
    console.log(vals.join("\n"));
    process.exit(0);
  }).catch(e => { console.log(e.message); process.exit(1); });
