# Secur Financial CSC

A Claude Desktop/Cowork plugin containing the
[`secur-csc-fsi` master skill](skills/secur-csc-fsi/SKILL.md) and six standalone
step skills.

The plugin's display name is **Secur Financial CSC**.
Its permanent identifier and master skill name remain `secur-csc-fsi`.
Its marketplace category is `design`, matching the Adobe creative plugin's
category. The display-name emoji has been removed. The category-to-card-icon
mapping is not documented; confirm the resulting icon in Claude Desktop.

## Scope

This public-safe version uses Secur Financial / Get Moving branding for the
Content Supply Chain demo workflow. The skill is named `secur-csc-fsi`.
This branding update preserves the existing imagery and appointment metrics;
it is not a full rewrite of the workflow for financial services.

The master runs all six steps by default, preserving their existing approval
gates. Each step can also be used on its own with verified inputs:

| Step | Skill | Purpose |
| --- | --- | --- |
| 1 | [secur-csc-fsi-baseline](skills/secur-csc-fsi-baseline/SKILL.md) | CJA opening baseline and creative generation |
| 2 | [secur-csc-fsi-project](skills/secur-csc-fsi-project/SKILL.md) | Workfront project creation through Fusion |
| 3 | [secur-csc-fsi-review](skills/secur-csc-fsi-review/SKILL.md) | Content review and creative-execution decision |
| 4 | [secur-csc-fsi-assets](skills/secur-csc-fsi-assets/SKILL.md) | Image cropping and AEM asset creation |
| 5 | [secur-csc-fsi-page](skills/secur-csc-fsi-page/SKILL.md) | Governed content fragment and DA page publication |
| 6 | [secur-csc-fsi-follow-up](skills/secur-csc-fsi-follow-up/SKILL.md) | Explicitly labeled simulated 90-day follow-up |

### Include, exclude, and resume

Tell the master which steps to include or exclude. Selected steps remain in
numerical order. An excluded step is not run silently: if its outputs are
needed later, supply existing artifacts that can be verified. Missing inputs
block dependent execution instead of being guessed. Exclusions never waive
governance or approval requirements.

Examples:

- "Use secur-csc-fsi to run all six steps."
- "Run steps 2 through 5 with this approved image and campaign brief; exclude
  the baseline and simulated follow-up."
- "Use secur-csc-fsi-page with these verified assets and campaign fields."
- "Resume after review without recreating the Workfront project."

Standalone skills return their own results and stop; they never automatically
call the next skill. A partial result, failure, timeout, or declined approval
pauses the master. Completed, reused, excluded, and pending work are reported
separately. Step 1 still includes both the baseline and initial creative;
declining generation requires a verified existing image for downstream work.

## Install and use in Claude Desktop

1. Open **Customize > Plugins**.
2. Choose **Add marketplace** (under **Add** in some app versions).
3. Enter `https://github.com/adobe-dss-aep/techval-coworker-mktplc`.
4. Select and install **Secur Financial CSC** (`secur-csc-fsi`).
5. In Cowork, ask: "Use secur-csc-fsi to build the Secur Financial Get Moving demo."

The skill is a configurable demo template, not a ready-to-run tenant setup.
Installation does not connect or authenticate any Adobe services.

## Prerequisites and permissions

Supply authorized connectors for the required CJA, Firefly/workflow, Workfront,
Fusion, AEM, brand-governance, and DA operations. Tool names in the source are
templates: they must be resolved against actual available tools before use.
The separately referenced content-fragment skill and brand policy are not
bundled.

Configure the required values described in the
[shared rules](skills/secur-csc-fsi/references/common.md) and
[step contracts](skills/secur-csc-fsi/references/run-contract.md) privately.
Only selected steps and verification of their inputs require configuration.
All source tenant URLs,
webhook URLs, and environment-specific IDs have been replaced with placeholders
or named configuration references. No credentials or connector configurations
are distributed by this plugin.

Executing the workflow can send prompts, images, campaign metadata, and content
to the connected Adobe services. It can create Workfront projects, generate and
upload assets, and publish AEM content. Use only approved demo data and obtain
approval before creating or publishing content.

## Public-safe adaptations

- Renamed the skill to `secur-csc-fsi` and added desktop prerequisites.
- Applied Secur/Secur Financial branding and the `SECUR_BRAND_ID` configuration name.
- Removed tenant endpoints, webhook URLs, and environment-specific IDs.
- Preserved the six-step workflow and its four image-prompt variants.
- Made failures, partial output, timeouts, and simulated results explicit.
- Avoided automatic retries of timed-out mutations to prevent duplicate work.
- Corrected the review-result reference to use the returned `CurrentVersionID`.
- Extracted each step without duplicating procedures in the master.
- Shared configuration, approval rules, dependency contracts, and run state
  apply equally to master-coordinated and standalone execution.

## Maintainer validation

From the repository root:

```sh
node --test tests/skills.test.cjs
claude plugin validate ./plugins/secur-csc-fsi
claude plugin validate .
```

The tests verify package structure, skill metadata, shared references,
orchestration boundaries, critical contracts, and preserved creative prompts.
They do not exercise Adobe connectors or prove that an instruction-following
model will complete a live run.

The original source remains unchanged outside this repository. This package
has been structurally validated; execution against Adobe tenants and
installation in the desktop app require testing in an authorized environment.
