---
name: secur-csc-fsi
description: >
  Build and configure the Northwell Health Get Moving Content Supply Chain demo
  in Claude Desktop/Cowork: CJA baseline, creative generation, Workfront project,
  content review, AEM assets and page publication, and a labeled simulated
  follow-up. Use when explicitly asked for secur-csc-fsi or the Northwell/Get
  Moving build, including a specific numbered step. Not a generic CSC or FSI
  provisioning workflow. Requires configured Adobe MCP connectors and private
  environment values supplied outside this public plugin.
---

# secur-csc-fsi

This public-safe skill preserves the supplied Northwell/Get Moving demo
workflow. Its name does not change that workflow into a financial-services
demo. The examples below are tool-request templates, not executable JSON.

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
NORTHWELL_BRAND_ID = PLACEHOLDER
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

# Content Fragment model fields (Step 7)
AEM_CF_MODEL_FIELDS = ["headline", "subhead", "body", "CTA label", "disclaimer",
                        "audience intent", "locale", "experiment metadata", "campaign metadata"]
```

---

## CRITICAL TOOL CALL RULES

**Rule 1 — Coworker is the sole invocation point.** Per Build Notes §2, no step in this build
may be fired by hand directly in an underlying product (Workfront, AEM, Express, Fusion, CJA)
during a run — every action routes through this skill's orchestration. If a manual one-off is
needed (e.g. uploading the real brand PDF), say so explicitly and treat it as a blocking
prerequisite, not a silent workaround.

**Rule 2 — Re-verify Coworker's invocation logic whenever a step's automation changes shape.**
Not a one-time check — flag it after any structural edit to a step below.

**Rule 3 — Confirm infra access and credentials before a step's build window opens**, not
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

## ROLE AND PERSONA

You are the build coordinator for the Northwell "Get Moving" demo environment. Unlike a
campaign-execution skill, there is no live marketer waiting on creative output here — your job
is to walk through the six build steps **in order**, confirming prerequisites, executing what
can be automated, and surfacing open questions rather than guessing past them.

---

## TRIGGER

Activate when the user explicitly requests `secur-csc-fsi`, or the request is equivalent to:
- "Let's build the Northwell demo environment"
- "Set up Get Moving"
- "Start the Northwell CSC build"
- Names a specific step directly (e.g. "let's do the CJA opening baseline for Northwell",
  "let's build the Northwell brand definition step")

For automatic activation, "Northwell" or "Get Moving" (or an unambiguous reference
to this specific build) must be present. Explicit requests for `secur-csc-fsi`
also activate it. Do not infer that an unrelated FSI demo uses this workflow.

If the request names a single step, jump straight to it — but if an earlier step clearly hasn't
been completed yet (the values it produces are still `PLACEHOLDER`), say so and offer to start
there instead.

---

## PIPELINE — FOLLOW THESE STEPS IN ORDER. DO NOT SKIP OR REORDER.

---

### STEP 1 — CJA / CONTENT ANALYTICS: OPENING BASELINE

- [ ] Content item, six-attribute (`SIX_ATTRIBUTE_TAXONOMY`), and channel dimensions;
      appointment-request conversion metric
- [ ] Existing-content window seeded so stock/clinical/static creative carries volume but
      underperforms real-patient/in-motion by roughly 2×
- [ ] Pre-map every dimension/metric ID into `CJA_DIMENSIONS` / `CJA_METRICS` above (avoids live
      discovery calls on every subsequent run)

```
[cja-mcp__setDefaultSessionDataViewId]
  dataViewId: CJA_DATA_VIEW_ID

[cja-mcp__getServerDateTime]

[cja-mcp__findDimensions]
  searchQuery: asset attribute experience attribute content
  limit: 25

[cja-mcp__findMetrics]
  searchQuery: appointment schedule

[cja-mcp__findCalculatedMetrics]
  searchQuery: appointment schedule

[cja-mcp__runReport]
  dimensionIds: CJA_CONTENT_ATTRIBUTE_DIMENSION_ID
  limit: 15
  metricAttributions: [{"metricId": CJA_APPOINTMENT_METRIC_ID, "allocationType": "participation"}]
  metricIds: CJA_APPOINTMENT_METRIC_ID
  startDate: [30 days before NOW]
  endDate: [NOW]

Add in the following data to the returned report to indicate a more customized experience. We want to use these as the attributes for the prompt generation as well:
photographyStyles:Lifestyle
overallTone:Neutral
tones:Inspirational
orientation:Landscape
cameraPosition:Neutral angle
imageType:Photograph

Rank the most influential Asset Attributes and Experience Attributes by participation-attributed Appointments Scheduled

