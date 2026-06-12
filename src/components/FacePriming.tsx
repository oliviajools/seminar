"use client";

import { useState, useMemo } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { FACES } from "@/data/placeholders";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const TOTAL_ROUNDS = 10;
const FIRST_ROUND_DURATION = 50; // 50ms for first round
const SUBSEQUENT_ROUND_DURATION = 50; // 50ms for subsequent rounds

interface Round {
  leftWord: string;
  rightWord: string;
  leftFaceId: number;
  rightFaceId: number;
}

const WORD_PAIRS = [
  { left: "Rapist", right: "Philosophist" },
  { left: "Philosophist", right: "Rapist" },
];

function generateRounds(): Round[] {
  const rounds: Round[] = [];
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    const wordPair = WORD_PAIRS[i % WORD_PAIRS.length];
    // Randomly select one male and one female face
    const maleFaces = FACES.filter(f => f.gender === "male");
    const femaleFaces = FACES.filter(f => f.gender === "female");
    const leftFace = maleFaces[Math.floor(Math.random() * maleFaces.length)];
    const rightFace = femaleFaces[Math.floor(Math.random() * femaleFaces.length)];
    
    rounds.push({
      leftWord: wordPair.left,
      rightWord: wordPair.right,
      leftFaceId: leftFace.id,
      rightFaceId: rightFace.id,
    });
  }
  return rounds;
}

