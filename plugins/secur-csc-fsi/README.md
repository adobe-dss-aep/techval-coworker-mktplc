# secur-csc-fsi

A Claude Desktop/Cowork plugin containing the
[`secur-csc-fsi` skill](skills/secur-csc-fsi/SKILL.md).

## Scope

This public-safe version uses Secur Financial / Get Moving branding for the
Content Supply Chain demo workflow. The skill is named `secur-csc-fsi`.
This branding update preserves the existing imagery and appointment metrics;
it is not a full rewrite of the workflow for financial services.

The skill coordinates six steps:

1. CJA opening baseline and creative generation.
2. Workfront project creation through Fusion.
3. Content review and user confirmation.
4. Image cropping and AEM asset creation.
5. AEM content fragment and page update.
6. An explicitly labeled simulated 90-day follow-up.

## Install and use in Claude Desktop

1. Open **Customize > Plugins**.
2. Choose **Add marketplace** (under **Add** in some app versions).
3. Enter `https://github.com/adobe-dss-aep/techval-coworker-mktplc`.
4. Select and install **secur-csc-fsi**.
5. In Cowork, ask: "Use secur-csc-fsi to build the Secur Financial Get Moving demo."

The skill is a configurable demo template, not a ready-to-run tenant setup.
Installation does not connect or authenticate any Adobe services.

## Prerequisites and permissions

Supply authorized connectors for the required CJA, Firefly/workflow, Workfront,
Fusion, AEM, brand-governance, and DA operations. Tool names in the source are
templates: they must be resolved against actual available tools before use.
The separately referenced content-fragment skill and brand policy are not
bundled.

Configure the required values described in
[`SKILL.md`](skills/secur-csc-fsi/SKILL.md) privately. All source tenant URLs,
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

The original source remains unchanged outside this repository. This package
has been structurally validated; execution against Adobe tenants and
installation in the desktop app require testing in an authorized environment.
