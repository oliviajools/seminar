import { create } from "zustand";

export type UserRole = "presenter" | "participant" | null;
export type ExerciseId =
  | "join"
  | "attention"
  | "facepriming"
  | "brandquadrant"
  | "freeenergy"
  | "neurotuner"
  | "diagnosis"
  | "dashboard";

export interface Participant {
  id: string;
  alias: string;
  joinedAt: number;
}

export interface AttentionResponse {
  participantId: string;
  stimulusIndex: number;
  recall: boolean;
  emotion: string;
  brandMemory: boolean;
  brands?: string;
  products?: string;
}

export interface FacePrimingResponse {
  participantId: string;
  round: number;
  primingWord: string;
  category: "positive" | "negative" | "neutral";
  choseLeft: boolean;
  primedSide: "left" | "right";
  vergewaltigerFaceSelected: boolean;
}

export interface BrandQuadrantResponse {
  participantId: string;
  brand: string;
  quadrant: "CARE" | "LUST" | "PLAY" | "SEEKING";
}

export interface FreeEnergyResponse {
  participantId: string;
  scenario: string;
  predictability: number;
  stress: number;
  curiosity: number;
  planningNeed: number;
  purchaseReadiness: number;
}

export interface NeuroTunerResponse {
  participantId: string;
  activation: number;
  goalDirectedness: number;
  freeEnergy: number;
  targetSystem: "SEEKING" | "LUST" | "CARE" | "PLAY";
}

export interface DiagnosisResponse {
  participantId: string;
  currentSystem: string;
  targetSystem: string;
  failurePoint: string;
  nextSteps: string[];
}

interface SessionState {
  sessionCode: string | null;
  role: UserRole;
  participantId: string | null;
  alias: string | null;
  participants: Participant[];
  currentExercise: ExerciseId;
  timerSeconds: number;
  isTimerRunning: boolean;

  attentionResponses: AttentionResponse[];
  facePrimingResponses: FacePrimingResponse[];
  brandQuadrantResponses: BrandQuadrantResponse[];
  freeEnergyResponses: FreeEnergyResponse[];
  neuroTunerResponses: NeuroTunerResponse[];
  diagnosisResponses: DiagnosisResponse[];

  // Actions
  createSession: () => void;
  joinSession: (code: string, alias: string) => void;
  setRole: (role: UserRole) => void;
  setCurrentExercise: (exercise: ExerciseId) => void;
  resetSession: () => void;
  addAttentionResponse: (r: AttentionResponse) => void;
  addFacePrimingResponse: (r: FacePrimingResponse) => void;
  addBrandQuadrantResponse: (r: BrandQuadrantResponse) => void;
  addFreeEnergyResponse: (r: FreeEnergyResponse) => void;
  addNeuroTunerResponse: (r: NeuroTunerResponse) => void;
  addDiagnosisResponse: (r: DiagnosisResponse) => void;
  setTimer: (seconds: number) => void;
  setTimerRunning: (running: boolean) => void;
  exportData: () => string;
}

function generateSessionCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 12);
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionCode: null,
  role: null,
  participantId: null,
  alias: null,
  participants: [],
  currentExercise: "join",
  timerSeconds: 0,
  isTimerRunning: false,

  attentionResponses: [],
  facePrimingResponses: [],
  brandQuadrantResponses: [],
  freeEnergyResponses: [],
  neuroTunerResponses: [],
  diagnosisResponses: [],

  createSession: () => {
    const code = generateSessionCode();
    console.log("Creating session with code:", code);
    set({
      sessionCode: code,
      role: "presenter",
      participantId: "presenter",
      currentExercise: "dashboard",
    });
    console.log("Session created, role set to presenter");
  },

  joinSession: (code: string, alias: string) => {
    const id = generateId();
    const participant: Participant = { id, alias, joinedAt: Date.now() };
    set((state) => ({
      sessionCode: code,
      role: "participant",
      participantId: id,
      alias,
      participants: [...state.participants, participant],
      currentExercise: "attention",
    }));
  },

  setRole: (role) => set({ role }),
  setCurrentExercise: (exercise) => set({ currentExercise: exercise }),

  resetSession: () =>
    set({
      sessionCode: null,
      role: null,
      participantId: null,
      alias: null,
      participants: [],
      currentExercise: "join",
      timerSeconds: 0,
      isTimerRunning: false,
      attentionResponses: [],
      facePrimingResponses: [],
      brandQuadrantResponses: [],
      freeEnergyResponses: [],
      neuroTunerResponses: [],
      diagnosisResponses: [],
    }),

  addAttentionResponse: (r) =>
    set((state) => ({ attentionResponses: [...state.attentionResponses, r] })),
  addFacePrimingResponse: (r) =>
    set((state) => ({
      facePrimingResponses: [...state.facePrimingResponses, r],
    })),
  addBrandQuadrantResponse: (r) =>
    set((state) => ({
      brandQuadrantResponses: [...state.brandQuadrantResponses, r],
    })),
  addFreeEnergyResponse: (r) =>
    set((state) => ({
      freeEnergyResponses: [...state.freeEnergyResponses, r],
    })),
  addNeuroTunerResponse: (r) =>
    set((state) => ({
      neuroTunerResponses: [...state.neuroTunerResponses, r],
    })),
  addDiagnosisResponse: (r) =>
    set((state) => ({
      diagnosisResponses: [...state.diagnosisResponses, r],
    })),

  setTimer: (seconds) => set({ timerSeconds: seconds }),
  setTimerRunning: (running) => set({ isTimerRunning: running }),

  exportData: () => {
    const state = get();
    return JSON.stringify(
      {
        sessionCode: state.sessionCode,
        participants: state.participants,
        attentionResponses: state.attentionResponses,
        facePrimingResponses: state.facePrimingResponses,
        brandQuadrantResponses: state.brandQuadrantResponses,
        freeEnergyResponses: state.freeEnergyResponses,
        neuroTunerResponses: state.neuroTunerResponses,
        diagnosisResponses: state.diagnosisResponses,
      },
      null,
      2
    );
  },
}));
