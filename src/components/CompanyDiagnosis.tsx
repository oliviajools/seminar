"use client";

import { useState, useMemo } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { EMOTIONAL_SYSTEMS } from "@/data/placeholders";

export default function CompanyDiagnosis() {
  const { role, participantId, diagnosisResponses, addDiagnosisResponse } =
    useSessionStore();
  const [currentSystem, setCurrentSystem] = useState("");
  const [targetSystemVal, setTargetSystemVal] = useState("");
  const [failurePoint, setFailurePoint] = useState("");
  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState("");
  const [step3, setStep3] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!participantId) return;
    addDiagnosisResponse({
      participantId,
      currentSystem: currentSystem,
      targetSystem: targetSystemVal,
      failurePoint,
      nextSteps: [step1, step2, step3].filter(Boolean),
    });
    setSubmitted(true);
  };

  const gapMap = useMemo(() => {
    const systems = [...EMOTIONAL_SYSTEMS];
    return systems.map((sys) => {
      const asCurrent = diagnosisResponses.filter(
        (r) => r.currentSystem === sys
      ).length;
      const asTarget = diagnosisResponses.filter(
        (r) => r.targetSystem === sys
      ).length;
      return {
        system: sys,
        current: asCurrent,
        target: asTarget,
        gap: asTarget - asCurrent,
      };
    });
  }, [diagnosisResponses]);

  const topFailures = useMemo(() => {
    const counts: Record<string, number> = {};
    diagnosisResponses.forEach((r) => {
      if (r.failurePoint) {
        counts[r.failurePoint] = (counts[r.failurePoint] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [diagnosisResponses]);

  if (role === "presenter") {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="border-b border-white/20 pb-8">
            <h2 className="text-5xl font-light text-white tracking-tight">
              COMPANY DIAGNOSIS
            </h2>
            <div className="w-24 h-px bg-white mt-6"></div>
          </div>
          <p className="text-white/40">
            {diagnosisResponses.length} diagnoses received
          </p>

        <div className="bg-white/5 border border-white/10 p-8">
          <h3 className="font-light text-white mb-6 tracking-wide">NEURO GAP MAP</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {gapMap.map((item) => (
              <div key={item.system} className="text-center">
                <p className="font-medium text-white mb-4">{item.system}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs px-2">
                    <span className="text-white/60">CURRENT</span>
                    <span className="text-white">{item.current}</span>
                  </div>
                  <div className="h-1 bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-white"
                      style={{
                        width: `${
                          (item.current /
                            (Math.max(...gapMap.map((g) => Math.max(g.current, g.target))) || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs px-2">
                    <span className="text-white/60">TARGET</span>
                    <span className="text-white">{item.target}</span>
                  </div>
                  <div className="h-1 bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-white/60"
                      style={{
                        width: `${
                          (item.target /
                            (Math.max(...gapMap.map((g) => Math.max(g.current, g.target))) || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <p
                    className={`text-xs font-medium mt-2 ${
                      item.gap > 0 ? "text-white/60" : item.gap < 0 ? "text-white/40" : "text-white/60"
                    }`}
                  >
                    GAP: {item.gap > 0 ? "+" : ""}{item.gap}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {topFailures.length > 0 && (
          <div className="bg-white/5 border border-white/10 p-8">
            <h3 className="font-light text-white mb-6 tracking-wide">TOP WEAKNESSES</h3>
            <div className="space-y-3">
              {topFailures.map(([point, count]) => (
                <div
                  key={point}
                  className="flex justify-between items-center py-2 border-b border-white/10"
                >
                  <span className="text-sm text-white/80">{point}</span>
                  <span className="text-xs px-3 py-1 border border-white/20 text-white/60">
                    {count}×
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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
              DIAGNOSIS SUBMITTED
            </p>
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
            COMPANY DIAGNOSIS
          </h2>
          <div className="w-24 h-px bg-white mt-6"></div>
        </div>
      <div className="bg-white/5 border border-white/10 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-3 tracking-wider">
            WHICH EMOTIONAL SYSTEM DO WE CURRENTLY ACTIVATE?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EMOTIONAL_SYSTEMS.map((sys) => (
              <button
                key={sys}
                onClick={() => setCurrentSystem(sys)}
                className={`py-3 px-4 border text-sm transition-all tracking-wider ${
                  currentSystem === sys
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white/60 hover:border-white/40"
                }`}
              >
                {sys}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-3 tracking-wider">
            WHICH SYSTEM SHOULD WE ACTIVATE?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EMOTIONAL_SYSTEMS.map((sys) => (
              <button
                key={sys}
                onClick={() => setTargetSystemVal(sys)}
                className={`py-3 px-4 border text-sm transition-all tracking-wider ${
                  targetSystemVal === sys
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white/60 hover:border-white/40"
                }`}
              >
                {sys}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-3 tracking-wider">
            WHERE DOES OUR MARKETING CURRENTLY FAIL?
          </label>
          <textarea
            value={failurePoint}
            onChange={(e) => setFailurePoint(e.target.value)}
            placeholder="e.g. Too rational, no emotional connection..."
            className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-3 tracking-wider">
            NEXT THREE STEPS:
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={step1}
              onChange={(e) => setStep1(e.target.value)}
              placeholder="Step 1"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm"
            />
            <input
              type="text"
              value={step2}
              onChange={(e) => setStep2(e.target.value)}
              placeholder="Step 2"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm"
            />
            <input
              type="text"
              value={step3}
              onChange={(e) => setStep3(e.target.value)}
              placeholder="Step 3"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!currentSystem || !targetSystemVal}
          className="w-full py-4 bg-white text-black text-sm font-medium tracking-widest hover:bg-white/90 transition-all disabled:opacity-40"
        >
          SUBMIT DIAGNOSIS
        </button>
      </div>
    </div>
    </div>
  );
}