When providing the report, create a horizontal bar chart that has "Content Attribute" on the Y-Axis and "Appointments scheduled" on the X-Axis. Use a HorizontalBarReportlet for the projectBody and a Vega-Lite horizontal bar for in-chat.
```

---

If data is returned, we need to ask the user to generate assets:

Use `ask_user_question` with:
- Question: "Should I create new assets that would be effective at driving appointment scheduling" + LIST OF ATTRIBUTES TO USE
- Header: "Generate assets"
- Options:
  - label: "Yes"
  - label: "No"
- multi_select: false
- required: true

---

Generate Assets based on the following:

TOP-LEVEL INSTRUCTIONS — apply to every image generated from this document:

Select and refer to personas only by their label. When choosing a persona at random or discussing which one was picked, use the label only — do not describe, reference, or choose based on skin tone or any other physical characteristic.

RUNNER 1-4

Choose ONE variant below. Each is a complete, standalone prompt.

=== Runner 1 ===

Candid lifestyle photo, woman in her 40s, deep brown skin, natural coily hair, running tree-lined greenway. LIGHT: warm directional sun, soft shadows with mild definition – not flat, not harsh/dramatic. 16:9 widescreen. Midstance stride: front foot planted, weight loading, back leg trailing, heel lifting, forward lean, arms opposite legs, real momentum. Calm gaze down road, not camera. Worn-in top/shorts, light-wear shoes, no brand logos. Skin: real texture, healthy sheen, not sweat-drenched/airbrushed. WIDE SHOT: 35mm lens, camera well back so she reads as a small figure in the landscape, not a close portrait. Full body visible, clear space above head and below feet. Right-of-center, left side open. Low eye level. Color pop: orange (#FF681E) wristband/shoe. Full natural color, not b&w. Avoid: brand logos, tight crop, subject filling frame, symmetry, matching activewear, airbrushed skin, oversaturated color, stock staging, excess sweat, strained expression, illustration/CGI, anatomy errors.

=== Runner 2 ===

Candid lifestyle photo, woman in her 40s, warm golden-tan skin, wavy dark hair, running tree-lined greenway. LIGHT: warm directional sun, soft shadows with mild definition – not flat, not harsh/dramatic. 16:9 widescreen. Midstance stride: front foot planted, weight loading, back leg trailing, heel lifting, forward lean, arms opposite legs, real momentum. Calm gaze down road, not camera. Worn-in top/shorts, light-wear shoes, no brand logos. Skin: real texture, healthy sheen, not sweat-drenched/airbrushed. WIDE SHOT: 35mm lens, camera well back so she reads as a small figure in the landscape, not a close portrait. Full body visible, clear space above head and below feet. Right-of-center, left side open. Low eye level. Color pop: orange (#FF681E) wristband/shoe. Full natural color, not b&w. Avoid: brand logos, tight crop, subject filling frame, symmetry, matching activewear, airbrushed skin, oversaturated color, stock staging, excess sweat, strained expression, illustration/CGI, anatomy errors.

=== Runner 3 ===

Candid lifestyle photo, woman in her 40s, light golden-ivory skin, straight black hair, running tree-lined greenway. LIGHT: warm directional sun, soft shadows with mild definition – not flat, not harsh/dramatic. 16:9 widescreen. Midstance stride: front foot planted, weight loading, back leg trailing, heel lifting, forward lean, arms opposite legs, real momentum. Calm gaze down road, not camera. Worn-in top/shorts, light-wear shoes, no brand logos. Skin: real texture, healthy sheen, not sweat-drenched/airbrushed. WIDE SHOT: 35mm lens, camera well back so she reads as a small figure in the landscape, not a close portrait. Full body visible, clear space above head and below feet. Right-of-center, left side open. Low eye level. Color pop: orange (#FF681E) wristband/shoe. Full natural color, not b&w. Avoid: brand logos, tight crop, subject filling frame, symmetry, matching activewear, airbrushed skin, oversaturated color, stock staging, excess sweat, strained expression, illustration/CGI, anatomy errors.

=== Runner 4 ===

Candid lifestyle photo, woman in her 40s, fair skin, rosy undertones, straight blonde hair, running tree-lined greenway. LIGHT: warm directional sun, soft shadows with mild definition – not flat, not harsh/dramatic. 16:9 widescreen. Midstance stride: front foot planted, weight loading, back leg trailing, heel lifting, forward lean, arms opposite legs, real momentum. Calm gaze down road, not camera. Worn-in top/shorts, light-wear shoes, no brand logos. Skin: real texture, healthy sheen, not sweat-drenched/airbrushed. WIDE SHOT: 35mm lens, camera well back so she reads as a small figure in the landscape, not a close portrait. Full body visible, clear space above head and below feet. Right-of-center, left side open. Low eye level. Color pop: orange (#FF681E) wristband/shoe. Full natural color, not b&w. Avoid: brand logos, tight crop, subject filling frame, symmetry, matching activewear, oversaturated color, stock staging, strained expression, illustration/CGI, anatomy errors.

---

The Express/GenStudio/Fusion scenario is performed by calling the custom MCP to fire a webhook. We need to first generate a Firefly image that is on brand from running the following invoke_workflow Tool. The output will generate 3 images. Once we have the URLs for the 3 images, perform the following steps:
1. Read file `path: /.agent/resources/visual-artifacts/components/AssetCard.json` to load the AssetCard component.
2. Read file `path:/.agent/resources/visual-artifacts/components/Markdown.json` to load the Markdown component.
3. Generate each AssetCard using the image returned. Title should be "Option X", imageUrl is the image url. Description is the image url as well, visible is true.
4. Add a Markdown line beneath it whose link points to the same URL. Wrapping each card + markdown in a row.

```
[firefly-mcp_invoke_workflow]
  workflowId: FIREFLY_GENERATION_WORKFLOW_ID
  inputs: [{
    "node_id": FIREFLY_PROMPT_NODE_ID,
    "content":[{
      "type": "text",
      "text": GENERATED PROMPT FROM ABOVE,
    }]
  }]
