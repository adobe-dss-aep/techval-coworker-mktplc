---
name: secur-csc-fsi-follow-up
description: Run step 6 of the Secur Financial/Get Moving demo: produce a clearly labeled simulated 90-day follow-up using a verified opening baseline and refreshed-content context. Use for a Secur follow-up projection or an explicit request for secur-csc-fsi-follow-up. Never present it as observed analytics.
---

# secur-csc-fsi-follow-up

## Execution contract

Before any action, read [shared rules and configuration](../secur-csc-fsi/references/common.md)
and [step contracts and run state](../secur-csc-fsi/references/run-contract.md).
Apply the input, configuration, output, and approval requirements for step 6.
Load only the connectors and private configuration required for this step.
This skill is standalone: never invoke the master, another step, or a later
phase automatically. Existing verified inputs can replace earlier execution.
Missing or unverified inputs must be reported explicitly; pause rather than
starting an upstream skill or inventing values.

Return SIMULATED_FOLLOW_UP with assumptions, baseline provenance, and the label SIMULATED - NOT OBSERVED DATA on every chart and table. Keep the same CJA instance, taxonomy, and conversion event as CJA_CONTEXT. Obtain approval for the simulation unless already granted for this run. Do not write simulated data to CJA.

Return a STEP_RESULT using the shared contract, then stop. The master, if
present, decides whether to continue. Instructions below do not override
these requirements or the shared safety rules.

## Procedure

### STEP 6 — CJA / CONTENT ANALYTICS: CLOSING WINDOW (PROGRESSION)

This step closes the loop using the supplied CJA_CONTEXT and OPENING_BASELINE. It does not run the baseline skill.

- [ ] Same instance, same six-attribute taxonomy, same conversion event as Step 1 — re-pointed
      at refreshed content, not a second look-alike report
- [ ] Seeded so real-patient/in-motion carries forward as the top driver across all three
      channels, and activity-matched personalization shows a genuine negative on email (the
      credible loser — no uniform lift)
- [ ] Fix the carry-forward/drop attributes in rehearsal; never invent them live

Create an illustrative 90-day projection, not a measured follow-up report.
Label every table and chart "SIMULATED - NOT OBSERVED DATA", state the baseline
and assumptions, and keep real CJA results separate from generated estimates.
Do not seed synthetic values into live analytics or claim an actual uplift.
