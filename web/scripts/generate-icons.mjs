/**
 * scripts/generate-icons.mjs
 *
 * Regenerates all icon assets from the source logo (app/icon.png).
 *
 * Outputs:
 *   public/icon-192.png  — 192×192 PWA icon (safe-zone padded for Android masking)
 *   public/icon-512.png  — 512×512 PWA icon (safe-zone padded for Android masking)
 *   app/favicon.ico      — multi-resolution ICO (16×16, 32×32, 48×48) for legacy
 *                          /favicon.ico requests. Browsers auto-fetch this URL
 *                          and aggressively cache 404s, so it must serve the logo.
 *
 * Why two sets:
 *   • PWA icons need ~10% white padding so Android's adaptive-icon mask
 *     (circle / squircle / teardrop) doesn't clip the logo corners.
 *   • Favicon ICOs are tiny — they need the logo to fill the canvas, no padding,
 *     transparent background, so the logo stays legible at 16×16 in the tab.
 *
 * Run with: `node scripts/generate-icons.mjs` from the web/ directory.
 */

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'app', 'icon.png');

// ─── PWA install icons (Android home screen) ─────────────────────────────────
// Logo at 78% of canvas keeps it inside the W3C maskable safe zone (inner 80%).

const SAFE_ZONE_RATIO = 0.78;
const pwaTargets = [
    { size: 192, out: path.join(ROOT, 'public', 'icon-192.png') },
    { size: 512, out: path.join(ROOT, 'public', 'icon-512.png') },
];

async function generatePwaIcons() {
    for (const { size, out } of pwaTargets) {
        const logoSize = Math.round(size * SAFE_ZONE_RATIO);
        const padding = Math.round((size - logoSize) / 2);

        const logoBuf = await sharp(SOURCE)
            .resize(logoSize, logoSize, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 0 },
            })
            .toBuffer();

        await sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            },
        })
            .composite([{ input: logoBuf, top: padding, left: padding }])
            .png({ compressionLevel: 9 })
            .toFile(out);

        console.log(`✓ ${path.relative(ROOT, out)} (${size}×${size}, ${padding}px padding)`);
    }
}

// ─── favicon.ico ─────────────────────────────────────────────────────────────
// Hand-roll a multi-resolution ICO file with embedded PNGs. The format is
// simple enough that we don't need a third-party encoder:
//
//   ICONDIR (6 bytes):
//     0..1  = reserved      (0)
//     2..3  = type           (1 = ICO)
//     4..5  = number of images
//
//   ICONDIRENTRY (16 bytes per image):
//     0     = width          (0 = 256)
//     1     = height         (0 = 256)
//     2     = palette size   (0 = none)
//     3     = reserved       (0)
//     4..5  = color planes   (1)
//     6..7  = bits per pixel (32 for our PNGs)
//     8..11 = image size in bytes
//     12..15= offset to image data
//
//   image data = raw PNG, one after another.

async function generateFavicon() {
    const sizes = [16, 32, 48];

    // Render the logo as a transparent PNG at each size. We use `fit: 'contain'`
    // with no padding so the logo fills the whole tile — at 16×16 every pixel matters.
    const pngs = await Promise.all(
        sizes.map((s) =>
            sharp(SOURCE)
                .resize(s, s, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 },
                })
                .png({ compressionLevel: 9 })
                .toBuffer()
        )
    );

    const HEADER_LEN = 6;
    const ENTRY_LEN = 16;
    const dataOffsetStart = HEADER_LEN + ENTRY_LEN * sizes.length;

    const header = Buffer.alloc(HEADER_LEN);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // type = ICO
    header.writeUInt16LE(sizes.length, 4); // image count

    const entries = [];
    let offset = dataOffsetStart;
    for (let i = 0; i < sizes.length; i++) {
        const e = Buffer.alloc(ENTRY_LEN);
        e[0] = sizes[i] >= 256 ? 0 : sizes[i]; // width
        e[1] = sizes[i] >= 256 ? 0 : sizes[i]; // height
        e[2] = 0; // palette
        e[3] = 0; // reserved
        e.writeUInt16LE(1, 4);      // color planes
        e.writeUInt16LE(32, 6);     // bits per pixel
        e.writeUInt32LE(pngs[i].length, 8); // size of image data
        e.writeUInt32LE(offset, 12); // offset to image data
        entries.push(e);
        offset += pngs[i].length;
    }

    const ico = Buffer.concat([header, ...entries, ...pngs]);
    const outPath = path.join(ROOT, 'app', 'favicon.ico');
    fs.writeFileSync(outPath, ico);
    console.log(`✓ ${path.relative(ROOT, outPath)} (${sizes.join(', ')} px, ${ico.length} bytes)`);
}

async function main() {
    await generatePwaIcons();
    await generateFavicon();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