```

Store the users preferred image URL as FIREFLY_IMG

---

### STEP 2 — WORKFRONT PLANNING WORKSPACE: OPTIMIZATION RECORD TYPE

- [ ] Generate the following fields for the Campaign record. The text copy should be short in length and engaging to fit the criteria above:
  Headline, SubHeadline, CTA, RecordName (same as Headline), Season, Quarter, LaunchDate, EndDate
  This information will be used in a JSON object. You can use the following values as defaults for the following:
  Seaon: fall
  Quarter: q4
  LaunchDate: 2 weeks from now
  EndDate: 6 weeks from now
  Make sure to output the Headline, SubHeadline, CTA, ImageURL and all other information in a table for easy reference.
  Use these as the maximum word and character lenghts
  | Element     | Max Chars | Max Word Length | Max Words |
  |-------------|----------:|----------------:|----------:|
  | Headline    |        28 |               6 |         6 |
  | Subheadline |        44 |               6 |         9 |
  | CTA         |        16 |               6 |         3 |
```
[firefly-mcp_invoke__fusion]
  fusionUrl: FUSION_CREATE_PROJECT_WEBHOOK_URL
  fields: {
    "Headline"
    "SubHeadline"
    "CTA"
    "ImageURL": FIREFLY_IMG
    "RecordName"
    "Season"
    "Quarter"
    "LaunchDate"
    "EndDate"
  }
```

The response will be a JSON object like
```
"status": "success",
"ProjectID": "SOME VALUE",
"TaskID": "SOME VALUE",
"DocID": "SOME VALUE",
"CurrentVersionID": "SOME VALUE"
```
Save these for reference later.
Show the Project creation response in Coworker (I've created the Project ProjectID, include a link if possible that Project ID)
Immediate go to Step 3.

---

### Step 3 - Generate Content Reviewer
We need to get back the items that have Assets attached
Now run the following MCP Tool

```
[firefly-mcp__create_content_reviewer]
  documentId: CurrentVersionID
```

---

We now need to pause for a few seconds to let the Content Reviewer run

Use `ask_user_question` with:
- Question: "Would you like me to get the results of the content reviewer?"
- Header: "Retrieve results"
- Options:
  - label: "Yes, get the results"
  - label: "Skip and continue to next steps"
- multi_select: false
- required: true

---

If "Skip", go to Step 4
If "Yes", run the MCP Tool

```
[workfront-mcp__approvals_check_brand_review_result]
  document_version_id: CurrentVersionID
```

Report the actual review result. If it failed or is pending, do not claim it passed; pause for remediation or completion.

We now need to pause for a few seconds to let the Content Reviewer run

Use `ask_user_question` with:
- Question: "Send for creative execution?"
- Header: Results from Content Reviewer results
- Options:
  - label: "Yes"
  - label: "No"
- multi_select: false
- required: true

---

If "Yes", go to step 4
If "No", pause and wait for futher instructions


### STEP 4 — PROJECT TEMPLATE FOR CREATIVE EXECUTION
- [ ] Generate 3 different cropped images, (square, landscape, and 4x3)
- [ ] Generate AEM Assets using Workflow Run scenario


```
[WorkflowRun__run_workflow_submit]
  workflowId: IMAGE_CROP_WORKFLOW_ID
  inputs: [{
    "node_id": IMAGE_CROP_NODE_ID,
    content":[{
      "type":"image",
      "url": FIREFLY_IMG
    }]
  }]
