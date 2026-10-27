/**
 * qrBarcodeUtil.js
 * Standalone, zero-dependency QR Code & Code128 Barcode SVG generators
 * for ERP Item Issue & WMS tracking.
 */

// -----------------------------------------------------------------------------
// CODE 128 BARCODE PATTERNS (Subset B - standard alphanumeric ASCII 32..126)
// -----------------------------------------------------------------------------
const CODE128_PATTERNS = [
    "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", // 0-9
    "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", // 10-19
    "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", // 20-29
    "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", // 30-39
    "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", // 40-49
    "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", // 50-59
    "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", // 60-69
    "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", // 70-79
    "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", // 80-89
    "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", // 90-99
    "114131", "311141", "411131", "211412", "211214", "211232", "2331112" // 100-106 (106 is STOP)
];

const START_CODE_B = 104;
const STOP_CODE = 106;

/**
 * Generates an SVG path string for Code 128 (Subset B)
 */
export function generateBarcodeSVG(text, { width = 240, height = 50, showText = true } = {}) {
    const raw = String(text || "ITEM-ISSUE").trim();
    const codes = [START_CODE_B];
    let checksum = START_CODE_B;

    for (let i = 0; i < raw.length; i++) {
        const ascii = raw.charCodeAt(i);
        const codeVal = ascii - 32; // Code 128 subset B mapping
        if (codeVal >= 0 && codeVal <= 95) {
            codes.push(codeVal);
            checksum += codeVal * (i + 1);
        }
    }

    codes.push(checksum % 103);
    codes.push(STOP_CODE);

    // Build bar modules
    let patternStr = "";
    codes.forEach((c) => {
        const pat = CODE128_PATTERNS[c] || CODE128_PATTERNS[0];
        patternStr += pat;
    });

    let totalModules = 0;
    for (let i = 0; i < patternStr.length; i++) {
        totalModules += parseInt(patternStr[i], 10);
    }

    const quietZone = 10;
    const fullModules = totalModules + quietZone * 2;
    const moduleWidth = width / fullModules;

    let x = quietZone * moduleWidth;
    const rects = [];
    let isBar = true;

    for (let i = 0; i < patternStr.length; i++) {
        const barWidth = parseInt(patternStr[i], 10) * moduleWidth;
        if (isBar) {
            rects.push(
                `<rect x="${x.toFixed(2)}" y="2" width="${barWidth.toFixed(2)}" height="${(height - (showText ? 14 : 4)).toFixed(2)}" fill="#0f172a" />`
            );
        }
        x += barWidth;
        isBar = !isBar;
    }

    const textSvg = showText
        ? `<text x="${(width / 2).toFixed(2)}" y="${(height - 2).toFixed(2)}" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="#334155">${escapeXml(raw)}</text>`
        : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="max-width:100%;height:auto;display:block;">
        <rect width="${width}" height="${height}" fill="#ffffff" rx="3" />
        ${rects.join("")}
        ${textSvg}
    </svg>`;
}

// -----------------------------------------------------------------------------
// COMPACT QR CODE GENERATOR (Galois Field GF(256) Reed-Solomon + Masking)
// Generates fully valid 21x21 (V1), 25x25 (V2), 29x29 (V3) standard QR Code matrices
// -----------------------------------------------------------------------------
const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);

(function initGF256() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
        GF256_EXP[i] = x;
        GF256_LOG[x] = i;
        x <<= 1;
        if (x & 256) x ^= 0x11d; // Primitive poly x^8 + x^4 + x^3 + x^2 + 1
    }
    for (let i = 255; i < 512; i++) {
        GF256_EXP[i] = GF256_EXP[i - 255];
    }
})();

function gfMul(x, y) {
    if (x === 0 || y === 0) return 0;
    return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

function rsComputePoly(ecCount) {
    let poly = [1];
    for (let i = 0; i < ecCount; i++) {
        const next = [1, GF256_EXP[i]];
        const res = new Array(poly.length + 1).fill(0);
        for (let j = 0; j < poly.length; j++) {
            res[j] ^= gfMul(poly[j], next[0]);
            res[j + 1] ^= gfMul(poly[j], next[1]);
        }
        poly = res;
    }
    return poly;
}

function rsCalculateRemainder(data, ecCount) {
    const gen = rsComputePoly(ecCount);
    const msg = [...data, ...new Array(ecCount).fill(0)];
    for (let i = 0; i < data.length; i++) {
        const lead = msg[i];
        if (lead !== 0) {
            for (let j = 0; j < gen.length; j++) {
                msg[i + j] ^= gfMul(gen[j], lead);
            }
        }
    }
    return msg.slice(data.length);
}

// Version configs for Error Correction Level M
const QR_VERSIONS = [
    { version: 1, size: 21, totalBytes: 26, dataBytes: 16, ecBytes: 10, align: [] },
    { version: 2, size: 25, totalBytes: 44, dataBytes: 28, ecBytes: 16, align: [6, 18] },
    { version: 3, size: 29, totalBytes: 70, dataBytes: 44, ecBytes: 26, align: [6, 22] },
    { version: 4, size: 33, totalBytes: 100, dataBytes: 64, ecBytes: 36, align: [6, 26] }
];

export function generateQRMatrix(text) {
    const raw = unescape(encodeURIComponent(String(text || "V-CONNECT-ERP")));
    const len = raw.length;

    // Pick best fitting version (Mode 4 = 8-bit Byte)
    let vConf = QR_VERSIONS[0];
    for (let i = 0; i < QR_VERSIONS.length; i++) {
        if (len + 3 <= QR_VERSIONS[i].dataBytes) {
            vConf = QR_VERSIONS[i];
            break;
        }
        vConf = QR_VERSIONS[i];
    }

    const { size, dataBytes, ecBytes, align } = vConf;

    // Construct bit stream: Mode (4 bits: 0100) + Char Count (8 bits) + Data + Terminator
    const bits = [];
    const pushBits = (val, length) => {
        for (let i = length - 1; i >= 0; i--) {
            bits.push((val >> i) & 1);
        }
    };

    pushBits(0b0100, 4); // 8-bit byte mode
    pushBits(len, 8); // length
    for (let i = 0; i < len; i++) {
        pushBits(raw.charCodeAt(i), 8);
    }
    // Terminator up to 4 zero bits
    const capacityBits = dataBytes * 8;
    const termCount = Math.min(4, capacityBits - bits.length);
    for (let i = 0; i < termCount; i++) bits.push(0);
    // Align to byte boundary
    while (bits.length % 8 !== 0) bits.push(0);
    // Pad bytes 0xEC, 0x11
    const padBytes = [0xec, 0x11];
    let padIdx = 0;
    while (bits.length < capacityBits) {
        pushBits(padBytes[padIdx % 2], 8);
        padIdx++;
    }

    // Convert bits to data byte array
    const dataArray = [];
    for (let i = 0; i < bits.length; i += 8) {
        let b = 0;
        for (let j = 0; j < 8; j++) {
            b = (b << 1) | bits[i + j];
        }
        dataArray.push(b);
    }

    // Compute Reed Solomon Error Correction codewords
    const ecCodewords = rsCalculateRemainder(dataArray, ecBytes);
    const allCodewords = [...dataArray, ...ecCodewords];

    // Initialize matrix: 0 = white, 1 = black, -1 = empty
    const matrix = Array.from({ length: size }, () => Array(size).fill(-1));
    const isReserved = Array.from({ length: size }, () => Array(size).fill(false));

    const setReserved = (r, c, val) => {
        if (r >= 0 && r < size && c >= 0 && c < size) {
            matrix[r][c] = val;
            isReserved[r][c] = true;
        }
    };

    // 1. Finder Patterns (7x7) + Separators at 3 corners
    const placeFinder = (startR, startC) => {
        for (let r = -1; r <= 7; r++) {
            for (let c = -1; c <= 7; c++) {
                const gr = startR + r;
                const gc = startC + c;
                if (gr >= 0 && gr < size && gc >= 0 && gc < size) {
                    if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
                        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
                        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
                        setReserved(gr, gc, isBorder || isCenter ? 1 : 0);
                    } else {
                        setReserved(gr, gc, 0); // white separator
                    }
                }
            }
        }
    };

    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);

    // 2. Timing patterns on row 6 and col 6
    for (let i = 8; i < size - 8; i++) {
        if (!isReserved[6][i]) setReserved(6, i, i % 2 === 0 ? 1 : 0);
        if (!isReserved[i][6]) setReserved(i, 6, i % 2 === 0 ? 1 : 0);
    }

    // 3. Alignment patterns if applicable
    if (align && align.length > 0) {
        align.forEach((ar) => {
            align.forEach((ac) => {
                if (isReserved[ar][ac]) return;
                for (let r = -2; r <= 2; r++) {
                    for (let c = -2; c <= 2; c++) {
                        const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2;
                        const isCenter = r === 0 && c === 0;
                        setReserved(ar + r, ac + c, isBorder || isCenter ? 1 : 0);
                    }
                }
            });
        });
    }

    // 4. Dark module
    setReserved(4 * vConf.version + 9, 8, 1);

    // 5. Reserve format info areas around finders
    for (let i = 0; i < 9; i++) {
        if (!isReserved[8][i]) isReserved[8][i] = true;
        if (!isReserved[i][8]) isReserved[i][8] = true;
    }
    for (let i = 0; i < 8; i++) {
        if (!isReserved[8][size - 1 - i]) isReserved[8][size - 1 - i] = true;
        if (!isReserved[size - 1 - i][8]) isReserved[size - 1 - i][8] = true;
    }

    // 6. Place Data Codewords (zig-zag 2-module columns)
    const allBits = [];
    allCodewords.forEach((byte) => {
        for (let i = 7; i >= 0; i--) {
            allBits.push((byte >> i) & 1);
        }
    });

    let bitIdx = 0;
    let upward = true;
    for (let rightCol = size - 1; rightCol > 0; rightCol -= 2) {
        if (rightCol === 6) rightCol--; // Skip vertical timing column
        const rows = upward ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i);
        rows.forEach((r) => {
            [rightCol, rightCol - 1].forEach((c) => {
                if (!isReserved[r][c]) {
                    const rawBit = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
                    // Apply Mask 0: (row + col) % 2 === 0
                    const mask = (r + c) % 2 === 0;
                    matrix[r][c] = rawBit ^ (mask ? 1 : 0);
                }
            });
        });
        upward = !upward;
    }

    // 7. Standard Format Info for ECC Level M (Mask 0: format bits 101010000010010)
    const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
    const topRowCols = [0, 1, 2, 3, 4, 5, 7, 8];
    const leftColRows = [7, 5, 4, 3, 2, 1, 0];

    for (let i = 0; i < 8; i++) {
        matrix[8][topRowCols[i]] = formatBits[i];
    }
    for (let i = 0; i < 7; i++) {
        matrix[leftColRows[i]][8] = formatBits[8 + i];
    }

    // Mirror format bits
    for (let i = 0; i < 8; i++) {
        matrix[size - 1 - i][8] = formatBits[i];
    }
    for (let i = 0; i < 7; i++) {
        matrix[8][size - 7 + i] = formatBits[8 + i];
    }

    return matrix;
}

/**
 * Returns an SVG string of the QR Code
 */
export function generateQRCodeSVG(text, { size = 160, margin = 2, color = "#0f172a", bg = "#ffffff" } = {}) {
    try {
        const matrix = generateQRMatrix(text);
        const moduleCount = matrix.length;
        const totalSize = moduleCount + margin * 2;
        const cellSize = (size / totalSize).toFixed(2);

        let pathData = "";
        for (let r = 0; r < moduleCount; r++) {
            for (let c = 0; c < moduleCount; c++) {
                if (matrix[r][c] === 1) {
                    const x = ((c + margin) * cellSize).toFixed(2);
                    const y = ((r + margin) * cellSize).toFixed(2);
                    pathData += `M${x},${y}h${cellSize}v${cellSize}h-${cellSize}z `;
                }
            }
        }

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="display:block;border-radius:4px;">
            <rect width="${size}" height="${size}" fill="${bg}" />
            <path d="${pathData}" fill="${color}" shape-rendering="crispEdges" />
        </svg>`;
    } catch (e) {
        // Fallback placeholder SVG
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
            <rect width="${size}" height="${size}" fill="#f1f5f9" stroke="#cbd5e1"/>
            <text x="${size / 2}" y="${size / 2}" text-anchor="middle" font-size="12" fill="#64748b">QR Code: ${escapeXml(text)}</text>
        </svg>`;
    }
}

function escapeXml(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export default {
    generateBarcodeSVG,
    generateQRCodeSVG,
    generateQRMatrix
};
