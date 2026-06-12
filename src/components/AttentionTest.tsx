"use client";

import { useState, useEffect, useCallback } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { STIMULI, EXPOSURE_STIMULI } from "@/data/placeholders";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Phase = "waiting" | "exposure" | "recall" | "done";

const EMOTIONS = ["Freude", "Überraschung", "Neugierde", "Gleichgültigkeit", "Abneigung"];

export default function AttentionTest() {
  const { role, participantId, attentionResponses, addAttentionResponse } =
    useSessionStore();
  const [phase, setPhase] = useState<Phase>("waiting");
  const [currentStimulusIndex, setCurrentStimulusIndex] = useState(0);
  const [recallInput, setRecallInput] = useState({
    brands: "",
    products: "",
  });

  const startExposure = useCallback(() => {
    setPhase("exposure");
    setCurrentStimulusIndex(0);
  }, []);

  useEffect(() => {
    if (phase === "exposure") {
      const timer = setTimeout(() => {
        if (currentStimulusIndex < EXPOSURE_STIMULI.length - 1) {
          setCurrentStimulusIndex((prev) => prev + 1);
        } else {
          setPhase("recall");
          setCurrentStimulusIndex(0);
        }
      }, 1300);
      return () => clearTimeout(timer);
    }
  }, [phase, currentStimulusIndex]);

  const submitRecall = () => {
    if (!participantId) return;
    addAttentionResponse({
      participantId,
      stimulusIndex: -1,
      recall: true,
      emotion: recallInput.brands,
      brandMemory: true,
      brands: recallInput.brands,
      products: recallInput.products,
    });
    setPhase("done");
  };

  const chartData = STIMULI.map((s, i) => {
    const responses = attentionResponses.filter((r) => r.stimulusIndex === i);
    const total = responses.length || 1;
    return {
      name: s.brand,
      recall: Math.round((responses.filter((r) => r.recall).length / total) * 100),
      brandMemory: Math.round(
        (responses.filter((r) => r.brandMemory).length / total) * 100
      ),
    };
  });

  if (role === "presenter") {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="border-b border-white/20 pb-8">
            <h2 className="text-5xl font-light text-white tracking-tight">
              ATTENTION TEST
            </h2>
            <div className="w-24 h-px bg-white mt-6"></div>
          </div>

          <div className="flex items-center justify-between">
          {phase === "waiting" && (
            <button
              onClick={startExposure}
              className="px-12 py-4 bg-white text-black text-sm font-medium tracking-widest hover:bg-white/90 transition-all"
            >
              START EXPOSURE
            </button>
          )}
          </div>

        {phase === "exposure" && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <img
              src={EXPOSURE_STIMULI[currentStimulusIndex].imageUrl}
              alt={EXPOSURE_STIMULI[currentStimulusIndex].label}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-4 right-4 text-sm text-white bg-black/50 px-2 py-1 rounded">
              {currentStimulusIndex + 1} / {EXPOSURE_STIMULI.length}
            </div>
          </div>
        )}

        {phase === "recall" && (
          <div className="bg-white/5 border border-white/10 p-12">
            <h3 className="text-2xl font-light text-white mb-8 tracking-wide">
              RECALL PHASE
            </h3>
            <p className="text-white/40 mb-4">
              {attentionResponses.length} responses received
            </p>
          </div>
        )}

        {phase === "done" && (
          <div className="bg-white/5 border border-white/10 p-12">
            <h3 className="text-2xl font-light text-white mb-8 tracking-wide">
              RESULTS
            </h3>
            <p className="text-white/40 mb-8">
              {attentionResponses.length} responses total
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#ffffff/10" />
                <XAxis dataKey="name" stroke="#ffffff/40" fontSize={12} tick={{ fill: "#ffffff/60" }} />
                <YAxis stroke="#ffffff/40" tick={{ fill: "#ffffff/60" }} />
                <Tooltip
                  contentStyle={{
                    background: "#000000",
                    border: "1px solid #ffffff/20",
                    borderRadius: 0,
                  }}
                />
                <Legend />
                <Bar dataKey="recall" fill="#ffffff" name="RECALL %" radius={[0, 0, 0, 0]} />
                <Bar dataKey="brandMemory" fill="#ffffff/20" name="BRAND MEMORY %" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
    );
  }

  // Participant view
  else {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-white/20 pb-8">
          <h2 className="text-5xl font-light text-white tracking-tight">
            ATTENTION TEST
          </h2>
          <div className="w-24 h-px bg-white mt-6"></div>
        </div>

      {phase === "waiting" && (
        <div className="bg-white/5 border border-white/10 p-12">
          <div className="text-center">
            <div className="text-8xl mb-8">👁️</div>
            <p className="text-xl text-white/80 mb-4 font-light">
              WAITING FOR PRESENTER
            </p>
            <p className="text-white/40 mb-2">
              You will see ads and then enter brands and products
            </p>
            <button
              onClick={startExposure}
              className="mt-8 px-12 py-4 bg-white text-black text-sm font-medium tracking-widest hover:bg-white/90 transition-all"
            >
              START DEMO
            </button>
          </div>
        </div>
      )}

      {phase === "exposure" && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <img
            src={EXPOSURE_STIMULI[currentStimulusIndex].imageUrl}
            alt={EXPOSURE_STIMULI[currentStimulusIndex].label}
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-4 right-4 text-sm text-white bg-black/50 px-2 py-1 rounded">
            {currentStimulusIndex + 1} / {EXPOSURE_STIMULI.length}
          </div>
        </div>
      )}

      {phase === "recall" && (
        <div className="bg-white/5 border border-white/10 p-12">
          <h3 className="text-2xl font-light text-white mb-8 tracking-wide">
            WHAT DID YOU SEE?
          </h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/60 mb-2 tracking-wider">
              WHICH BRANDS DID YOU SEE?
            </label>
            <textarea
              value={recallInput.brands}
              onChange={(e) => setRecallInput((prev) => ({ ...prev, brands: e.target.value }))}
              placeholder="e.g. Nike, Apple, Coca-Cola..."
              className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
              rows={3}
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-white/60 mb-2 tracking-wider">
              WHICH PRODUCTS WERE ADVERTISED?
            </label>
            <textarea
              value={recallInput.products}
              onChange={(e) => setRecallInput((prev) => ({ ...prev, products: e.target.value }))}
              placeholder="e.g. Shoes, Smartphones, Beverages..."
              className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
              rows={3}
            />
          </div>

          <button
            onClick={submitRecall}
            disabled={!recallInput.brands.trim() || !recallInput.products.trim()}
            className="w-full py-4 bg-white text-black text-sm font-medium tracking-widest hover:bg-white/90 transition-all disabled:opacity-40"
          >
            SUBMIT
          </button>
        </div>
      )}

      {phase === "done" && (
        <div className="bg-white/5 border border-white/10 p-12">
          <div className="text-center">
            <div className="text-8xl mb-8">✓</div>
            <p className="text-3xl text-white font-light mb-2 tracking-wide">
              THANK YOU
            </p>
            <p className="text-white/40">
              Responses sent. Ad selection at end of seminar.
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
  }
}
