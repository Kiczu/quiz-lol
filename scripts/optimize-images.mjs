import { readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ASSETS_DIR = "src/assets";
const MAX_WIDTH = 2560;
const QUALITY = 85;
const SOURCE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

const collectImages = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectImages(entryPath);
      const isSource = SOURCE_EXTENSIONS.includes(
        path.extname(entry.name).toLowerCase()
      );
      return isSource ? [entryPath] : [];
    })
  );
  return nested.flat();
};

const toMb = (bytes) => (bytes / 1024 / 1024).toFixed(2);

const optimize = async (imagePath) => {
  const target = imagePath.replace(/\.(jpe?g|png)$/i, ".webp");
  const { size } = await stat(imagePath);
  const optimized = await sharp(imagePath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();

  await writeFile(target, optimized);
  await unlink(imagePath);

  console.log(
    `${path.basename(imagePath)} -> ${path.basename(target)}  ${toMb(size)} MB -> ${toMb(optimized.length)} MB`
  );
  return { before: size, after: optimized.length };
};

const images = await collectImages(ASSETS_DIR);
const results = [];
for (const image of images) {
  results.push(await optimize(image));
}

const before = results.reduce((sum, r) => sum + r.before, 0);
const after = results.reduce((sum, r) => sum + r.after, 0);
console.log(
  `\n${images.length} images: ${toMb(before)} MB -> ${toMb(after)} MB (${Math.round((1 - after / before) * 100)}% smaller)`
);
