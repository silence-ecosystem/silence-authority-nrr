# @silence/authority-nrr

Public MIT module: event contract + NRR pipeline for a SILENCE **authority persona**.

This is instrumentation, not the persona itself.

- Events: `SILENCE.ROOT_*`
- Languages: `pl | en | es | hi | ar`
- Metric: cohort NRR from authority-attributed ARR
- License: MIT
- Status: v0.1.0 public contract

Repo: https://github.com/silence-ecosystem/silence-authority-nrr

## Why this is public

The contract must be forkable, auditable, and independent of private apps.

Private bindings (photo, owner ACK channel, prices) stay outside this package.

## Event types

| Type | When |
|---|---|
| `SILENCE.ROOT_SESSION_STARTED` | session open |
| `SILENCE.ROOT_SESSION_COMPLETED` | completed φ-session |
| `SILENCE.ROOT_LANGUAGE_SWITCH` | language change |
| `SILENCE.ROOT_APPROVAL_REQUESTED` | owner ACK requested |
| `SILENCE.ROOT_APPROVAL_ACK` | owner accepted |
| `SILENCE.ROOT_APPROVAL_DENIED` | owner denied |
| `SILENCE.ROOT_CHILD_CONTEXT_SWITCH` | handoff to child persona |
| `SILENCE.ROOT_PUBLIC_FRONT_INTERACTION` | public site interaction |

## Envelope

See `src/events.ts`. Rules:

- no PII — `user_id` hashed or anonymous
- `language` only from allow-list
- `completed_phi_session` only when session definition is met
- events are append-only

## NRR

```
NRR = (ARR_end_cohort / ARR_start_cohort) * 100
```

Proposed hybrid-phase gate (owner-tunable):

- pass: NRR >= 125
- stop usage expansion: NRR < 110 for two consecutive quarters

See `src/nrr.ts`.

## Boundary

Do not import private EE packages into this module.
Consumers talk through this contract only.
