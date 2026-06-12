"use client";

import { useState, useMemo } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { BRANDS, QUADRANTS } from "@/data/placeholders";

export default function BrandQuadrant() {
  const { role, participantId, brandQuadrantResponses, addBrandQuadrantResponse } =
    useSessionStore();
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handlePlacement = (quadrant: "CARE" | "LUST" | "PLAY" | "SEEKING") => {
    if (!participantId) return;
    addBrandQuadrantResponse({
      participantId,
      brand: BRANDS[currentBrandIndex],
      quadrant,
    });
    if (currentBrandIndex < BRANDS.length - 1) {
      setCurrentBrandIndex((prev) => prev + 1);
    } else {
      setSubmitted(true);
    }
  };

  const heatmapData = useMemo(() => {
    return BRANDS.map((brand) => {
      const responses = brandQuadrantResponses.filter((r) => r.brand === brand);
      const total = responses.length || 1;
      const counts = {
        CARE: responses.filter((r) => r.quadrant === "CARE").length,
        LUST: responses.filter((r) => r.quadrant === "LUST").length,
        PLAY: responses.filter((r) => r.quadrant === "PLAY").length,
        SEEKING: responses.filter((r) => r.quadrant === "SEEKING").length,
      };
      const max = Math.max(...Object.values(counts));
      const disagreement =
        total > 1
          ? Math.round(
              (1 - max / total) * 100
            )
          : 0;
      return { brand, counts, total, disagreement };
    });
  }, [brandQuadrantResponses]);

  if (role === "presenter") {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="border-b border-white/20 pb-8">
            <h2 className="text-5xl font-light text-white tracking-tight">
              BRAND QUADRANT
            </h2>
            <div className="w-24 h-px bg-white mt-6"></div>
          </div>
          <p className="text-white/40">
            {brandQuadrantResponses.length} assignments total
          </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heatmapData.map((item) => (
            <div
              key={item.brand}
              className="bg-white/5 border border-white/10 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg text-white">{item.brand}</h3>
                <span className="text-xs px-3 py-1 border border-white/20 text-white/60">
                  DISAGREEMENT: {item.disagreement}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {QUADRANTS.map((q) => {
                  const count = item.counts[q.id as keyof typeof item.counts];
                  const intensity = item.total > 0 ? count / item.total : 0;
                  return (
                    <div
                      key={q.id}
                      className="p-3 text-center text-sm border border-white/10"
                      style={{
                        background: `rgba(255, 255, 255, ${intensity * 0.15})`,
                      }}
                    >
                      <p className="text-xs text-white/60">{q.label}</p>
                      <p className="text-lg font-medium text-white">{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    );
  }

  // Participant view
  if (submitted) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 p-12 text-center">
            <div className="text-8xl mb-8">✓</div>
            <p className="text-3xl text-white font-light mb-2 tracking-wide">
              ALL BRANDS ASSIGNED
            </p>
            <p className="text-white/40">
              Thank you for your participation.
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
            BRAND QUADRANT
          </h2>
          <div className="w-24 h-px bg-white mt-6"></div>
        </div>
        <p className="text-white/40">
          Assign <span className="text-white font-medium">{BRANDS[currentBrandIndex]}</span> to an
          emotional system:
        </p>
        <p className="text-white/60">
          BRAND {currentBrandIndex + 1} / {BRANDS.length}
        </p>

      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => handlePlacement("CARE")}
          className="bg-white/5 border border-white/10 p-8 hover:border-white/40 transition-all text-center"
        >
          <p className="text-3xl mb-3">💚</p>
          <p className="font-medium text-white tracking-wider">CARE</p>
          <p className="text-xs text-white/40 mt-1">CARE</p>
        </button>
        <button
          onClick={() => handlePlacement("LUST")}
          className="bg-white/5 border border-white/10 p-8 hover:border-white/40 transition-all text-center"
        >
          <p className="text-3xl mb-3">💜</p>
          <p className="font-medium text-white tracking-wider">LUST</p>
          <p className="text-xs text-white/40 mt-1">LUST</p>
        </button>
        <button
          onClick={() => handlePlacement("PLAY")}
          className="bg-white/5 border border-white/10 p-8 hover:border-white/40 transition-all text-center"
        >
          <p className="text-3xl mb-3">🧡</p>
          <p className="font-medium text-white tracking-wider">PLAY</p>
          <p className="text-xs text-white/40 mt-1">PLAY</p>
        </button>
        <button
          onClick={() => handlePlacement("SEEKING")}
          className="bg-white/5 border border-white/10 p-8 hover:border-white/40 transition-all text-center"
        >
          <p className="text-3xl mb-3">💙</p>
          <p className="font-medium text-white tracking-wider">SEEKING</p>
          <p className="text-xs text-white/40 mt-1">SEEKING</p>
        </button>
      </div>

      <div className="w-full bg-white/10 h-1">
        <div
          className="bg-white h-1 transition-all"
          style={{ width: `${((currentBrandIndex + 1) / BRANDS.length) * 100}%` }}
        />
      </div>
      </div>
    </div>
  );
}
