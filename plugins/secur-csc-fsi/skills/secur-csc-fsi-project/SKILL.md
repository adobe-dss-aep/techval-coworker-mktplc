---
name: secur-csc-fsi-project
description: Run step 2 of the Secur Financial/Get Moving demo: generate constrained campaign copy and create a Workfront project through Fusion using a verified selected image. Use for Secur project creation or an explicit request for secur-csc-fsi-project. Does not run content review or later steps.
---

# secur-csc-fsi-project

## Execution contract

Before any action, read [shared rules and configuration](../secur-csc-fsi/references/common.md)
and [step contracts and run state](../secur-csc-fsi/references/run-contract.md).
Apply the input, configuration, output, and approval requirements for step 2.
Load only the connectors and private configuration required for this step.
This skill is standalone: never invoke the master, another step, or a later
phase automatically. Existing verified inputs can replace earlier execution.
Missing or unverified inputs must be reported explicitly; pause rather than
starting an upstream skill or inventing values.

Return CAMPAIGN_FIELDS (Headline, SubHeadline, CTA, ImageURL, RecordName, Season, Quarter, LaunchDate, EndDate), ProjectID, TaskID, DocID, CurrentVersionID, and a verified project link. Use the current date for relative dates and validate every copy limit before submission. Only return complete when the creation response and required IDs are verified.

Return a STEP_RESULT using the shared contract, then stop. The master, if
present, decides whether to continue. Instructions below do not override
these requirements or the shared safety rules.

## Procedure

### STEP 2 — WORKFRONT PLANNING WORKSPACE: OPTIMIZATION RECORD TYPE

- [ ] Generate the following fields for the Campaign record. The text copy should be short in length and engaging to fit the criteria above:
  Headline, SubHeadline, CTA, RecordName (same as Headline), Season, Quarter, LaunchDate, EndDate
  This information will be used in a JSON object. You can use the following values as defaults for the following:
  Season: fall
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
Return the verified project outputs to the caller; do not run content review.
