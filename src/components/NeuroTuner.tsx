"use client";

import { useState, useMemo } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { EMOTIONAL_SYSTEMS, SENSORY_RECOMMENDATIONS } from "@/data/placeholders";

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

  const score = useMemo(() => {
    const z = goalDirectedness || 1;
    return Math.round((activation * freeEnergy) / z * 10) / 10;
  }, [activation, goalDirectedness, freeEnergy]);

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
    const bySystem: Record<string, { count: number; avgScore: number }> = {};
    EMOTIONAL_SYSTEMS.forEach((sys) => {
      const responses = neuroTunerResponses.filter(
        (r) => r.targetSystem === sys
      );
      const total = responses.length || 1;
      const avgScore =
        responses.reduce((s, r) => {
          const z = r.goalDirectedness || 1;
          return s + (r.activation * r.freeEnergy) / z;
        }, 0) / total;
      bySystem[sys] = { count: responses.length, avgScore: Math.round(avgScore * 10) / 10 };
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
                    {data.count} participants | Score: {data.avgScore}
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
              YOUR NEURO PROFILE
            </h2>
            <div className="w-24 h-px bg-white mt-6"></div>
          </div>
        <div className="bg-white/5 border border-white/10 p-8">
          <div className="text-center mb-8">
            <p className="text-4xl font-light text-white">{score}</p>
            <p className="text-xs text-white/60 mt-2 tracking-wider">SCORE = A × F / Z</p>
            <p className="text-lg mt-4">
              Target System: <span className="font-medium text-white">{targetSystem}</span>
            </p>
          </div>
          <h3 className="font-light text-white mb-4 tracking-wide">RECOMMENDED SENSORY VARIABLES:</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-white/60">🎨 Color:</span> {rec.color}</p>
            <p><span className="text-white/60">◼️ Form:</span> {rec.form}</p>
            <p><span className="text-white/60">🎬 Motion:</span> {rec.motion}</p>
            <p><span className="text-white/60">🔊 Sound:</span> {rec.sound}</p>
            <p><span className="text-white/60">⏱️ Timing:</span> {rec.timing}</p>
            <p><span className="text-white/60">✍️ Copy:</span> {rec.copyStyle}</p>
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
      <div className="bg-white/5 border border-white/10 p-8 space-y-6">
        <div className="text-center">
          <p className="text-4xl font-light text-white">{score}</p>
          <p className="text-xs text-white/60 mt-2 tracking-wider">SCORE = A × F / Z</p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60 tracking-wider">A = ACTIVATION</span>
            <span className="text-white font-mono">{activation}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={activation}
            onChange={(e) => setActivation(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60 tracking-wider">Z = GOAL DIRECTEDNESS</span>
            <span className="text-white font-mono">{goalDirectedness}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={goalDirectedness}
            onChange={(e) => setGoalDirectedness(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60 tracking-wider">F = FREE ENERGY</span>
            <span className="text-white font-mono">{freeEnergy}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={freeEnergy}
            onChange={(e) => setFreeEnergy(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-3 tracking-wider">
            EMOTIONAL TARGET SYSTEM
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

        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-white text-black text-sm font-medium tracking-widest hover:bg-white/90 transition-all"
        >
          CALCULATE & SUBMIT
        </button>
      </div>
    </div>
    </div>
  );
}
