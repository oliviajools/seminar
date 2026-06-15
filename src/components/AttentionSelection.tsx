"use client";

import { useState } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { STIMULI } from "@/data/placeholders";

export default function AttentionSelection() {
  const { role, participantId, attentionResponses, addAttentionResponse } =
    useSessionStore();
  const [selectedStimuli, setSelectedStimuli] = useState<number[]>([]);

  const toggleStimulusSelection = (id: number) => {
    setSelectedStimuli((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const submitSelection = () => {
    if (!participantId) return;
    selectedStimuli.forEach((stimulusId) => {
      const stimulusIndex = STIMULI.findIndex((s) => s.id === stimulusId);
      addAttentionResponse({
        participantId,
        stimulusIndex,
        recall: true,
        emotion: "",
        brandMemory: false,
      });
    });
    setSelectedStimuli([]);
  };

  if (role === "presenter") {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="border-b border-white/20 pb-8">
            <h2 className="text-5xl font-light text-white tracking-tight">
              AD SELECTION
            </h2>
            <div className="w-24 h-px bg-white mt-6"></div>
          </div>
        <div className="bg-white/5 border border-white/10 p-8">
          <h3 className="font-light text-white mb-4 tracking-wide">PARTICIPANTS SELECTING REMEMBERED ADS...</h3>
          <p className="text-sm text-white/40 mb-4">
            Showing all {STIMULI.length} ads for selection
          </p>
        </div>
      </div>
      </div>
    );
  }

  // Participant view
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-white/20 pb-8">
          <h2 className="text-5xl font-light text-white tracking-tight">
            AD SELECTION
          </h2>
          <div className="w-24 h-px bg-white mt-6"></div>
        </div>
        <p className="text-white/40">
          Select all ads you remember from the Attention Test.
        </p>

      <div className="bg-white/5 border border-white/10 p-8 space-y-6">
        <div>
          <h3 className="font-light text-white mb-2 tracking-wide">WHICH ADS DO YOU REMEMBER?</h3>
          <p className="text-sm text-white/60">
            Selected: {selectedStimuli.length} / {STIMULI.length}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STIMULI.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleStimulusSelection(s.id)}
              className={`aspect-video overflow-hidden border-2 transition-all ${
                selectedStimuli.includes(s.id)
                  ? "border-white"
                  : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/20"
              }`}
            >
              <img
                src={s.imageUrl}
                alt={s.label}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
        <button
          onClick={submitSelection}
          disabled={selectedStimuli.length === 0}
          className="w-full py-4 bg-white text-black text-sm font-medium tracking-widest hover:bg-white/90 transition-all disabled:opacity-40"
        >
          SUBMIT ({selectedStimuli.length} selected)
        </button>
      </div>
    </div>
    </div>
  );
}
