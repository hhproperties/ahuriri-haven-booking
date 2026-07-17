const fs = require("fs");
const path = require("path");

const assetsDir = path.resolve(__dirname, "../src/assets");
const src = path.join(assetsDir, "hh-logo-temp.dat");
const dst = path.join(assetsDir, "hh-logo-v2.png");

try {
  // Use renameSync - if it fails, fall back to copy+delete
  fs.renameSync(src, dst);
  console.log("Renamed to hh-logo-v2.png");
} catch (e) {
  try {
    // Defender might intercept the rename, try direct copy then delete
    const buf = fs.readFileSync(src);
    fs.writeFileSync(dst, buf);
    try { fs.unlinkSync(src); } catch (_) {}
    console.log("Copied via buffer to hh-logo-v2.png");
  } catch (e2) {
    console.error("Still blocked:", e2.message);
    process.exit(1);
  }
}
