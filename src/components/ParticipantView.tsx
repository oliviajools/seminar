"use client";

import { useState } from "react";
import { useSessionStore, ExerciseId } from "@/store/useSessionStore";
import AttentionTest from "./AttentionTest";
import FacePriming from "./FacePriming";
import BrandQuadrant from "./BrandQuadrant";
import FreeEnergy from "./FreeEnergy";
import NeuroTuner from "./NeuroTuner";
import CompanyDiagnosis from "./CompanyDiagnosis";

const EXERCISES: { id: ExerciseId; label: string; icon: string }[] = [
  { id: "attention", label: "Attention", icon: "👁️" },
  { id: "facepriming", label: "Priming", icon: "🧠" },
  { id: "brandquadrant", label: "Brands", icon: "📊" },
  { id: "freeenergy", label: "Energy", icon: "⚡" },
  { id: "neurotuner", label: "Tuner", icon: "🎛️" },
  { id: "diagnosis", label: "Diagnose", icon: "🏢" },
];

export default function ParticipantView() {
  const { alias, sessionCode } = useSessionStore();
  const [activeExercise, setActiveExercise] = useState<ExerciseId>("attention");

  const renderExercise = () => {
    switch (activeExercise) {
      case "attention":
        return <AttentionTest />;
      case "facepriming":
        return <FacePriming />;
      case "brandquadrant":
        return <BrandQuadrant />;
      case "freeenergy":
        return <FreeEnergy />;
      case "neurotuner":
        return <NeuroTuner />;
      case "diagnosis":
        return <CompanyDiagnosis />;
      default:
        return <AttentionTest />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-light text-white tracking-tight">
          NEUROLAB
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs px-4 py-2 border border-white/20 text-white font-mono tracking-wider">
            {sessionCode}
          </span>
          <span className="text-xs text-white/60">{alias}</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderExercise()}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 px-2 py-2 flex gap-1 overflow-x-auto">
        {EXERCISES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setActiveExercise(ex.id)}
            className={`flex-1 min-w-0 flex flex-col items-center py-2 text-xs transition-all ${
              activeExercise === ex.id
                ? "bg-white text-black font-medium tracking-wider"
                : "text-white/40 hover:text-white"
            }`}
          >
            <span className="text-lg">{ex.icon}</span>
            <span className="truncate w-full text-center mt-0.5 uppercase tracking-wider">{ex.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
