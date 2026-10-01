# Step contracts and run state

This is the shared execution contract for the master and all six step skills.
Values live in the authorized current session or an approved private run
record, never in this public repository. Do not store credentials or webhook
URLs in the run record or include them in output.

## Input verification

Before a step, resolve only its required private configuration and verify
its inputs. A nonempty string or user assertion alone is not verification.
Check accessible asset URLs, project/document versions, publication status,
and approval evidence with the authorized tools where available. For supplied
baseline data, check its provenance, date window, dimensions, metric,
attribution, taxonomy, and CJA instance. If verification is impossible,
explain the limitation and pause before dependent mutations.

All related artifacts must belong to the same campaign, tenant, and selected
image. Reusing an artifact does not authorize recreating or republishing it.
An explicit exclusion may reuse verified outputs; never silently run an
excluded producer to repair missing inputs. Ask for the missing values or
permission to revise the plan instead.

## Step inputs and outputs

`CAMPAIGN_FIELDS` contains `Headline`, `SubHeadline`, `CTA`, `ImageURL`,
`RecordName`, `Season`, `Quarter`, `LaunchDate`, and `EndDate`. Its `ImageURL`
must equal the selected `FIREFLY_IMG`; `RecordName` must equal `Headline`.
Preserve `SubHeadline` internally and map it to `Subheadline` only where the
asset-creation tool template explicitly requires that spelling.

| Step | Skill | Required inputs | Required output evidence |
| --- | --- | --- | --- |
| 1 | `secur-csc-fsi-baseline` | Authorized CJA context and approved demo-fixture prerequisites; Firefly configuration when generation is approved | `CJA_CONTEXT`, `OPENING_BASELINE`, `SELECTED_ATTRIBUTES`, user-selected `FIREFLY_IMG` |
| 2 | `secur-csc-fsi-project` | Verified `FIREFLY_IMG`; `SELECTED_ATTRIBUTES` or an approved campaign brief | Validated `CAMPAIGN_FIELDS`, `ProjectID`, `TaskID`, `DocID`, `CurrentVersionID`, project link and creation evidence |
| 3 | `secur-csc-fsi-review` | Verified `CurrentVersionID` and its campaign/project association | `REVIEW_STATUS`, `REVIEW_RESULT` or explicit non-retrieval decision, `CREATIVE_EXECUTION_APPROVED` |
| 4 | `secur-csc-fsi-assets` | Verified `FIREFLY_IMG`, `CAMPAIGN_FIELDS`, `ProjectID`, `CREATIVE_EXECUTION_APPROVED`; no failed or pending review | `IMAGE1_1`, `IMAGE2_1`, `IMAGE4_3`, `SITE_HERO`, AEM asset-creation evidence, verified `AEM_ASSETS_STATUS` |
| 5 | `secur-csc-fsi-page` | Verified `SITE_HERO`, `CAMPAIGN_FIELDS`, `AEM_ASSETS_STATUS`; approved-status source assets, configured model/page, real brand policy, publication permission | `AEM_Image_ID`, `CONTENT_FRAGMENT_PATH`, `PREVIEW_URL`, `DA_EDITOR_URL`, passed `PAGE_GOVERNANCE_STATUS`, verified `PAGE_PUBLISH_STATUS` |
| 6 | `secur-csc-fsi-follow-up` | Verified `CJA_CONTEXT`, `OPENING_BASELINE`, refreshed-content evidence and approval for a simulated follow-up | `SIMULATED_FOLLOW_UP` with provenance, assumptions, and explicit simulation labels |

`CJA_CONTEXT` records the project, data view, dimension/metric IDs,
participation attribution, baseline dates, and the shared six-attribute
taxonomy. `OPENING_BASELINE` preserves the observed report and distinguishes
approved synthetic demo fixtures from real observations. Never quietly
replace these with look-alike data from a different CJA instance.

For step 6, refreshed-content evidence may be verified output from step 5 or
an existing verified page/content update supplied for this campaign. If
step 5 is excluded, it must not be claimed as executed or published by this
run. Step 6 is a projection, not an actual future CJA measurement.

## Private configuration by step