```

Once submitted, you will need to poll using the [WorkflowRun__run_workflow_get_status] tool to get the status. This will return 3 links.
If the batch is marked failed because its final output step cannot complete,
report that failure explicitly. Usable links are partial output, not proof of
overall success. Check that all required images exist and ask the user whether
to continue with partial output before creating downstream assets.
Store the links to the appropriate keys:
IMAGE1_1: 1x1 ratio square image
IMAGE2_1: 2x1 ratio landscape image
IMAGE4_3: 4x3 ratio image

This will give a response with images in an array. Do not attempt to show the images in the chat window, just list the links and the labels to open up in a new tab. The last image in the array will be the SITE_HERO for future usage

Next call the following tool to create the AEM assets. It may time out after
60 seconds. Do not retry a timed-out submission automatically. Report that its
completion is unconfirmed, provide the Workfront project link for inspection,
and verify the required assets exist before proceeding to Step 5.
```
[firefly-mcp_invoke__fusion]
  fusionUrl: FUSION_CREATE_ASSETS_WEBHOOK_URL
  fields: {
    "Headline": Headline from above,
    "Subheadline": SubHeadline from above,
    "CTA": CTA From above,
    "image1_1": IMAGE1_1,
    "image2_1": IMAGE2_1,
    "image4_3": IMAGE4_3,
    "ProjectID": ProjectID from above
  }
```

---

### STEP 5 — AEM SITES: PAGE UPDATE VIA EXPERIENCE PRODUCTION AGENT

Requires the output image from SITE_HERO.

- [ ] Source asset library in AEM Assets with approved-status metadata (`SOURCE_ASSETS_PATH`)
- [ ] Content Fragment model built: `AEM_CF_MODEL_FIELDS`
- [ ] Seed fragments authored with market/locale variations so this skill has something existing
      to find and recommend against
- [ ] Target page seeded at `DEMO_SITE_URL`, referencing those fragments, plus one language
      variant
- [ ] Governance Agent evaluates the assembled page against the brand policy. Note to output this is specific to the website.

Use the folliwing script and the Load the skill `Aem Sites Contentfragments Bulk Edit` to complete the process of creating a new Content Fragment and updating the page:

First we need to find the AEM_Image_ID. Use the following tool
```
[AEM__read-api]
  aemUrl: AEM_AUTHOR
  code: const body = { match: AEM_SITE_HERO_SEARCH_QUERY, limit:10 }; const r = await aem.post('/adobe/experimental/aemmcpserver-expires-20991231/search-assets', body); return (r.body?.results||[]).map(a => ({ id:a.assetId, keys:Object.keys(a), meta:a.repositoryMetadata }));
```
Find the correct record and store the ID as `AEM_Image_ID`

Next use

```
Create a content fragment on the server AEM_AUTHOR in the path of AEM_FRAGMENTS_PATH using the model `Hero`. Name the content fragment the same as the `Headline`.
Title = `Headline`
Body = `SubHeadline`
CTA Label = `CTA`
CTA Url = "#"
Image reference = `AEM_Image_ID`
```

Before publishing, we want to run Brand Governance against the updated Content Fragment.

Publish any assets referenced and then publish the new content fragment

Then update `DEMO_SITE_URL` the `herocf` block section with the new Content Fragment Path and publish to preview. Include a link to the da.live editor in the output. This is a DA page, use DA MCP Tools. Do not use EDS tools.

---

Now we can run Step 6 if the user approves running the follow-up report

Use `ask_user_question` with:
- Question: "Should I run a 90 day follow-up report?"
- Header: "90-day Report"
- Options:
  - label: "Yes"
  - label: "No"
- multi_select: false
- required: true


If "Yes", Go to Step 6
If "No", Pause

---

### STEP 6 — CJA / CONTENT ANALYTICS: CLOSING WINDOW (PROGRESSION)

This is the last step — it closes the loop back into Step 1's instance.

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

---

## THINGS YOU MUST NEVER DO

- Never fire a step by hand in an underlying product during a run — Coworker is the sole
  invocation point (Build Notes §2).
- Never invent a CJA data view ID, dimension ID, metric ID, brand ID, or credential value —
  use the `ask_user_question` prompts above instead.
- Never author brand rules (4a) or import brand policy (4b) from a representative/placeholder
  document without flagging that it still needs reconciliation against Northwell's real brand
  PDF once available.
- Never skip the reconciliation check between 4a and 4b, including after subsequent edits.
- Never build the optimization record on the Workfront Goals product (Build Notes Q9).
- Never assume inline AEM rendering works in the artifact renderer without confirming it first
  (Build Notes Q8) — default to linking out.
- Never treat Steps 3 onward (excluding Step 4) as parallelizable — they form a strict
  dependency chain because each step's automation targets an object the previous step created.
- Never present raw tool-call syntax, JSON, or internal IDs to a non-technical stakeholder;
  summarize outcomes in plain language instead.
- Never move past a `PLACEHOLDER` required for the current step without either resolving it or
  explicitly flagging it as a known gap.
