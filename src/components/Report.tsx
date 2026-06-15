"use client";

import { useMemo } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import {
  EMOTIONAL_SYSTEMS,
  SENSORY_RECOMMENDATIONS,
  VARIABLE_AXES,
  type EmotionalSystem,
  type VariableKey,
} from "@/data/placeholders";
import { computeProfileFit } from "@/lib/profileFit";

export default function Report() {
  const {
    sessionCode,
    brandQuadrantResponses,
    neuroTunerResponses,
    diagnosisResponses,
  } = useSessionStore();

  // Dominantes Ziel-System aus allen verfügbaren Signalen bestimmen
  const dominant = useMemo<EmotionalSystem>(() => {
    const counts: Record<string, number> = {};
    EMOTIONAL_SYSTEMS.forEach((s) => (counts[s] = 0));
    neuroTunerResponses.forEach((r) => (counts[r.targetSystem] += 1));
    diagnosisResponses.forEach((r) => {
      if (counts[r.targetSystem] !== undefined) counts[r.targetSystem] += 1;
    });
    brandQuadrantResponses.forEach((r) => {
      if (counts[r.quadrant] !== undefined) counts[r.quadrant] += 0.5;
    });
    const sorted = EMOTIONAL_SYSTEMS.slice().sort((a, b) => counts[b] - counts[a]);
    return sorted[0];
  }, [neuroTunerResponses, diagnosisResponses, brandQuadrantResponses]);

  // Durchschnittliche Tuner-Werte für das dominante System
  const avgValues = useMemo<Record<VariableKey, number>>(() => {
    const rel = neuroTunerResponses.filter((r) => r.targetSystem === dominant);
    if (rel.length === 0) return { activation: 5, goalDirectedness: 5, freeEnergy: 5 };
    const sum = rel.reduce(
      (acc, r) => ({
        activation: acc.activation + r.activation,
        goalDirectedness: acc.goalDirectedness + r.goalDirectedness,
        freeEnergy: acc.freeEnergy + r.freeEnergy,
      }),
      { activation: 0, goalDirectedness: 0, freeEnergy: 0 }
    );
    return {
      activation: Math.round(sum.activation / rel.length),
      goalDirectedness: Math.round(sum.goalDirectedness / rel.length),
      freeEnergy: Math.round(sum.freeEnergy / rel.length),
    };
  }, [neuroTunerResponses, dominant]);

  const fit = useMemo(() => computeProfileFit(dominant, avgValues), [dominant, avgValues]);
  const rec = SENSORY_RECOMMENDATIONS[dominant];

  const failurePoints = diagnosisResponses
    .map((r) => r.failurePoint)
    .filter(Boolean)
    .slice(0, 3);

  const handlePrint = () => window.print();

  const handleJson = () => {
    const data = {
      sessionCode,
      dominantSystem: dominant,
      profile: avgValues,
      fitPercent: fit.fitPercent,
      sensory: rec,
      hypotheses: failurePoints,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neurolab-report-${sessionCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-3 no-print">
          <div>
            <h2 className="text-5xl font-light text-white tracking-tight">REPORT</h2>
            <div className="w-24 h-px bg-white mt-6"></div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleJson}
              className="px-4 py-2 border border-white/20 text-white/70 text-xs tracking-wider hover:border-white/40"
            >
              JSON
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-black text-xs font-medium tracking-wider hover:bg-white/90"
            >
              ALS PDF DRUCKEN
            </button>
          </div>
        </div>

        {/* Druckbarer One-Pager (heller Hintergrund) */}
        <div className="report-card bg-white text-black p-10 space-y-8">
          <div className="border-b border-black/20 pb-4">
            <p className="text-xs tracking-widest text-black/40">NEUROLAB · TAKE-HOME</p>
            <h3 className="text-2xl font-light mt-1">Neuromarketing-Profil</h3>
            <p className="text-xs text-black/40 mt-1">Session {sessionCode ?? "—"}</p>
          </div>

          <div>
            <p className="text-sm text-black/50">Unser Produkt spielt primär im System</p>
            <p className="text-4xl font-light mt-1">{dominant}</p>
            <p className="text-sm text-black/50 mt-2">
              Profil-Passung: <span className="font-medium text-black">{fit.fitPercent}%</span>
            </p>
          </div>

          <div>
            <p className="text-sm text-black/50 mb-3">
              Deshalb sollte unsere Kommunikation eher:
            </p>
            <div className="space-y-4">
              {fit.variables.map((v) => {
                const axis = VARIABLE_AXES[v.key];
                return (
                  <div key={v.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{axis.low}</span>
                      <span className="font-medium">{axis.label}</span>
                      <span>{axis.high}</span>
                    </div>
                    <div className="relative h-1.5 bg-black/10">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black"
                        style={{ left: `calc(${((v.value - 1) / 9) * 100}% - 6px)` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm text-black/50 mb-3">
              Daraus ergeben sich konkrete Gestaltungsentscheidungen:
            </p>
            <table className="w-full text-sm border-collapse">
              <tbody>
                {[
                  ["Farbe", rec.color],
                  ["Form", rec.form],
                  ["Bewegung", rec.motion],
                  ["Sound", rec.sound],
                  ["Timing", rec.timing],
                  ["Copy", rec.copyStyle],
                ].map(([k, val]) => (
                  <tr key={k} className="border-b border-black/10">
                    <td className="py-2 pr-4 text-black/50 align-top w-28">{k}</td>
                    <td className="py-2">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {failurePoints.length > 0 && (
            <div>
              <p className="text-sm text-black/50 mb-2">Zu testende Hypothesen / Schwachstellen:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {failurePoints.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[10px] text-black/30 pt-4 border-t border-black/10">
            Grundlage: PROVOID Neuromarketing-Framework · Panksepp (emotionale Systeme),
            Friston (Free Energy Principle).
          </p>
        </div>
      </div>
    </div>
  );
}
