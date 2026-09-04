/**
 * Generates the site favicon set and the Open Graph share image.
 *
 *   favicon        <- src/assets/vulcan-retreat-logo.png  (VL monogram only)
 *   og-image       <- src/assets/hh-logo-v2.png
 *
 * The Vulcan lockup is a monogram over a three-line wordmark. Below ~64px the
 * wordmark turns to mush, so the favicon crops to the monogram band and the
 * wordmark is dropped. The monogram is dark wood on transparent, which
 * disappears against a dark browser tab, so it sits on the brand cream.
 *
 * Run with: node scripts/make-icons.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS = path.join(ROOT, "src/assets");
const PUBLIC = path.join(ROOT, "public");

const CREAM = "#EFE8DA"; // brand background, see src/styles.css

/** Row band of the VL monogram in vulcan-retreat-logo.png (1024x1024). */
const MONOGRAM_BAND = { top: 120, height: 458 };

/** Builds a multi-resolution .ico wrapping PNG payloads. */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  const directory = Buffer.alloc(16 * pngs.length);
  let offset = header.length + directory.length;

  pngs.forEach(({ size, data }, i) => {
    const e = i * 16;
    directory[e] = size >= 256 ? 0 : size; // width  (0 means 256)
    directory[e + 1] = size >= 256 ? 0 : size; // height
    directory[e + 2] = 0; // palette size
    directory[e + 3] = 0; // reserved
    directory.writeUInt16LE(1, e + 4); // colour planes
    directory.writeUInt16LE(32, e + 6); // bits per pixel
    directory.writeUInt32LE(data.length, e + 8);
    directory.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...pngs.map((p) => p.data)]);
}

/** Squares an image on a cream ground with even breathing room. */
function square(input, size, padRatio = 0.08) {
  const inner = Math.round(size * (1 - padRatio * 2));
  return sharp(input)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: Math.round((size - inner) / 2),
      bottom: size - inner - Math.round((size - inner) / 2),
      left: Math.round((size - inner) / 2),
      right: size - inner - Math.round((size - inner) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .flatten({ background: CREAM });
}

async function makeFavicons() {
  // Crop to the monogram, then trim the transparent margin off it exactly.
  const band = await sharp(path.join(ASSETS, "vulcan-retreat-logo.png"))
    .extract({ left: 0, top: MONOGRAM_BAND.top, width: 1024, height: MONOGRAM_BAND.height })
    .png()
    .toBuffer();
  const monogram = await sharp(band).trim({ threshold: 10 }).png().toBuffer();

  const icoSizes = [16, 32, 48];
  const icoPngs = [];
  for (const size of icoSizes) {
    icoPngs.push({ size, data: await square(monogram, size).png().toBuffer() });
  }
  fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), buildIco(icoPngs));

  for (const size of [16, 32]) {
    await square(monogram, size)
      .png()
      .toFile(path.join(PUBLIC, `favicon-${size}x${size}.png`));
  }

  // iOS masks and rounds the corners itself, so this needs a touch more padding.
  await square(monogram, 180, 0.12).png().toFile(path.join(PUBLIC, "apple-touch-icon.png"));

  console.log("favicons written");
}

async function makeOgImage() {
  // 1200x630 is the Open Graph reference size. The logo is 1376x768 (1.79:1),
  // so contain-fit and let the cream padding blend into its own ground. The
  // inset keeps the wordmark clear of the edge crops some clients apply.
  const inset = 0.94;
  const inner = await sharp(path.join(ASSETS, "hh-logo-v2.png"))
    .flatten({ background: CREAM })
    .resize(Math.round(1200 * inset), Math.round(630 * inset), {
      fit: "contain",
      background: CREAM,
    })
    .png()
    .toBuffer();

  await sharp({ create: { width: 1200, height: 630, channels: 3, background: CREAM } })
    .composite([{ input: inner, gravity: "center" }])
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(path.join(PUBLIC, "og-image.jpg"));

  console.log("og-image written");
}

await makeFavicons();
await makeOgImage();
