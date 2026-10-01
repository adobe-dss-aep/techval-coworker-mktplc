# Shared rules and configuration

## Desktop prerequisites and private configuration

Use this skill in Claude Desktop/Cowork with authorized Adobe connectors.
This plugin does not install or authenticate any MCP servers. Resolve each
referenced tool against the tools actually available in the current session;
if a required tool is unavailable, identify the missing connector and pause.
Never fabricate a tool name or silently substitute an integration.

Supply environment-specific values through an approved private configuration
mechanism or the current authorized session. Never commit credentials,
webhook URLs, tenant endpoints, or customer identifiers to this repository.
Fusion webhook URLs may act as credentials; treat them as secrets and do not
echo them in output. Stop before any step whose required value is unresolved.
Obtain user approval before creating or publishing content.

In addition to the constants below, configure:

- `CJA_CONTENT_ATTRIBUTE_DIMENSION_ID` and `CJA_APPOINTMENT_METRIC_ID`.
- `FIREFLY_GENERATION_WORKFLOW_ID` and `FIREFLY_PROMPT_NODE_ID`.
- `IMAGE_CROP_WORKFLOW_ID` and `IMAGE_CROP_NODE_ID`.
- `FUSION_CREATE_PROJECT_WEBHOOK_URL` and `FUSION_CREATE_ASSETS_WEBHOOK_URL`.
- `AEM_SITE_HERO_SEARCH_QUERY`, `AEM_FRAGMENTS_PATH`, and `SOURCE_ASSETS_PATH`.

The source workflow refers to Build Notes, a build checklist, a real brand
policy PDF, the `Aem Sites Contentfragments Bulk Edit` skill, and optional
visual-artifact components. These are not included. Obtain required supporting
material privately; do not invent its contents. Use desktop-compatible user
confirmation controls instead of assuming a tool called `ask_user_question`
exists. If visual-artifact components are unavailable, show labeled image
links rather than failing or claiming that cards were rendered.

## REQUIRED ENVIRONMENT CONFIGURATION

```
DEMO_SITE_URL = PLACEHOLDER
WF_INSTANCE_URL = PLACEHOLDER
AEM_AUTHOR = PLACEHOLDER
SECUR_BRAND_ID = PLACEHOLDER
CJA_PROJECT_ID = PLACEHOLDER
CJA_DATA_VIEW_ID = PLACEHOLDER
FUSION_BLUEPRINT_ID = PLACEHOLDER
EXPRESS_TEMPLATE_ID = PLACEHOLDER
FIREFLY_FORMATS        = ["site hero", "email header", "paid media format 1", "paid media format 2"]

# Six-attribute taxonomy — MUST exist identically in three places (CJA data view, Express
# tagged elements, and the brand rules Content Reviewer scores against). Build once, reference
# everywhere else. Do not let these drift or get redefined per-step.
SIX_ATTRIBUTE_TAXONOMY = {
  subject_type,
  setting,
  motion,
  saturation,
  outcome_specificity,
  personalization
}

# Pre-mapped CJA dimension/metric IDs (skip live discovery calls once these are known — mirrors
# the Step 1 checklist item "pre-map every dimension/metric ID as a constant")
CJA_DIMENSIONS = {
  content_item,
  channel
  # one entry per SIX_ATTRIBUTE_TAXONOMY key once IDs are confirmed
}
CJA_METRICS = {
  searchQuery: appointment schedule
}

# Workfront custom field for the optimization record (Step 2) — label must match exactly
WF_CAMPAIGN_GOALS_FIELD_GROUP_LABEL = "Campaign goals"   # exact phrase — do not paraphrase
WF_CAMPAIGN_GOALS_SUBFIELDS = ["metric", "markets affected", "baseline", "target", "measurement window"]

# Content Fragment model fields (Step 5)
AEM_CF_MODEL_FIELDS = ["headline", "subhead", "body", "CTA label", "disclaimer",
                        "audience intent", "locale", "experiment metadata", "campaign metadata"]
```

---

## CRITICAL TOOL CALL RULES

**Rule 1 — Coworker is the sole invocation point.** Per Build Notes §2, no step in this build
may be fired by hand directly in an underlying product (Workfront, AEM, Express, Fusion, CJA)
during a run — every action routes through the selected step skill, called either directly or by the master. If a manual one-off is
needed (e.g. uploading the real brand PDF), say so explicitly and treat it as a blocking
prerequisite, not a silent workaround.

**Rule 2 — Re-verify Coworker's invocation logic whenever a step's automation changes shape.**
Not a one-time check — flag it after any structural edit to a step below.

**Rule 3 — Confirm only the required infra access and credentials before a selected step's build window opens**, not
mid-build. Every step below has an implicit dependency on tenant/account access and API
entitlements even though it isn't listed per-step.

**Rule 4 — Tool names below are expected placeholders, not final.** Until the real MCP tool
names are confirmed, use the bracketed placeholder identifiers shown (e.g.
`[wf_create_object__PLACEHOLDER]`) and do not guess a real-looking tool name in their place —
an obvious placeholder is safer than a plausible-looking wrong one.

**Rule 5 - Surface failures accurately.** Retry read-only requests at most once with
identical parameters. Do not automatically retry mutating operations after a timeout:
first inspect their status to avoid duplicate projects, assets, or publications.
If the result is unknown, say so and pause. Never turn a failed or partial result
into a success message or hide an error from the user.

**Rule 6 - Summarize outcomes, not instruction text.** Keep stakeholder responses
concise, but always disclose failures, missing prerequisites, and simulated data.
---

## THINGS YOU MUST NEVER DO

- Never fire a step by hand in an underlying product during a run — Coworker is the sole
  invocation point (Build Notes §2).
- Never invent a CJA data view ID, dimension ID, metric ID, brand ID, or credential value —
  use the `ask_user_question` prompts above instead.
- Never author brand rules (4a) or import brand policy (4b) from a representative/placeholder
  document without flagging that it still needs reconciliation against Secur Financial's real brand
  PDF once available.
- Never skip the reconciliation check between 4a and 4b, including after subsequent edits.
- Never build the optimization record on the Workfront Goals product (Build Notes Q9).
- Never assume inline AEM rendering works in the artifact renderer without confirming it first
  (Build Notes Q8) — default to linking out.
- Never run selected steps in parallel — they form a strict
  dependency chain because each step's automation targets an object the previous step created.
- Never present raw tool-call syntax, JSON, or internal IDs to a non-technical stakeholder;
  summarize outcomes in plain language instead.
- Never move past a `PLACEHOLDER` required for the current step without either resolving it or
  explicitly flagging it as a known gap.

## Modular execution

These shared rules apply to every step, including standalone use. Read the
run contract before execution. A standalone request authorizes only that
step, not downstream steps. The master skill alone selects and sequences
multiple steps. Excluding a step never waives an approval, governance check,
or required input. Configure only selected steps and their verification
needs; excluded steps do not require their unused connectors or secrets.

Instructions to seed analytics describe approved demo-fixture prerequisites,
not permission to fabricate observations or modify production analytics.
Keep synthetic fixtures and projections labeled and separate from real data.
Missing Build Notes or a required real brand policy must be surfaced, not
silently replaced with invented requirements or placeholder brand rules.
