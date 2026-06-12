"use client";

import { useState } from "react";
import { useSessionStore } from "@/store/useSessionStore";

export default function SessionJoin() {
  const [code, setCode] = useState("");
  const [alias, setAlias] = useState("");
  const { createSession, joinSession } = useSessionStore();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() && alias.trim()) {
      joinSession(code.trim().toUpperCase(), alias.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-light text-white tracking-tight">
            NEUROLAB
          </h1>
          <div className="w-24 h-px bg-white mx-auto mt-6"></div>
          <p className="mt-8 text-white/60 text-lg font-light">
            Interactive Neuromarketing Seminar
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-12">
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2 tracking-wider">
                SESSION CODE
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. ABC123"
                className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-lg uppercase tracking-widest"
                maxLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2 tracking-wider">
                ALIAS / NICKNAME
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={!code.trim() || !alias.trim()}
              className="w-full py-4 bg-white text-black text-sm font-medium tracking-widest transition-all hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              JOIN
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                console.log("Create session button clicked");
                createSession();
              }}
              className="w-full py-4 border border-white/20 text-white/60 text-sm hover:border-white/40 hover:text-white tracking-wider transition-all"
            >
              CREATE SESSION (PRESENTER)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
