export interface NrrWindow {
  startIso: string;
  endIso: string;
}

export interface CohortPoint {
  cohortId: string;
  arrStart: number;
  arrEnd: number;
}

export const NRR_PASS_THRESHOLD = 125;
export const NRR_KILL_THRESHOLD = 110;

export function calculateNrr(arrStart: number, arrEnd: number): number {
  if (arrStart <= 0) {
    throw new Error("ARR_start must be > 0");
  }
  return (arrEnd / arrStart) * 100;
}

export function nrrGate(nrr: number): "PASS" | "WATCH" | "STOP_USAGE_EXPANSION" {
  if (nrr >= NRR_PASS_THRESHOLD) return "PASS";
  if (nrr < NRR_KILL_THRESHOLD) return "STOP_USAGE_EXPANSION";
  return "WATCH";
}

export function shouldStopAfterTwoQuarters(
  previous: number,
  current: number
): boolean {
  return previous < NRR_KILL_THRESHOLD && current < NRR_KILL_THRESHOLD;
}

export function attributeToAuthority(params: {
  authorityWasEntry: boolean;
  approvalGateUsed: boolean;
}): number {
  return params.authorityWasEntry || params.approvalGateUsed ? 1 : 0;
}
