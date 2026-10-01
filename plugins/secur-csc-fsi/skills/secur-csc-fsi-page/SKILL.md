---
name: secur-csc-fsi-page
description: Run step 5 of the Secur Financial/Get Moving demo: find the verified site-hero asset, create and govern an AEM content fragment, and update the DA page preview with approval. Use for Secur page publication or an explicit request for secur-csc-fsi-page. Does not run the follow-up projection.
---

# secur-csc-fsi-page

## Execution contract

Before any action, read [shared rules and configuration](../secur-csc-fsi/references/common.md)
and [step contracts and run state](../secur-csc-fsi/references/run-contract.md).
Apply the input, configuration, output, and approval requirements for step 5.
Load only the connectors and private configuration required for this step.
This skill is standalone: never invoke the master, another step, or a later
phase automatically. Existing verified inputs can replace earlier execution.
Missing or unverified inputs must be reported explicitly; pause rather than
starting an upstream skill or inventing values.

Return AEM_Image_ID, CONTENT_FRAGMENT_PATH, PREVIEW_URL, DA_EDITOR_URL, PAGE_GOVERNANCE_STATUS, and PAGE_PUBLISH_STATUS. Verify the selected asset matches SITE_HERO and the current campaign, not merely the first search result. Run governance against the fragment and assembled page; failed or pending governance blocks publication. Obtain publication approval and verify the preview before returning complete.

Return a STEP_RESULT using the shared contract, then stop. The master, if
present, decides whether to continue. Instructions below do not override
these requirements or the shared safety rules.

## Procedure

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
