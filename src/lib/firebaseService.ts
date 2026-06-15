import { database } from "./firebase";
import {
  ref,
  set,
  push,
  onValue,
  update,
  get,
  DatabaseReference,
} from "firebase/database";

// Session data structure
export interface SessionData {
  participants: Record<string, Participant>;
  brandQuadrantResponses: BrandQuadrantResponse[];
  attentionTestResponses: AttentionTestResponse[];
  createdAt: number;
}

export interface Participant {
  id: string;
  role: "presenter" | "participant";
  joinedAt: number;
}

export interface BrandQuadrantResponse {
  participantId: string;
  brand: string;
  quadrant: "CARE" | "LUST" | "PLAY" | "SEEKING";
  timestamp: number;
}

export interface AttentionTestResponse {
  participantId: string;
  stimulusId: number;
  isTarget: boolean;
  response: boolean;
  timestamp: number;
}

// Session management
export const createSession = async (sessionId: string): Promise<void> => {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  const initialData: SessionData = {
    participants: {},
    brandQuadrantResponses: [],
    attentionTestResponses: [],
    createdAt: Date.now(),
  };
  await set(sessionRef, initialData);
};

export const joinSession = async (
  sessionId: string,
  participantId: string,
  role: "presenter" | "participant"
): Promise<void> => {
  const participantRef = ref(database, `sessions/${sessionId}/participants/${participantId}`);
  const participant: Participant = {
    id: participantId,
    role,
    joinedAt: Date.now(),
  };
  await set(participantRef, participant);
};

export const addBrandQuadrantResponse = async (
  sessionId: string,
  response: BrandQuadrantResponse
): Promise<void> => {
  const responsesRef = ref(database, `sessions/${sessionId}/brandQuadrantResponses`);
  await push(responsesRef, response);
};

export const addAttentionTestResponse = async (
  sessionId: string,
  response: AttentionTestResponse
): Promise<void> => {
  const responsesRef = ref(database, `sessions/${sessionId}/attentionTestResponses`);
  await push(responsesRef, response);
};

// Real-time listeners
export const subscribeToSession = (
  sessionId: string,
  callback: (data: SessionData | null) => void
): (() => void) => {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  const unsubscribe = onValue(sessionRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
  return unsubscribe;
};

export const subscribeToBrandQuadrantResponses = (
  sessionId: string,
  callback: (responses: BrandQuadrantResponse[]) => void
): (() => void) => {
  const responsesRef = ref(database, `sessions/${sessionId}/brandQuadrantResponses`);
  const unsubscribe = onValue(responsesRef, (snapshot) => {
    const data = snapshot.val();
    const responses = data ? Object.values(data) as BrandQuadrantResponse[] : [];
    callback(responses);
  });
  return unsubscribe;
};

export const addNeuroTunerResponse = async (
  sessionId: string,
  response: NeuroTunerResponse
): Promise<void> => {
  const responsesRef = ref(database, `sessions/${sessionId}/neuroTunerResponses`);
  await push(responsesRef, response);
};

export const subscribeToNeuroTunerResponses = (
  sessionId: string,
  callback: (responses: NeuroTunerResponse[]) => void
): (() => void) => {
  const responsesRef = ref(database, `sessions/${sessionId}/neuroTunerResponses`);
  const unsubscribe = onValue(responsesRef, (snapshot) => {
    const data = snapshot.val();
    const responses = data ? Object.values(data) as NeuroTunerResponse[] : [];
    callback(responses);
  });
  return unsubscribe;
};

// Get session data once
export const getSessionData = async (sessionId: string): Promise<SessionData | null> => {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  const snapshot = await get(sessionRef);
  return snapshot.val();
};