export default function FacePriming() {
  const { role, participantId, facePrimingResponses, addFacePrimingResponse } =
    useSessionStore();
  const [rounds] = useState<Round[]>(generateRounds);
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<"waiting" | "subliminal" | "selection" | "done">("waiting");
  const [showSubliminal, setShowSubliminal] = useState(false);

  const startRound = () => {
    setPhase("subliminal");
    setShowSubliminal(true);
    const duration = currentRound === 0 ? FIRST_ROUND_DURATION : SUBSEQUENT_ROUND_DURATION;
    setTimeout(() => {
      setShowSubliminal(false);
      setPhase("selection");
    }, duration);
  };

  const handleChoice = (choseLeft: boolean) => {
    if (!participantId) return;
    const round = rounds[currentRound];
    const vergewaltigerOnLeft = round.leftWord === "Rapist";
    const vergewaltigerFaceSelected = vergewaltigerOnLeft ? choseLeft : !choseLeft;

    addFacePrimingResponse({
      participantId,
      round: currentRound,
      primingWord: round.leftWord,
      category: "negative",
      choseLeft,
      primedSide: "left",
      vergewaltigerFaceSelected,
    });

    if (currentRound < TOTAL_ROUNDS - 1) {
      setCurrentRound((prev) => prev + 1);
      setPhase("waiting");
    } else {
      setPhase("done");
    }
  };

  const biasData = useMemo(() => {
  const total = facePrimingResponses.length || 1;
  const vergewaltigerSelected = facePrimingResponses.filter(
    (r) => r.vergewaltigerFaceSelected
  ).length;
  return [
    {
      category: "Vergewaltiger-Gesicht",
      selected: Math.round((vergewaltigerSelected / total) * 100),
      notSelected: Math.round(((total - vergewaltigerSelected) / total) * 100),
    },
  ];
}, [facePrimingResponses]);

  if (role === "presenter") {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="border-b border-white/20 pb-8">
            <h2 className="text-5xl font-light text-white tracking-tight">
              FACE PRIMING
            </h2>
            <div className="w-24 h-px bg-white mt-6"></div>
          </div>
          
          {phase === "waiting" && (
            <div className="bg-white/5 border border-white/10 p-12">
              <div className="text-center">
                <h3 className="text-2xl font-light text-white mb-8 tracking-wide">
                  SUBLIMINAL PRIMING
                </h3>
                <div className="inline-block px-6 py-2 border border-white/20 mb-8">
                  <span className="text-white/60 text-sm tracking-widest">
                    ROUND {currentRound + 1} / {TOTAL_ROUNDS}
                  </span>
                </div>
                <p className="text-white/40 text-sm mb-2">
                  DURATION: 50MS
                </p>
                <p className="text-white/30 text-xs mb-12 tracking-wider">
                  WORDS: "RAPIST" / "PHILOSOPHIST"
                </p>
                <button
                  onClick={startRound}
                  className="px-12 py-4 bg-white text-black text-sm font-medium tracking-widest hover:bg-white/90 transition-all"
                >
                  START ROUND
                </button>
              </div>
            </div>
          )}

          {phase === "subliminal" && showSubliminal && (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center gap-48">
              <div className="flex flex-col items-center w-1/2 h-full justify-center">
                <div className="w-full max-w-2xl aspect-square border border-white/10 flex items-center justify-center mb-12 overflow-hidden">
                  <img
                    src={FACES.find(f => f.id === rounds[currentRound].leftFaceId)?.imageUrl}
                    alt="Left face"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <p className="text-4xl font-light text-white tracking-[0.3em]">
                  {rounds[currentRound].leftWord}
                </p>
              </div>
              <div className="flex flex-col items-center w-1/2 h-full justify-center">
                <div className="w-full max-w-2xl aspect-square border border-white/10 flex items-center justify-center mb-12 overflow-hidden">
                  <img
                    src={FACES.find(f => f.id === rounds[currentRound].rightFaceId)?.imageUrl}
                    alt="Right face"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <p className="text-4xl font-light text-white tracking-[0.3em]">
                  {rounds[currentRound].rightWord}
                </p>
              </div>
            </div>
          )}

          {phase === "selection" && (
            <div className="bg-white/5 border border-white/10 p-12">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-light text-white mb-4 tracking-wide">
                  SELECTION PHASE
                </h3>
                <div className="inline-block px-6 py-2 border border-white/20">
                  <span className="text-white/60 text-sm tracking-widest">
                    WAITING FOR SELECTION
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-16 max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 border border-white/10 flex items-center justify-center mb-6 overflow-hidden">
                    <img
                      src={FACES.find(f => f.id === rounds[currentRound].leftFaceId)?.imageUrl}
                      alt="Left face"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <p className="text-white/40 text-xs tracking-widest">LEFT</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 border border-white/10 flex items-center justify-center mb-6 overflow-hidden">
                    <img
                      src={FACES.find(f => f.id === rounds[currentRound].rightFaceId)?.imageUrl}
                      alt="Right face"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <p className="text-white/40 text-xs tracking-widest">RIGHT</p>
                </div>
              </div>
            </div>
          )}

          {phase === "done" && (
            <div className="bg-white/5 border border-white/10 p-12">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-light text-white mb-4 tracking-wide">
                  RESULTS
                </h3>
                <div className="inline-block px-6 py-2 border border-white/20">
                  <span className="text-white/60 text-sm tracking-widest">
                    {facePrimingResponses.length} RESPONSES
                  </span>
                </div>
              </div>
              <p className="text-white/40 text-center text-sm mb-12">
                Subliminal presentation with word priming
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={biasData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#ffffff/10" />
                  <XAxis dataKey="category" stroke="#ffffff/40" fontSize={12} tick={{ fill: "#ffffff/60" }} />
                  <YAxis stroke="#ffffff/40" tick={{ fill: "#ffffff/60" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "#000000",
                      border: "1px solid #ffffff/20",
                      borderRadius: 0,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="selected" fill="#ffffff" name="SELECTED %" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="notSelected" fill="#ffffff/20" name="NOT SELECTED %" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
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
            FACE PRIMING
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
                You will see two faces briefly and select the more sympathetic one
              </p>
              <div className="inline-block px-6 py-2 border border-white/20 mt-8">
                <span className="text-white/60 text-sm tracking-widest">
                  ROUND {currentRound + 1} / {TOTAL_ROUNDS}
                </span>
              </div>
            </div>
          </div>
        )}

        {phase === "subliminal" && (
          <div className="bg-white/5 border border-white/10 p-12">
            <div className="text-center">
              <div className="inline-block px-6 py-2 border border-white/20 mb-4">
                <span className="text-white/60 text-sm tracking-widest">
                  READY FOR SELECTION
                </span>
              </div>
              <p className="text-white/40">
                Presenter is showing subliminal presentation
              </p>
            </div>
          </div>
        )}

        {phase === "selection" && (
          <div className="bg-white/5 border border-white/10 p-12">
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-2 border border-white/20 mb-4">
                <span className="text-white/60 text-sm tracking-widest">
                  ROUND {currentRound + 1} / {TOTAL_ROUNDS}
                </span>
              </div>
              <p className="text-3xl text-white font-light mb-2 tracking-wide">
                WHICH FACE APPEARS MORE SYMPATHETIC?
              </p>
              <p className="text-white/40">
                Select the face that seems more sympathetic to you
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
              <button
                onClick={() => handleChoice(true)}
                className="aspect-square bg-white/5 border border-white/10 hover:border-white/40 transition-all flex flex-col items-center justify-center p-8"
              >
                <div className="w-32 h-32 border border-white/10 flex items-center justify-center mb-6 overflow-hidden">
                  <img
                    src={FACES.find(f => f.id === rounds[currentRound].leftFaceId)?.imageUrl}
                    alt="Left face"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <span className="text-white/40 text-xs tracking-widest">LEFT</span>
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="aspect-square bg-white/5 border border-white/10 hover:border-white/40 transition-all flex flex-col items-center justify-center p-8"
              >
                <div className="w-32 h-32 border border-white/10 flex items-center justify-center mb-6 overflow-hidden">
                  <img
                    src={FACES.find(f => f.id === rounds[currentRound].rightFaceId)?.imageUrl}
                    alt="Right face"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <span className="text-white/40 text-xs tracking-widest">RIGHT</span>
              </button>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="bg-white/5 border border-white/10 p-12">
            <div className="text-center">
              <div className="text-8xl mb-8">✓</div>
              <p className="text-3xl text-white font-light mb-2 tracking-wide">
                EXPERIMENT COMPLETE
              </p>
              <p className="text-white/40">
                Thank you for your participation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
