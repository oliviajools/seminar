"use client";

import { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useSessionStore, ExerciseId } from "@/store/useSessionStore";
import BrandQuadrant from "./BrandQuadrant";
import FreeEnergy from "./FreeEnergy";
import NeuroTuner from "./NeuroTuner";
import CompanyDiagnosis from "./CompanyDiagnosis";

const EXERCISES: { id: ExerciseId; label: string; icon: string }[] = [
  { id: "brandquadrant", label: "Brand Quadrant", icon: "📊" },
  { id: "freeenergy", label: "Free Energy", icon: "⚡" },
  { id: "neurotuner", label: "Neuro Tuner", icon: "🎛️" },
  { id: "diagnosis", label: "Diagnosis", icon: "🏢" },
];

export default function PresenterDashboard() {
  const {
    sessionCode,
    currentExercise,
    setCurrentExercise,
    timerSeconds,
    setTimer,
    isTimerRunning,
    setTimerRunning,
    resetSession,
    participants,
    exportData,
  } = useSessionStore();

  const [showQR, setShowQR] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimer(timerSeconds - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, setTimer, setTimerRunning]);

  const startTimer = (seconds: number) => {
    setTimer(seconds);
    setTimerRunning(true);
  };

  const handleExport = useCallback(() => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neurolab-session-${sessionCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportData, sessionCode]);

  const currentExerciseIndex = EXERCISES.findIndex(
    (e) => e.id === currentExercise
  );

  const nextExercise = () => {
    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex < EXERCISES.length) {
      setCurrentExercise(EXERCISES[nextIndex].id);
    }
  };

  const joinUrl = typeof window !== "undefined" ? window.location.origin : "";

  const renderExercise = () => {
    switch (currentExercise) {
      case "brandquadrant":
        return <BrandQuadrant />;
      case "freeenergy":
        return <FreeEnergy />;
      case "neurotuner":
        return <NeuroTuner />;
      case "diagnosis":
        return <CompanyDiagnosis />;
      default:
        return <BrandQuadrant />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-light text-white tracking-tight">
            NEUROLAB
          </h1>
          <span className="text-xs px-4 py-2 border border-white/20 text-white font-mono tracking-wider">
            {sessionCode}
          </span>
          <span className="text-xs text-white/60">
            {participants.length} PARTICIPANTS
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isTimerRunning && (
            <span className="text-lg font-mono text-white font-light">
              {Math.floor(timerSeconds / 60)}:
              {(timerSeconds % 60).toString().padStart(2, "0")}
            </span>
          )}
          <button
            onClick={() => startTimer(60)}
            className="px-4 py-2 text-xs border border-white/20 text-white hover:border-white/40 tracking-wider"
          >
            1MIN
          </button>
          <button
            onClick={() => startTimer(180)}
            className="px-4 py-2 text-xs border border-white/20 text-white hover:border-white/40 tracking-wider"
          >
            3MIN
          </button>
          <button
            onClick={() => setShowQR(!showQR)}
            className="px-4 py-2 text-xs border border-white/20 text-white hover:border-white/40 tracking-wider"
          >
            QR
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-black border-r border-white/10 p-4 space-y-1 hidden md:block overflow-y-auto">
          {EXERCISES.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => setCurrentExercise(ex.id)}
              className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-all ${
                currentExercise === ex.id
                  ? "bg-white text-black font-medium tracking-wider"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{ex.icon}</span>
              <span className="uppercase tracking-wider">{ex.label}</span>
            </button>
          ))}
          <div className="pt-6 border-t border-white/10 mt-6 space-y-2">
            <button
              onClick={nextExercise}
              disabled={currentExerciseIndex >= EXERCISES.length - 1}
              className="w-full py-3 bg-white text-black text-xs font-medium tracking-widest disabled:opacity-40"
            >
              NEXT →
            </button>
            <button
              onClick={handleExport}
              className="w-full py-3 border border-white/20 text-white/60 text-xs hover:border-white/40 hover:text-white tracking-wider"
            >
              EXPORT
            </button>
            <button
              onClick={resetSession}
              className="w-full py-3 border border-white/20 text-white/40 text-xs hover:border-white/40 hover:text-white tracking-wider"
            >
              RESET
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {showQR && (
            <div className="bg-black border-b border-white/10 p-6 flex items-center justify-center gap-8">
              <div className="bg-white p-4">
                <QRCodeSVG
                  value={`${joinUrl}?code=${sessionCode}`}
                  size={100}
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-white/60 tracking-wider mb-2">JOIN AT:</p>
                <p className="text-sm font-mono text-white mb-2">
                  {joinUrl}
                </p>
                <p className="text-2xl font-light text-white tracking-widest">
                  {sessionCode}
                </p>
              </div>
            </div>
          )}
          {renderExercise()}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden bg-black border-t border-white/10 px-2 py-2 flex gap-1 overflow-x-auto">
        {EXERCISES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setCurrentExercise(ex.id)}
            className={`flex-shrink-0 px-4 py-2 text-xs ${
              currentExercise === ex.id
                ? "bg-white text-black font-medium"
                : "text-white/40"
            }`}
          >
            {ex.icon}
          </button>
        ))}
      </nav>
    </div>
  );
}
