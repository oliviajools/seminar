// Leichtgewichtige Salienz-Heuristik (Stufe-1-Validierung).
//
// WICHTIG: Dies ist eine schnelle, browser-basierte Approximation
// (lokaler Kontrast + Farbsättigung + Center-Bias) – KEIN trainiertes
// Eye-Tracking-Modell. Für belastbare Genauigkeit (~92–96 % vs. echtem
// Eye-Tracking) ist ein trainiertes Modell wie DeepGaze (eigenes Backend)
// oder eine kommerzielle API (Attention Insight / Neurons) nötig.
// Siehe FRAMEWORK.md Abschnitt 6 + Validierungs-Recherche.

export interface SaliencyResult {
  width: number;
  height: number;
  map: Float32Array; // normalisiert 0..1, Länge = width*height
  focusX: number; // 0..1 relativer Schwerpunkt
  focusY: number; // 0..1
  concentration: number; // 0..100: Anteil Salienz in den heißesten 10% der Fläche
}

function toGrayscale(data: Uint8ClampedArray, n: number): Float32Array {
  const gray = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }
  return gray;
}

function saturation(data: Uint8ClampedArray, n: number): Float32Array {
  const sat = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    sat[i] = max === 0 ? 0 : (max - min) / max;
  }
  return sat;
}

// Sobel-Kantenmagnitude als Kontrast-Proxy
function edges(gray: Float32Array, w: number, h: number): Float32Array {
  const out = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx =
        -gray[i - w - 1] - 2 * gray[i - 1] - gray[i + w - 1] +
        gray[i - w + 1] + 2 * gray[i + 1] + gray[i + w + 1];
      const gy =
        -gray[i - w - 1] - 2 * gray[i - w] - gray[i - w + 1] +
        gray[i + w - 1] + 2 * gray[i + w] + gray[i + w + 1];
      out[i] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  return out;
}

function normalize(arr: Float32Array): void {
  let max = 0;
  for (let i = 0; i < arr.length; i++) if (arr[i] > max) max = arr[i];
  if (max === 0) return;
  for (let i = 0; i < arr.length; i++) arr[i] /= max;
}

export function computeSaliency(imageData: ImageData): SaliencyResult {
  const { width: w, height: h, data } = imageData;
  const n = w * h;

  const gray = toGrayscale(data, n);
  const edge = edges(gray, w, h);
  const sat = saturation(data, n);
  normalize(edge);
  normalize(sat);

  const map = new Float32Array(n);
  const cx = w / 2;
  const cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      // Center-Bias: menschliche Fixationen sind zentrumslastig (Tatler 2007)
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist;
      const centerBias = Math.exp(-(dist * dist) / 0.35);
      const base = 0.6 * edge[i] + 0.4 * sat[i];
      map[i] = base * (0.5 + 0.5 * centerBias);
    }
  }
  normalize(map);

  // Schwerpunkt der Salienz
  let sumS = 0;
  let sumX = 0;
  let sumY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = map[y * w + x];
      sumS += s;
      sumX += s * x;
      sumY += s * y;
    }
  }
  const focusX = sumS ? sumX / sumS / w : 0.5;
  const focusY = sumS ? sumY / sumS / h : 0.5;

  // Konzentration: Anteil der Gesamtsalienz in den heißesten 10% der Pixel
  const sorted = Array.from(map).sort((a, b) => b - a);
  const top = sorted.slice(0, Math.max(1, Math.floor(n * 0.1)));
  const topSum = top.reduce((s, v) => s + v, 0);
  const concentration = sumS ? Math.round((topSum / sumS) * 100) : 0;

  return { width: w, height: h, map, focusX, focusY, concentration };
}

// Rendert die Salienz als Heatmap-Overlay auf ein Ziel-Canvas (volle Auflösung).
export function renderHeatmap(
  ctx: CanvasRenderingContext2D,
  result: SaliencyResult,
  destW: number,
  destH: number
): void {
  const { width: w, height: h, map } = result;
  const tmp = ctx.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const v = map[i];
    // Schwarz → Rot → Gelb Heatmap
    const r = Math.min(255, v * 2 * 255);
    const g = Math.min(255, Math.max(0, (v - 0.5) * 2) * 255);
    tmp.data[i * 4] = r;
    tmp.data[i * 4 + 1] = g;
    tmp.data[i * 4 + 2] = 0;
    tmp.data[i * 4 + 3] = Math.min(200, v * 255); // Alpha nach Salienz
  }
  // Auf Zwischen-Canvas zeichnen, dann skaliert übertragen
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  off.getContext("2d")!.putImageData(tmp, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(off, 0, 0, destW, destH);
}
