const sharp = require("C:/GitHub/ahuriri-haven-booking/node_modules/sharp");

sharp("C:/GitHub/ahuriri-haven-booking/src/assets/vulcan-retreat-logo-dark.png")
  .metadata()
  .then(m => {
    console.log("channels:", m.channels, "hasAlpha:", m.hasAlpha, "width:", m.width, "height:", m.height);
    return sharp("C:/GitHub/ahuriri-haven-booking/src/assets/vulcan-retreat-logo-dark.png")
      .raw()
      .toBuffer();
  })
  .then(buf => {
    const vals = [];
    for (let i = 0; i < 20; i++) {
      if (buf.length > i * 2 + 1) {
        vals.push("sample " + (i*50) + ": V=" + buf[i*2] + " A=" + buf[i*2+1]);
      }
    }
    console.log(vals.join("\n"));
    process.exit(0);
  })
  .catch(e => { console.log(e.message); process.exit(1); });
