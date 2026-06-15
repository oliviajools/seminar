import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createSession as createFirebaseSession,
  joinSession as joinFirebaseSession,
  addBrandQuadrantResponse as addFirebaseBrandQuadrantResponse,
  addNeuroTunerResponse as addFirebaseNeuroTunerResponse,
  subscribeToBrandQuadrantResponses,
  subscribeToNeuroTunerResponses,
  type BrandQuadrantResponse as FirebaseBrandQuadrantResponse,
  type NeuroTunerResponse as FirebaseNeuroTunerResponse,
} from "@/lib/firebaseService";

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

  // Firebase subscription cleanup function
  unsubscribeFromFirebase: (() => void) | null;

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

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
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

      unsubscribeFromFirebase: null,

  createSession: async () => {
    const code = generateSessionCode();
    console.log("Creating session with code:", code);
    
    // Create Firebase session
    try {
      await createFirebaseSession(code);
      console.log("Firebase session created successfully");
    } catch (error) {
      console.error("Error creating Firebase session:", error);
      // Continue with local state even if Firebase fails
    }
    
    set({
      sessionCode: code,
      role: "presenter",
      participantId: "presenter",
      currentExercise: "dashboard",
    });
    console.log("Session created, role set to presenter");
  },

  joinSession: async (code: string, alias: string) => {
    const id = generateId();
    const participant: Participant = { id, alias, joinedAt: Date.now() };
    
    // Join Firebase session
    try {
      await joinFirebaseSession(code, id, "participant");
      console.log("Joined Firebase session successfully");
      
      // Subscribe to real-time updates
      const unsubscribeBrand = subscribeToBrandQuadrantResponses(code, (responses) => {
        console.log("Received brand quadrant responses from Firebase:", responses);
        const localResponses: BrandQuadrantResponse[] = responses.map((r: FirebaseBrandQuadrantResponse) => ({
          participantId: r.participantId,
          brand: r.brand,
          quadrant: r.quadrant,
        }));
        set({ brandQuadrantResponses: localResponses });
      });

      const unsubscribeNeuro = subscribeToNeuroTunerResponses(code, (responses) => {
        console.log("Received neuro tuner responses from Firebase:", responses);
        const localResponses: NeuroTunerResponse[] = responses.map((r: FirebaseNeuroTunerResponse) => ({
          participantId: r.participantId,
          activation: r.activation,
          goalDirectedness: r.goalDirectedness,
          freeEnergy: r.freeEnergy,
          targetSystem: r.targetSystem,
        }));
        set({ neuroTunerResponses: localResponses });
      });
      
      set({ unsubscribeFromFirebase: () => { unsubscribeBrand(); unsubscribeNeuro(); } });
    } catch (error) {
      console.error("Error joining Firebase session:", error);
      // Continue with local state even if Firebase fails
    }
    
    set((state) => ({
      sessionCode: code,
      role: "participant",
      participantId: id,
      alias,
      participants: [...state.participants, participant],
      currentExercise: "brandquadrant",
    }));
  },

  setRole: (role) => set({ role }),
  setCurrentExercise: (exercise) => set({ currentExercise: exercise }),

  resetSession: () => {
    // Cleanup Firebase subscription
    const { unsubscribeFromFirebase } = get();
    if (unsubscribeFromFirebase) {
      unsubscribeFromFirebase();
    }
    
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
      unsubscribeFromFirebase: null,
    });
  },

  addAttentionResponse: (r) =>
    set((state) => ({ attentionResponses: [...state.attentionResponses, r] })),
  addFacePrimingResponse: (r) =>
    set((state) => ({
      facePrimingResponses: [...state.facePrimingResponses, r],
    })),
  addBrandQuadrantResponse: async (r) => {
    const { sessionCode } = get();
    
    // Update local state
    set((state) => ({
      brandQuadrantResponses: [...state.brandQuadrantResponses, r],
    }));
    
    // Sync to Firebase if session exists
    if (sessionCode) {
      try {
        const firebaseResponse: FirebaseBrandQuadrantResponse = {
          participantId: r.participantId,
          brand: r.brand,
          quadrant: r.quadrant,
          timestamp: Date.now(),
        };
        await addFirebaseBrandQuadrantResponse(sessionCode, firebaseResponse);
        console.log("Brand quadrant response synced to Firebase");
      } catch (error) {
        console.error("Error syncing brand quadrant response to Firebase:", error);
      }
    }
  },
  addFreeEnergyResponse: (r) =>
    set((state) => ({
      freeEnergyResponses: [...state.freeEnergyResponses, r],
    })),
  addNeuroTunerResponse: async (r) => {
    const { sessionCode } = get();
    
    // Update local state
    set((state) => ({
      neuroTunerResponses: [...state.neuroTunerResponses, r],
    }));
    
    // Sync to Firebase if session exists
    if (sessionCode) {
      try {
        const firebaseResponse: FirebaseNeuroTunerResponse = {
          participantId: r.participantId,
          activation: r.activation,
          goalDirectedness: r.goalDirectedness,
          freeEnergy: r.freeEnergy,
          targetSystem: r.targetSystem,
          timestamp: Date.now(),
        };
        await addFirebaseNeuroTunerResponse(sessionCode, firebaseResponse);
        console.log("Neuro tuner response synced to Firebase");
      } catch (error) {
        console.error("Error syncing neuro tuner response to Firebase:", error);
      }
    }
  },
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
  }),
  {
    name: 'neurolab-session',
    partialize: (state) => ({
      sessionCode: state.sessionCode,
      role: state.role,
      participantId: state.participantId,
      alias: state.alias,
      currentExercise: state.currentExercise,
    }),
  }
));
