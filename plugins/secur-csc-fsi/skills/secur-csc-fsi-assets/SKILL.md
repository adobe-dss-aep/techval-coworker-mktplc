---
name: secur-csc-fsi-assets
description: Run step 4 of the Secur Financial/Get Moving demo: crop the selected creative and create AEM assets through Fusion after creative-execution approval. Use for Secur cropping and asset creation or an explicit request for secur-csc-fsi-assets. Does not update or publish pages.
---

# secur-csc-fsi-assets

## Execution contract

Before any action, read [shared rules and configuration](../secur-csc-fsi/references/common.md)
and [step contracts and run state](../secur-csc-fsi/references/run-contract.md).
Apply the input, configuration, output, and approval requirements for step 4.
Load only the connectors and private configuration required for this step.
This skill is standalone: never invoke the master, another step, or a later
phase automatically. Existing verified inputs can replace earlier execution.
Missing or unverified inputs must be reported explicitly; pause rather than
starting an upstream skill or inventing values.

Return IMAGE1_1, IMAGE2_1, IMAGE4_3, SITE_HERO, the asset-creation evidence, and AEM_ASSETS_STATUS. Require CREATIVE_EXECUTION_APPROVED before mutation. A timeout returns unconfirmed unless a status check verifies the assets. Partial workflow output remains partial even when usable links exist; record the user decision and verify required assets before returning complete.

Return a STEP_RESULT using the shared contract, then stop. The master, if
present, decides whether to continue. Instructions below do not override
these requirements or the shared safety rules.

## Procedure

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
and verify the required assets exist before returning verified outputs to the caller.
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
