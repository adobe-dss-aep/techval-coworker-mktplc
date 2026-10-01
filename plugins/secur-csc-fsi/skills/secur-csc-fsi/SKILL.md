---
name: secur-csc-fsi
description: >
  Master coordinator for the Secur Financial/Get Moving Content Supply Chain
  demo in Claude Desktop/Cowork. Run all six modular steps by default, or a
  requested subset with verified dependencies: CJA baseline and creative,
  Workfront project, content review, AEM assets, DA page publication, and a
  labeled simulated follow-up. Use for secur-csc-fsi, the Secur/Get Moving
  end-to-end build, selected numbered steps, exclusions, or resuming a run.
  Requires authorized connectors and private configuration for selected steps.
---

# secur-csc-fsi - master coordinator

Coordinate the six installed step skills in the current Claude Desktop/Cowork
session. The default plan duplicates the original six-step demo outcomes,
including its user approval gates, image prompts, and appointment metrics.
This is orchestration of instruction-based skills, not an unattended script.

## Required shared context

Before planning or executing, read:

- [Shared rules and configuration](references/common.md).
- [Step contracts and run state](references/run-contract.md).

These files are also loaded by standalone step skills. Do not copy step
procedures into this master or replace shared requirements with guesses.

## Available steps

| Step | Installed skill | Outcome |
| --- | --- | --- |
| 1 | [secur-csc-fsi-baseline](../secur-csc-fsi-baseline/SKILL.md) | CJA opening baseline, ranked attributes, and selected creative |
| 2 | [secur-csc-fsi-project](../secur-csc-fsi-project/SKILL.md) | Constrained campaign copy and verified Workfront project |
| 3 | [secur-csc-fsi-review](../secur-csc-fsi-review/SKILL.md) | Content-review outcome and creative-execution decision |
| 4 | [secur-csc-fsi-assets](../secur-csc-fsi-assets/SKILL.md) | Cropped images and verified AEM assets |
| 5 | [secur-csc-fsi-page](../secur-csc-fsi-page/SKILL.md) | Governed fragment, published DA preview, and editor link |
| 6 | [secur-csc-fsi-follow-up](../secur-csc-fsi-follow-up/SKILL.md) | Clearly labeled simulated 90-day follow-up |

## Activation and scope

Activate for an explicit `secur-csc-fsi` request, the Secur/Secur Financial
Get Moving demo build, or a request to include, exclude, or resume its steps.
Do not automatically activate for an unrelated generic demo or FSI request.

Without explicit scope restrictions, use `selected_steps = [1, 2, 3, 4, 5, 6]`
and `excluded_steps = []`. "Run all" still requires the normal approval gates;
it does not preapprove generation, creative execution, publication, or the
simulated follow-up.

For a single numbered step, select only that step and verify its inputs.
For explicit include or exclude instructions, derive the corresponding subset
and retain numerical order. Never automatically re-add an excluded producer.
If the requested step or scope is ambiguous or contradictory, ask one focused
clarifying question before any action. Do not interpret "skip" as skipping
governance or approvals unless the shared contract explicitly permits that
specific opt-out.

## Plan and preflight

1. Record the selected and excluded steps in private session run state.
   Present the ordered plan and any reused inputs in plain language.
2. Read each selected step's input/output and configuration contract. Load
   only the connectors and private values needed for those steps and for
   verification of supplied artifacts.
3. For every required input, identify either an earlier selected producer or
   a supplied/existing artifact. Outputs from selected producers remain
   pending until verified after execution; do not request them prematurely.
4. If a producer is excluded, validate its supplied outputs and their
   campaign/tenant/image provenance before dependent mutations. If required
   values are absent or cannot be verified, explain exactly what is missing
   and ask for those values or permission to revise the plan. Return blocked
   until resolved. Never silently execute an excluded step.
5. Check approved demo-fixture prerequisites and required supporting material.
   Do not require unrelated connectors, secrets, or brand assets for excluded
   steps that do not otherwise affect selected work.
6. On resume, reuse still-valid verified outputs and approvals. Inspect
   timeouts or stale artifacts before retrying; never recreate a completed
   project or publication merely to rebuild state.

## Execute selected steps

Run selected steps sequentially, never in parallel. Before each step, recheck
its required inputs, artifact association, and approvals against the shared
contract. Values such as `PLACEHOLDER` are unresolved, not usable inputs.

Activate the installed step skill if the environment supports skill selection.
Otherwise, read its linked packaged `SKILL.md` and follow it in the same
session. Do not invent a skill-invocation tool, shell out to Claude Code,
start an independent conversation that loses run state, or fabricate MCP
tool names. If the selected skill cannot be loaded, surface that error and
stop; do not approximate its procedure from this overview.

Pass only the needed verified inputs and private configuration references.
Apply the child procedure once, collect its `STEP_RESULT`, merge verified
outputs and approval evidence, then return control to this master. Child
skills never automatically invoke subsequent steps.

Continue only after a `complete` result and a fresh check of the next selected
step's contract. A `partial`, `paused`, `blocked`, `failed`, or `unconfirmed`
result stops automatic progression. Explain the actual state; the user may
later approve reuse of verified partial artifacts and revise or resume the
plan. Never report an aggregate success while a selected step is unresolved.

## Preserve the original decision gates

- Step 1 asks whether to generate assets and obtains the user's preferred
  image. Do not proceed to dependent mutations without verified `FIREFLY_IMG`.
- Step 3 keeps the optional review-result retrieval and creative-execution
  decision. Its explicit retrieval opt-out is not a passed review. If step 3
  is excluded, verify supplied approval evidence or ask for the disclosed
  opt-out allowed by the shared contract; do not run review behind the scenes.
- Step 4 reports failed/partial crop output honestly and requires a user
  decision before reusing partial links. Asset-creation timeouts are
  unconfirmed until verified; do not advance to publication on assumed success.
- Step 5 requires approved assets, fragment and page governance, publication
  approval, and verified publication results.
- Before selected step 6, ask "Should I run a simulated 90-day follow-up
  report?" unless already explicitly approved for this run. A declined
  simulation pauses the plan. Do not run a real report instead.

If a gate is declined, leave later selected steps pending. Excluded steps
stay excluded, reused inputs stay reused, and neither is marked executed.

## Final summary

Distinguish executed, reused, excluded, pending, and failed work. Include
verified stakeholder links and remaining prerequisites. For a successful
full run, summarize the baseline, selected creative, Workfront project,
actual review decision, cropped assets, governed page preview/editor, and
simulated follow-up. Label the projection `SIMULATED - NOT OBSERVED DATA`.

For a subset, summarize only selected outcomes and reused evidence. Never
claim this run created or published an excluded step's artifacts. Do not
expose credentials, webhook URLs, raw tool requests, or private internal IDs.

## Example requests

- "Use secur-csc-fsi to run the complete Secur Get Moving demo."
- "Run steps 2 through 5 using this existing approved image and campaign brief;
  exclude the baseline and simulated follow-up."
- "Run only step 5 with these verified AEM assets and campaign fields."
- "Resume after content review without recreating the project."

Verify supplied dependencies in each example before mutation; these examples
do not waive any shared approval or publication requirement.
