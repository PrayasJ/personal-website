const fs = require("fs");
const path = require("path");

const dest = path.join(process.cwd(), "public", "pdf.worker.min.mjs");
const candidates = [
  "pdfjs-dist/build/pdf.worker.min.mjs",
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
];

for (const rel of candidates) {
  const src = path.join(process.cwd(), "node_modules", rel);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    process.exit(0);
  }
}

console.error("pdf.js worker not found. Install pdfjs-dist.");
process.exit(1);
