"use client";

import { useState, useMemo } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { FREE_ENERGY_SCENARIOS } from "@/data/placeholders";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function FreeEnergy() {
  const { role, participantId, freeEnergyResponses, addFreeEnergyResponse } =
    useSessionStore();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [sliders, setSliders] = useState({
    predictability: 5,
    stress: 5,
    curiosity: 5,
    planningNeed: 5,
    purchaseReadiness: 5,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!participantId) return;
    addFreeEnergyResponse({
      participantId,
      scenario: FREE_ENERGY_SCENARIOS[currentScenario].id,
      ...sliders,
    });
    if (currentScenario < FREE_ENERGY_SCENARIOS.length - 1) {
      setCurrentScenario((prev) => prev + 1);
      setSliders({
        predictability: 5,
        stress: 5,
        curiosity: 5,
        planningNeed: 5,
        purchaseReadiness: 5,
      });
    } else {
      setSubmitted(true);
    }
  };

  const averageData = useMemo(() => {
    return FREE_ENERGY_SCENARIOS.map((scenario) => {
      const responses = freeEnergyResponses.filter(
        (r) => r.scenario === scenario.id
      );
      const total = responses.length || 1;
      return {
        scenario: scenario.label,
        Vorhersagbarkeit:
          Math.round(
            (responses.reduce((s, r) => s + r.predictability, 0) / total) * 10
          ) / 10,
        Stress:
          Math.round(
            (responses.reduce((s, r) => s + r.stress, 0) / total) * 10
          ) / 10,
        Neugierde:
          Math.round(
            (responses.reduce((s, r) => s + r.curiosity, 0) / total) * 10
          ) / 10,
        Planungsbedarf:
          Math.round(
            (responses.reduce((s, r) => s + r.planningNeed, 0) / total) * 10
          ) / 10,
        Kaufbereitschaft:
          Math.round(
            (responses.reduce((s, r) => s + r.purchaseReadiness, 0) / total) * 10
          ) / 10,
      };
    });
  }, [freeEnergyResponses]);

  const radarData = useMemo(() => {
    const dims = [
      "Vorhersagbarkeit",
      "Stress",
      "Neugierde",
      "Planungsbedarf",
      "Kaufbereitschaft",
    ] as const;
    return dims.map((dim) => {
      const entry: Record<string, string | number> = { dimension: dim };
      averageData.forEach((s) => {
        entry[s.scenario] = s[dim];
      });
      return entry;
    });
  }, [averageData]);

  if (role === "presenter") {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="border-b border-white/20 pb-8">
            <h2 className="text-5xl font-light text-white tracking-tight">
              FREE ENERGY ROUTINE
            </h2>
            <div className="w-24 h-px bg-white mt-6"></div>
          </div>
          <p className="text-white/40">
            {freeEnergyResponses.length} ratings total
          </p>
        <div className="bg-white/5 border border-white/10 p-8">
          <ResponsiveContainer width="100%" height={450}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ffffff/10" />
              <PolarAngleAxis dataKey="dimension" stroke="#ffffff/40" fontSize={12} tick={{ fill: "#ffffff/60" }} />
              <PolarRadiusAxis stroke="#ffffff/40" domain={[0, 10]} tick={{ fill: "#ffffff/60" }} />
              {FREE_ENERGY_SCENARIOS.map((s, i) => (
                <Radar
                  key={s.id}
                  name={s.label}
                  dataKey={s.label}
                  stroke="#ffffff"
                  fill="#ffffff"
                  fillOpacity={0.15 + (i * 0.05)}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 border border-white/10 p-8">
          <h3 className="font-light text-white mb-4 tracking-wide">INTERPRETATION</h3>
          <p className="text-sm text-white/60">
            High predictability + low curiosity = low free energy (routine).
            Low predictability + high curiosity = high free energy (exploration).
            Purchase readiness peaks at moderate free energy – the "sweet spot" between habit and surprise.
          </p>
        </div>
      </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 p-12 text-center">
            <div className="text-8xl mb-8">✓</div>
            <p className="text-3xl text-white font-light mb-2 tracking-wide">
              ALL SCENARIOS RATED
            </p>
          </div>
        </div>
      </div>
    );
  }

  const scenario = FREE_ENERGY_SCENARIOS[currentScenario];

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-white/20 pb-8">
          <h2 className="text-5xl font-light text-white tracking-tight">
            FREE ENERGY ROUTINE
          </h2>
          <div className="w-24 h-px bg-white mt-6"></div>
        </div>
      <div className="bg-white/5 border border-white/10 p-8">
        <h3 className="font-medium text-lg text-white mb-2">{scenario.label}</h3>
        <p className="text-sm text-white/60 mb-6">{scenario.description}</p>

        {(
          [
            { key: "predictability", label: "PREDICTABILITY" },
            { key: "stress", label: "STRESS" },
            { key: "curiosity", label: "CURIOSITY" },
            { key: "planningNeed", label: "PLANNING NEED" },
            { key: "purchaseReadiness", label: "PURCHASE READINESS" },
          ] as const
        ).map(({ key, label }) => (
          <div key={key} className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/60 tracking-wider">{label}</span>
              <span className="text-white font-mono">
                {sliders[key]}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={sliders[key]}
              onChange={(e) =>
                setSliders((s) => ({ ...s, [key]: Number(e.target.value) }))
              }
              className="w-full"
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full mt-6 py-4 bg-white text-black text-sm font-medium tracking-widest hover:bg-white/90 transition-all"
        >
          NEXT ({currentScenario + 1}/{FREE_ENERGY_SCENARIOS.length})
        </button>
      </div>
    </div>
    </div>
  );
}
