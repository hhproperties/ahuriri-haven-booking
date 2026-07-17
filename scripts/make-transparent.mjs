import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../src/assets");

async function makeTransparent(input, outputLight, outputDark, bgThreshold = 35) {
  const img = sharp(path.join(ROOT, input));
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  // Sample corners for background color
  const w = info.width, h = info.height;
  const corners = [
    [data[0], data[1], data[2]],
    [data[(w - 1) * 3], data[(w - 1) * 3 + 1], data[(w - 1) * 3 + 2]],
    [data[(h - 1) * w * 3], data[(h - 1) * w * 3 + 1], data[(h - 1) * w * 3 + 2]],
    [data[((h - 1) * w + (w - 1)) * 3], data[((h - 1) * w + (w - 1)) * 3 + 1], data[((h - 1) * w + (w - 1)) * 3 + 2]],
  ];
  const r0 = Math.round(corners.reduce((s, c) => s + c[0], 0) / 4);
  const g0 = Math.round(corners.reduce((s, c) => s + c[1], 0) / 4);
  const b0 = Math.round(corners.reduce((s, c) => s + c[2], 0) / 4);
  console.log(`${input}: avg bg ~ (${r0},${g0},${b0})`);

  // Detect if original has light or dark bg
  const isLightBg = (r0 + g0 + b0) / 3 > 128;

  // Light variant: dark foreground (#17181A) for cream/light backgrounds
  const lightFg = { r: 23, g: 24, b: 26, a: 230 };
  // Dark variant: light foreground (#EFE8DA) for matte/dark backgrounds
  const darkFg = { r: 239, g: 232, b: 218, a: 220 };

  async function render(fg, outputFile) {
    const pixels = Buffer.alloc((data.length / 3) * 4);
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const dr = Math.abs(r - r0), dg = Math.abs(g - g0), db = Math.abs(b - b0);
      const isBg = dr < bgThreshold && dg < bgThreshold && db < bgThreshold;

      const outIdx = (i / 3) * 4;
      if (isBg) {
        pixels[outIdx] = r;
        pixels[outIdx + 1] = g;
        pixels[outIdx + 2] = b;
        pixels[outIdx + 3] = 0; // transparent
      } else {
        pixels[outIdx] = fg.r;
        pixels[outIdx + 1] = fg.g;
        pixels[outIdx + 2] = fg.b;
        pixels[outIdx + 3] = fg.a;
      }
    }
    await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(path.join(ROOT, outputFile));
    console.log(`  → wrote ${outputFile}`);
  }

  await render(lightFg, outputLight);
  await render(darkFg, outputDark);
}

(async () => {
  await makeTransparent("vulcan-logo.jpg", "vulcan-logo.png", "vulcan-logo-dark.png");
  await makeTransparent("hh-logo.jpg", "hh-logo.png", "hh-logo-dark.png");
  console.log("Done.");
})().catch(console.error);
