---
name: secur-csc-fsi-baseline
description: Run step 1 of the Secur Financial/Get Moving demo: report the CJA opening baseline, rank content attributes, and generate user-approved Firefly creative. Use for the Secur baseline or initial creative, or an explicit request for secur-csc-fsi-baseline. Does not create projects or run later steps.
---

# secur-csc-fsi-baseline

## Execution contract

Before any action, read [shared rules and configuration](../secur-csc-fsi/references/common.md)
and [step contracts and run state](../secur-csc-fsi/references/run-contract.md).
Apply the input, configuration, output, and approval requirements for step 1.
Load only the connectors and private configuration required for this step.
This skill is standalone: never invoke the master, another step, or a later
phase automatically. Existing verified inputs can replace earlier execution.
Missing or unverified inputs must be reported explicitly; pause rather than
starting an upstream skill or inventing values.

Return CJA_CONTEXT, OPENING_BASELINE, SELECTED_ATTRIBUTES, and the user-selected FIREFLY_IMG. If the user declines generation, a supplied existing image may satisfy FIREFLY_IMG only after verification and explicit selection. Otherwise leave it unresolved and return paused. If the report has no usable data, pause; do not manufacture baseline results or an image.

Return a STEP_RESULT using the shared contract, then stop. The master, if
present, decides whether to continue. Instructions below do not override
these requirements or the shared safety rules.

## Procedure

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