| Step | Required configuration or external prerequisites |
| --- | --- |
| 1 | `CJA_PROJECT_ID`, `CJA_DATA_VIEW_ID`, `CJA_CONTENT_ATTRIBUTE_DIMENSION_ID`, `CJA_APPOINTMENT_METRIC_ID`, confirmed dimension/metric mappings; `FIREFLY_GENERATION_WORKFLOW_ID` and `FIREFLY_PROMPT_NODE_ID` for generation |
| 2 | `WF_INSTANCE_URL`, `FUSION_CREATE_PROJECT_WEBHOOK_URL`; applicable planning fields and authorized Fusion scenario |
| 3 | Authorized content-review and Workfront result tools, configured Secur brand policy and `SECUR_BRAND_ID` where the connected review integration requires it |
| 4 | `IMAGE_CROP_WORKFLOW_ID`, `IMAGE_CROP_NODE_ID`, `FUSION_CREATE_ASSETS_WEBHOOK_URL`, `WF_INSTANCE_URL`, access to created AEM assets for status verification |
| 5 | `AEM_AUTHOR`, `AEM_SITE_HERO_SEARCH_QUERY`, `AEM_FRAGMENTS_PATH`, `SOURCE_ASSETS_PATH`, `DEMO_SITE_URL`, configured `Hero` model, real Secur brand policy and governance tools, DA tools and the external content-fragment skill |
| 6 | Verified baseline and refreshed-content context; no Firefly, Fusion, or page-mutation secrets are required just to generate a projection |

Other constants in the shared rules apply only when used by the selected
integration. Never ask for unrelated configuration merely because it exists
in the original end-to-end checklist.

## Approval gates

- Step 1 asks whether to generate creative after showing its baseline and
  attributes, then obtains the user's chosen image. A declined generation
  leaves `FIREFLY_IMG` unresolved unless an existing verified image is supplied.
- Step 3 asks whether to retrieve review results. Choosing "Skip and continue
  to next steps" preserves the original opt-out: record `REVIEW_STATUS` as
  `not-retrieved` and `CREATIVE_EXECUTION_APPROVED` as true, not a passed review.
  If results are retrieved, failed or pending review blocks the run; after a
  passed review, ask "Send for creative execution?" and honor the decision.
- If step 3 itself is excluded, step 4 still needs verified approval evidence.
  The user may explicitly approve continuing without retrieved review results
  only under the same disclosed opt-out; never override a known failed or
  pending review. This is an approval check, not permission to run step 3.
- Step 4 discloses partial crop output and asks whether to continue with usable
  links. Downstream publication still requires verified required AEM assets;
  a failed crop workflow is never relabeled as a successful workflow.
- Step 5 requires approved source metadata and successful fragment and page
  governance. Obtain approval before publishing; verify each publication.
- Before step 6, ask "Should I run a simulated 90-day follow-up report?" unless
  the user has already explicitly approved that simulation for this run.
  A declined simulation pauses the plan; it does not authorize a live report.
- Approvals apply to the current artifacts and actions. Replacing the image,
  campaign, document version, or page invalidates affected approval evidence.

## STEP_RESULT

Each child returns one result to its caller, then stops:

```text
STEP_RESULT = {
  step: 1..6,
  skill: exact installed skill name,
  status: complete | partial | paused | blocked | failed | unconfirmed,
  outputs: verified values with artifact provenance,
  approvals: decisions and the artifacts they apply to,
  missing_inputs: unresolved required fields or configuration,
  evidence: actual tool outcomes and verification results
}
```

For `complete`, every required output for that selected step must be present
and verified. A skipped review-result retrieval is an explicit recorded
decision, not fabricated review output. Tool failure must remain in evidence
even if verified partial artifacts are later reused.

The master merges only verified outputs. It continues automatically only
after `complete`, rechecking the next selected step's contract. For `partial`,
`paused`, `blocked`, `failed`, or `unconfirmed`, explain the situation and
stop the run; the user may later approve reuse of independently verified
artifacts and revise or resume the plan. Never hide a failure behind a
successful-looking aggregate result.

## Master run state and resumption

Record `selected_steps`, `excluded_steps`, each step's `STEP_RESULT`, supplied
input provenance, approval decisions, and outstanding dependencies in the
current private session. Use `excluded` for intentionally omitted steps in
the plan and `reused` for verified existing inputs; neither means executed.

On resume, preserve verified artifacts and decisions that still apply.
Recheck changed or stale state; do not regenerate completed projects, reviews,
assets, or publications merely to fill the record. Do not automatically
retry timed-out mutations. A declined approval leaves later selected steps
pending; do not mark them excluded or completed.

The final summary distinguishes executed, reused, excluded, pending, and
failed work. Show links and stakeholder outcomes rather than credentials,
raw request syntax, or internal IDs.
