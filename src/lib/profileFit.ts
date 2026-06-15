import {
  SYSTEM_PROFILES,
  VARIABLE_AXES,
  type EmotionalSystem,
  type VariableKey,
} from "@/data/placeholders";

export type VariableStatus = "low" | "ok" | "high";

export interface VariableFit {
  key: VariableKey;
  label: string;
  value: number;
  target: [number, number];
  status: VariableStatus;
  deviation: number; // 0 = im Soll
  hint: string;
}

export interface ProfileFit {
  system: EmotionalSystem;
  fitPercent: number; // 0–100, 100 = perfekt im Soll
  variables: VariableFit[];
}

const MAX_DEVIATION = 9; // Skala 1–10

function statusFor(value: number, [min, max]: [number, number]): {
  status: VariableStatus;
  deviation: number;
} {
  if (value < min) return { status: "low", deviation: min - value };
  if (value > max) return { status: "high", deviation: value - max };
  return { status: "ok", deviation: 0 };
}

function hintFor(key: VariableKey, status: VariableStatus): string {
  const axis = VARIABLE_AXES[key];
  if (status === "ok") return "Im Soll-Bereich.";
  if (status === "low") return `Zu niedrig — erhöhen Richtung „${axis.high}".`;
  return `Zu hoch — reduzieren Richtung „${axis.low}".`;
}

export function computeProfileFit(
  system: EmotionalSystem,
  values: Record<VariableKey, number>
): ProfileFit {
  const profile = SYSTEM_PROFILES[system];
  const keys: VariableKey[] = ["activation", "goalDirectedness", "freeEnergy"];

  const variables: VariableFit[] = keys.map((key) => {
    const target = profile[key];
    const { status, deviation } = statusFor(values[key], target);
    return {
      key,
      label: VARIABLE_AXES[key].label,
      value: values[key],
      target,
      status,
      deviation,
      hint: hintFor(key, status),
    };
  });

  const avgDeviation =
    variables.reduce((s, v) => s + v.deviation, 0) / variables.length;
  const fitPercent = Math.round((1 - avgDeviation / MAX_DEVIATION) * 100);

  return { system, fitPercent, variables };
}
