"use client";

import { useState, useMemo } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import {
  EMOTIONAL_SYSTEMS,
  SENSORY_RECOMMENDATIONS,
  VARIABLE_AXES,
} from "@/data/placeholders";
import { computeProfileFit } from "@/lib/profileFit";

export default function NeuroTuner() {
  const { role, participantId, neuroTunerResponses, addNeuroTunerResponse } =
    useSessionStore();
  const [activation, setActivation] = useState(5);
  const [goalDirectedness, setGoalDirectedness] = useState(5);
  const [freeEnergy, setFreeEnergy] = useState(5);
  const [targetSystem, setTargetSystem] = useState<
    "SEEKING" | "LUST" | "CARE" | "PLAY"
  >("SEEKING");
  const [submitted, setSubmitted] = useState(false);

  const fit = useMemo(
    () =>
      computeProfileFit(targetSystem, {
        activation,
        goalDirectedness,
        freeEnergy,
      }),
    [targetSystem, activation, goalDirectedness, freeEnergy]
  );

  const handleSubmit = () => {
    if (!participantId) return;
    addNeuroTunerResponse({
      participantId,
      activation,
      goalDirectedness,
      freeEnergy,
      targetSystem,
    });
    setSubmitted(true);
  };

  const aggregated = useMemo(() => {
    const bySystem: Record<string, { count: number; avgFit: number }> = {};
    EMOTIONAL_SYSTEMS.forEach((sys) => {
      const responses = neuroTunerResponses.filter(
        (r) => r.targetSystem === sys
      );
      const total = responses.length || 1;
      const avgFit =
        responses.reduce((s, r) => {
          return (
            s +
            computeProfileFit(sys, {
              activation: r.activation,
              goalDirectedness: r.goalDirectedness,
              freeEnergy: r.freeEnergy,
            }).fitPercent
          );
        }, 0) / total;
      bySystem[sys] = {
        count: responses.length,
        avgFit: Math.round(avgFit),
      };
    });
    return bySystem;
  }, [neuroTunerResponses]);

  if (role === "presenter") {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="border-b border-white/20 pb-8">
            <h2 className="text-5xl font-light text-white tracking-tight">
              NEURO PRODUCT TUNER
            </h2>
            <div className="w-24 h-px bg-white mt-6"></div>
          </div>
          <p className="text-white/40">
            {neuroTunerResponses.length} settings received
          </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EMOTIONAL_SYSTEMS.map((sys) => {
            const data = aggregated[sys];
            const rec = SENSORY_RECOMMENDATIONS[sys];
            return (
              <div
                key={sys}
                className="bg-white/5 border border-white/10 p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-white">{sys}</h3>
                  <span className="text-sm text-white/60">
                    {data.count} Teilnehmer | Ø Fit: {data.avgFit}%
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="text-white/40">Color:</span> {rec.color}</p>
                  <p><span className="text-white/40">Form:</span> {rec.form}</p>
                  <p><span className="text-white/40">Motion:</span> {rec.motion}</p>
                  <p><span className="text-white/40">Sound:</span> {rec.sound}</p>
                  <p><span className="text-white/40">Timing:</span> {rec.timing}</p>
                  <p><span className="text-white/40">Copy:</span> {rec.copyStyle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    );
  }

  if (submitted) {
    const rec = SENSORY_RECOMMENDATIONS[targetSystem];
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="border-b border-white/20 pb-8">
            <h2 className="text-5xl font-light text-white tracking-tight">
              DEIN NEURO-PROFIL
            </h2>
            <div className="w-24 h-px bg-white mt-6"></div>
          </div>
        <div className="bg-white/5 border border-white/10 p-8">
          <div className="text-center mb-8">
            <p className="text-5xl font-light text-white">{fit.fitPercent}%</p>
            <p className="text-xs text-white/60 mt-2 tracking-wider">
              PASSUNG ZUM SOLL-PROFIL
            </p>
            <p className="text-lg mt-4">
              Ziel-System: <span className="font-medium text-white">{targetSystem}</span>
            </p>
          </div>
          <div className="space-y-3 mb-8">
            {fit.variables.map((v) => (
              <div key={v.key} className="border border-white/10 p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-white tracking-wider">{v.label}</span>
                  <span
                    className={`text-xs px-2 py-0.5 border ${
                      v.status === "ok"
                        ? "border-white/60 text-white"
                        : "border-white/20 text-white/40"
                    }`}
                  >
                    {v.status === "ok" ? "IM SOLL" : v.status === "low" ? "ZU NIEDRIG" : "ZU HOCH"}
                  </span>
                </div>
                <p className="text-xs text-white/50">
                  {v.value}/10 · Soll {v.target[0]}–{v.target[1]} · {v.hint}
                </p>
              </div>
            ))}
          </div>
          <h3 className="font-light text-white mb-4 tracking-wide">EMPFOHLENE SENSORISCHE REIZE:</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-white/60">Farbe:</span> {rec.color}</p>
            <p><span className="text-white/60">Form:</span> {rec.form}</p>
            <p><span className="text-white/60">Bewegung:</span> {rec.motion}</p>
            <p><span className="text-white/60">Sound:</span> {rec.sound}</p>
            <p><span className="text-white/60">Timing:</span> {rec.timing}</p>
            <p><span className="text-white/60">Copy:</span> {rec.copyStyle}</p>
          </div>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-white/20 pb-8">
          <h2 className="text-5xl font-light text-white tracking-tight">
            NEURO PRODUCT TUNER
          </h2>
          <div className="w-24 h-px bg-white mt-6"></div>
        </div>
      <div className="bg-white/5 border border-white/10 p-8 space-y-8">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-3 tracking-wider">
            ZIEL-SYSTEM
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EMOTIONAL_SYSTEMS.map((sys) => (
              <button
                key={sys}
                onClick={() => setTargetSystem(sys)}
                className={`py-3 px-4 border text-sm font-medium transition-all tracking-wider ${
                  targetSystem === sys
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white/60 hover:border-white/40"
                }`}
              >
                {sys}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center border-y border-white/10 py-4">
          <p className="text-5xl font-light text-white">{fit.fitPercent}%</p>
          <p className="text-xs text-white/60 mt-2 tracking-wider">
            LIVE-PASSUNG ZU {targetSystem}
          </p>
        </div>

        {fit.variables.map((v) => {
          const axis = VARIABLE_AXES[v.key];
          const setter =
            v.key === "activation"
              ? setActivation
              : v.key === "goalDirectedness"
              ? setGoalDirectedness
              : setFreeEnergy;
          return (
            <div key={v.key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white tracking-wider">{axis.label}</span>
                <span className="text-white font-mono">{v.value}/10</span>
              </div>
              <p className="text-xs text-white/40 mb-2">{axis.question}</p>
              <div className="relative">
                {/* Soll-Bereich-Markierung */}
                <div className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-white/20 pointer-events-none"
                  style={{
                    left: `${((v.target[0] - 1) / 9) * 100}%`,
                    width: `${((v.target[1] - v.target[0]) / 9) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={v.value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full relative"
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/30 mt-1">
                <span>{axis.low}</span>
                <span>{axis.high}</span>
              </div>
              <p
                className={`text-xs mt-1 ${
                  v.status === "ok" ? "text-white/70" : "text-white/40"
                }`}
              >
                Soll {v.target[0]}–{v.target[1]} · {v.hint}
              </p>
            </div>
          );
        })}

        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-white text-black text-sm font-medium tracking-widest hover:bg-white/90 transition-all"
        >
          PROFIL ABSENDEN
        </button>
      </div>
    </div>
    </div>
  );
}
