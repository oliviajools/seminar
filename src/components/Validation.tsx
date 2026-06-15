"use client";

import { useRef, useState } from "react";
import { computeSaliency, renderHeatmap, type SaliencyResult } from "@/lib/saliency";

const SALIENCY_MAX_DIM = 256;

export default function Validation() {
  const imgCanvasRef = useRef<HTMLCanvasElement>(null);
  const heatCanvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<SaliencyResult | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [hypothesis, setHypothesis] = useState("");
  const [loaded, setLoaded] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const displayW = Math.min(img.width, 640);
      const scale = displayW / img.width;
      const displayH = Math.round(img.height * scale);

      // Anzeige-Canvas (Originalbild)
      const imgCanvas = imgCanvasRef.current!;
      imgCanvas.width = displayW;
      imgCanvas.height = displayH;
      const ictx = imgCanvas.getContext("2d")!;
      ictx.drawImage(img, 0, 0, displayW, displayH);

      // Kleines Canvas für die Salienz-Berechnung (Performance)
      const sScale = Math.min(1, SALIENCY_MAX_DIM / Math.max(img.width, img.height));
      const sw = Math.max(1, Math.round(img.width * sScale));
      const sh = Math.max(1, Math.round(img.height * sScale));
      const small = document.createElement("canvas");
      small.width = sw;
      small.height = sh;
      const sctx = small.getContext("2d")!;
      sctx.drawImage(img, 0, 0, sw, sh);
      const data = sctx.getImageData(0, 0, sw, sh);

      const res = computeSaliency(data);
      setResult(res);
      setLoaded(true);

      // Heatmap rendern
      const heat = heatCanvasRef.current!;
      heat.width = displayW;
      heat.height = displayH;
      const hctx = heat.getContext("2d")!;
      hctx.clearRect(0, 0, displayW, displayH);
      renderHeatmap(hctx, res, displayW, displayH);
    };
    img.src = URL.createObjectURL(file);
  };

  const focusLabel = (r: SaliencyResult) => {
    const v = r.focusY < 0.4 ? "oben" : r.focusY > 0.6 ? "unten" : "mittig";
    const h = r.focusX < 0.4 ? "links" : r.focusX > 0.6 ? "rechts" : "zentral";
    return `${v} ${h}`;
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="border-b border-white/20 pb-8">
          <h2 className="text-5xl font-light text-white tracking-tight">VALIDIERUNG</h2>
          <div className="w-24 h-px bg-white mt-6"></div>
          <p className="text-white/50 mt-4 max-w-2xl text-sm">
            Schließt den Loop: Hat die Gestaltung die erwartete Wirkung? Drei
            Stufen, von sofort & kostenlos bis zur Labor-Messung.
          </p>
        </div>

        {/* 3-Stufen-Leiter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-white bg-white/5 p-5">
            <p className="text-xs text-white/40 tracking-widest mb-2">STUFE 1 · AKTIV</p>
            <h3 className="text-white font-medium mb-2">Instant (in-App)</h3>
            <p className="text-xs text-white/50">
              KI-Aufmerksamkeits-Heatmap aus dem Bild – ohne Proband:innen, in Sekunden.
            </p>
          </div>
          <div className="border border-white/15 p-5 opacity-70">
            <p className="text-xs text-white/30 tracking-widest mb-2">STUFE 2 · UPGRADE</p>
            <h3 className="text-white/70 font-medium mb-2">Panel (remote)</h3>
            <p className="text-xs text-white/40">
              Webcam-Eyetracking + Mimik-Coding mit echten Menschen. Geringe Kosten.
            </p>
          </div>
          <div className="border border-white/15 p-5 opacity-70">
            <p className="text-xs text-white/30 tracking-widest mb-2">STUFE 3 · PREMIUM</p>
            <h3 className="text-white/70 font-medium mb-2">Labor (EEG)</h3>
            <p className="text-xs text-white/40">
              Echtes EEG + professionelles Eye-Tracking. Wissenschaftlich belastbar.
            </p>
          </div>
        </div>

        {/* Ehrlicher Disclaimer */}
        <div className="border-l-2 border-white/40 bg-white/5 px-4 py-3">
          <p className="text-xs text-white/50">
            <span className="text-white/80">Hinweis zur Genauigkeit:</span> Stufe 1
            ist eine schnelle Heuristik (Kontrast · Farbe · Center-Bias) als erste
            Näherung. Sie zeigt, <em>wohin</em> der Blick zuerst tendiert – nicht die
            emotionale Bewertung. Für ~92–96 % Eye-Tracking-Genauigkeit braucht es ein
            trainiertes Modell (DeepGaze/Backend) oder eine API; emotionale Wirkung
            misst Stufe 2/3.
          </p>
        </div>

        {/* Stufe 1: Upload + Heatmap */}
        <div className="bg-white/5 border border-white/10 p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-white font-light tracking-wide">STUFE 1 · AUFMERKSAMKEITS-CHECK</h3>
            <label className="px-4 py-2 border border-white/20 text-white/70 text-xs tracking-wider hover:border-white/40 cursor-pointer">
              BILD HOCHLADEN
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>

          {!loaded && (
            <p className="text-white/30 text-sm py-12 text-center border border-dashed border-white/10">
              Kampagnen-Visual, Anzeige oder Verpackung hochladen, um die
              vorhergesagte Erst-Aufmerksamkeit zu sehen.
            </p>
          )}

          {loaded && result && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className="px-4 py-2 border border-white/20 text-white/70 text-xs tracking-wider hover:border-white/40"
                >
                  {showHeatmap ? "HEATMAP AUS" : "HEATMAP AN"}
                </button>
              </div>
              <div className="relative inline-block">
                <canvas ref={imgCanvasRef} className="block max-w-full" />
                <canvas
                  ref={heatCanvasRef}
                  className="absolute top-0 left-0 max-w-full pointer-events-none transition-opacity"
                  style={{ opacity: showHeatmap ? 0.7 : 0 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-white/10 p-4">
                  <p className="text-3xl font-light text-white">{result.concentration}%</p>
                  <p className="text-xs text-white/50 mt-1">
                    Aufmerksamkeits-Konzentration
                    <br />
                    <span className="text-white/30">
                      Anteil in den heißesten 10 % der Fläche
                    </span>
                  </p>
                </div>
                <div className="border border-white/10 p-4">
                  <p className="text-3xl font-light text-white capitalize">{focusLabel(result)}</p>
                  <p className="text-xs text-white/50 mt-1">
                    Blick-Schwerpunkt
                    <br />
                    <span className="text-white/30">Wohin der Blick zuerst wandert</span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/40">
                {result.concentration >= 45
                  ? "Klarer Fokus – ein dominanter Blickfang. Gut für direkte Botschaften (hohe Zielstrebigkeit)."
                  : result.concentration >= 30
                  ? "Mittlere Streuung – mehrere konkurrierende Reize. Prüfen, ob das gewollt ist."
                  : "Stark verteilte Aufmerksamkeit – kein klarer Anker. Risiko: Botschaft geht unter."}
              </p>
            </div>
          )}
        </div>

        {/* Hypothese (Loop-Schluss) */}
        <div className="bg-white/5 border border-white/10 p-6 space-y-3">
          <h3 className="text-white font-light tracking-wide">ZU TESTENDE HYPOTHESE</h3>
          <p className="text-xs text-white/40">
            Formuliere die Gestaltungsentscheidung als prüfbare Annahme – so wird aus
            dem Bauchgefühl ein messbares Experiment.
          </p>
          <textarea
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="z.B. Wenn wir die Überraschung von 3 → 7 erhöhen, steigt die Erst-Aufmerksamkeit auf das Logo."
            className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
