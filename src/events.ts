export const AUTHORITY_PERSONA_ID = "authority-root";

export const LANGUAGES = ["pl", "en", "es", "hi", "ar"] as const;
export type AuthorityLanguage = (typeof LANGUAGES)[number];

export const ROOT_EVENT_TYPES = [
  "SILENCE.ROOT_SESSION_STARTED",
  "SILENCE.ROOT_SESSION_COMPLETED",
  "SILENCE.ROOT_LANGUAGE_SWITCH",
  "SILENCE.ROOT_APPROVAL_REQUESTED",
  "SILENCE.ROOT_APPROVAL_ACK",
  "SILENCE.ROOT_APPROVAL_DENIED",
  "SILENCE.ROOT_CHILD_CONTEXT_SWITCH",
  "SILENCE.ROOT_PUBLIC_FRONT_INTERACTION",
] as const;

export type RootEventType = (typeof ROOT_EVENT_TYPES)[number];

export type ApprovalStatus = "none" | "requested" | "ack" | "denied";

export interface EventProvenance {
  model: string;
  build: string;
  s11_commit_id: string;
}

export interface RootEventPayload {
  language: AuthorityLanguage;
  duration_ms: number;
  completed_phi_session: boolean;
  child_persona_called: string | null;
  approval_status: ApprovalStatus;
  public_front: boolean;
  tokens_used: number;
  cost_to_serve_usd: number;
}

export interface RootEventEnvelope {
  type: RootEventType;
  version: "v1";
  timestamp: string;
  session_id: string;
  persona: string;
  user_id: string;
  payload: RootEventPayload;
  provenance: EventProvenance;
}

export function isAllowedLanguage(value: string): value is AuthorityLanguage {
  return (LANGUAGES as readonly string[]).includes(value);
}

export function assertPublicSafeUserId(userId: string): void {
  if (!userId || userId.length < 8) {
    throw new Error("user_id must be hashed or anonymous (>= 8 chars)");
  }
  if (/@/.test(userId) || /\s/.test(userId)) {
    throw new Error("user_id must not contain email or whitespace");
  }
}

export function createRootEvent(
  type: RootEventType,
  input: Omit<RootEventEnvelope, "type" | "version">
): RootEventEnvelope {
  if (!isAllowedLanguage(input.payload.language)) {
    throw new Error("language not in allow-list");
  }
  assertPublicSafeUserId(input.user_id);
  return {
    type,
    version: "v1",
    ...input,
  };
}
