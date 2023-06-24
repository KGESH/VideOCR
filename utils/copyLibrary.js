import * as path from "path";
import * as fs from "fs";
import { resolve } from "path";

const __dirname = path.resolve();
const nodeModulesDir = resolve(__dirname, "node_modules");
const outDir = resolve(__dirname, "dist");

function copyTesseractLibrary(nodeModulesDir, outDir) {
  const sourcePaths = [
    path.resolve(nodeModulesDir, "tesseract.js", "dist", "worker.min.js"),
    path.resolve(nodeModulesDir, "tesseract.js-core", "tesseract-core.wasm.js"),
    path.resolve(nodeModulesDir, "tesseract.js-core", "tesseract-core.wasm"),
  ];

  const targetDir = path.join(outDir, "assets", "js");

  sourcePaths.forEach((sourcePath) => {
    const targetPath = path.join(targetDir, path.basename(sourcePath));
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`===================COPIED====================`, targetPath);
  });
}

copyTesseractLibrary(nodeModulesDir, outDir);
