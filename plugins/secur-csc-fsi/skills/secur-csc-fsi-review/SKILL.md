---
name: secur-csc-fsi-review
description: Run step 3 of the Secur Financial/Get Moving demo: submit a content review for a verified Workfront document version, optionally retrieve its result, and record the creative-execution decision. Use for Secur content review or an explicit request for secur-csc-fsi-review. Does not create downstream assets.
---

# secur-csc-fsi-review

## Execution contract

Before any action, read [shared rules and configuration](../secur-csc-fsi/references/common.md)
and [step contracts and run state](../secur-csc-fsi/references/run-contract.md).
Apply the input, configuration, output, and approval requirements for step 3.
Load only the connectors and private configuration required for this step.
This skill is standalone: never invoke the master, another step, or a later
phase automatically. Existing verified inputs can replace earlier execution.
Missing or unverified inputs must be reported explicitly; pause rather than
starting an upstream skill or inventing values.

Return REVIEW_STATUS, REVIEW_RESULT, and CREATIVE_EXECUTION_APPROVED. If retrieval is skipped by the user, record REVIEW_STATUS as not-retrieved and approval to continue, never a passed review. Failed or pending results block creative execution. A declined creative-execution decision returns paused.

Return a STEP_RESULT using the shared contract, then stop. The master, if
present, decides whether to continue. Instructions below do not override
these requirements or the shared safety rules.

## Procedure

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

If "Skip", record REVIEW_STATUS as not-retrieved and CREATIVE_EXECUTION_APPROVED as true, then return without retrieving the result or running another skill.
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

If "Yes", record CREATIVE_EXECUTION_APPROVED as true and return the review outputs.
If "No", record CREATIVE_EXECUTION_APPROVED as false, return paused, and wait for further instructions.
