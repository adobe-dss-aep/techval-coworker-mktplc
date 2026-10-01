const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const pluginRoot = path.join(root, 'plugins', 'secur-csc-fsi');
const skillsRoot = path.join(pluginRoot, 'skills');
const masterName = 'secur-csc-fsi';
const stepNames = [
  'secur-csc-fsi-baseline',
  'secur-csc-fsi-project',
  'secur-csc-fsi-review',
  'secur-csc-fsi-assets',
  'secur-csc-fsi-page',
  'secur-csc-fsi-follow-up',
];
const read = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const skill = name => read(path.join(skillsRoot, name, 'SKILL.md'));
const master = skill(masterName);
const contract = read(path.join(skillsRoot, masterName, 'references', 'run-contract.md'));
const common = read(path.join(skillsRoot, masterName, 'references', 'common.md'));

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(file) : [file];
  });
}

test('the plugin discovers exactly one master and six named standalone skills', () => {
  const directories = fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
  assert.deepEqual(directories.sort(), [masterName, ...stepNames].sort());

  for (const name of directories) {
    const text = skill(name);
    const frontmatter = text.match(/^---\nname: ([a-z0-9-]+)\ndescription: ([\s\S]*?)\n---\n/);
    assert.ok(frontmatter, `${name} needs name and description frontmatter`);
    assert.equal(frontmatter[1], name);
    assert.ok(name.length <= 64);
    const description = frontmatter[2].replace(/^>\n/, '')
      .split('\n').map(line => line.trim()).join(' ');
    assert.ok(description.length > 0 && description.length <= 1024);
    assert.match(description, /Secur/);
  }
});

test('catalog source, plugin identity, and modular release metadata agree', () => {
  const manifest = JSON.parse(read(path.join(pluginRoot, '.claude-plugin', 'plugin.json')));
  const catalog = JSON.parse(read(path.join(root, '.claude-plugin', 'marketplace.json')));
  const entry = catalog.plugins.find(plugin => plugin.name === masterName);
  assert.ok(entry);
  assert.equal(manifest.name, masterName);
  assert.equal(manifest.version, '0.2.1');
  assert.equal(manifest.displayName, 'Secur Financial Content Supply Chain');
  assert.equal(entry.displayName, manifest.displayName);
  assert.equal(entry.description, manifest.description);
  assert.equal(path.resolve(root, entry.source), pluginRoot);
  assert.match(manifest.description, /master coordinator and six standalone step skills/);
});

test('all packaged Markdown references resolve inside the repository', () => {
  const markdownFiles = [
    path.join(root, 'README.md'),
    path.join(root, 'CONTRIBUTING.md'),
    ...filesUnder(pluginRoot).filter(file => file.endsWith('.md')),
  ];
  for (const file of markdownFiles) {
    for (const match of read(file).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (target.includes('://') || target.startsWith('#')) continue;
      const resolved = path.resolve(path.dirname(file), target.split('#')[0]);
      const relative = path.relative(root, resolved);
      assert.ok(!relative.startsWith('..') && !path.isAbsolute(relative));
      assert.ok(fs.existsSync(resolved), `Broken reference in ${path.relative(root, file)}: ${target}`);
    }
  }
});

test('each standalone skill loads shared contracts and contains only its own step', () => {
  stepNames.forEach((name, index) => {
    const text = skill(name);
    assert.match(text, /\[shared rules and configuration\]\(\.\.\/secur-csc-fsi\/references\/common\.md\)/);
    assert.match(text, /\[step contracts and run state\]\(\.\.\/secur-csc-fsi\/references\/run-contract\.md\)/);
    assert.match(text, /standalone: never invoke the master, another step, or a later/);
    assert.match(text, /Return a STEP_RESULT/);
    assert.match(text, /Missing or unverified inputs must be reported explicitly/);
    const headings = [...text.matchAll(/^### (?:STEP|Step) (\d)/gm)].map(match => match[1]);
    assert.deepEqual(headings, [String(index + 1)]);
    assert.doesNotMatch(text, /go to (?:step|Step) [1-6]|Now we can run Step|Immediate go/);
  });
});

test('the master loads the six skills in order rather than duplicating procedures', () => {
  const linked = [...master.matchAll(/\| ([1-6]) \| \[([a-z-]+)\]\(\.\.\/([a-z-]+)\/SKILL\.md\)/g)];
  assert.deepEqual(linked.map(match => Number(match[1])), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(linked.map(match => match[2]), stepNames);
  assert.deepEqual(linked.map(match => match[3]), stepNames);
  assert.match(master, /selected_steps = \[1, 2, 3, 4, 5, 6\]/);
  assert.match(master, /excluded_steps = \[\]/);
  assert.match(master, /Run selected steps sequentially, never in parallel/);
  assert.match(master, /read its linked packaged `SKILL\.md`/);
  assert.doesNotMatch(master, /=== Runner|\[firefly-mcp|\[cja-mcp|fusionUrl:/);
});

test('exclusions, approvals, failed dependencies, and resumption have explicit guards', () => {
  assert.match(master, /Never automatically re-add an excluded producer/);
  assert.match(master, /Return blocked\s+until resolved/);
  assert.match(master, /Continue only after a `complete` result/);
  assert.match(master, /`partial`, `paused`, `blocked`, `failed`, or `unconfirmed`\s+result stops/);
  assert.match(master, /If a gate is declined, leave later selected steps pending/);
  assert.match(master, /do not require unrelated|Do not require unrelated/);
  assert.match(master, /never recreate a completed\s+project or publication/);
  assert.match(contract, /never silently run an\s+excluded producer/);
  assert.match(contract, /Replacing the image,\s+campaign, document version, or page invalidates/);
  assert.match(contract, /If\s+step 5 is excluded, it must not be claimed as executed or published/);
  assert.match(contract, /never override a known failed or\s+pending review/);
});

test('all six input/output contracts preserve artifact lineage and required fields', () => {
  const rows = [...contract.matchAll(/^\| ([1-6]) \| `([^`]+)` \| (.+) \| (.+) \|$/gm)];
  assert.equal(rows.length, 6);
  assert.deepEqual(rows.map(match => match[2]), stepNames);
  const requiredOutputs = [
    ['CJA_CONTEXT', 'OPENING_BASELINE', 'SELECTED_ATTRIBUTES', 'FIREFLY_IMG'],
    ['CAMPAIGN_FIELDS', 'ProjectID', 'TaskID', 'DocID', 'CurrentVersionID'],
    ['REVIEW_STATUS', 'REVIEW_RESULT', 'CREATIVE_EXECUTION_APPROVED'],
    ['IMAGE1_1', 'IMAGE2_1', 'IMAGE4_3', 'SITE_HERO', 'AEM_ASSETS_STATUS'],
    ['AEM_Image_ID', 'CONTENT_FRAGMENT_PATH', 'PREVIEW_URL', 'DA_EDITOR_URL', 'PAGE_GOVERNANCE_STATUS', 'PAGE_PUBLISH_STATUS'],
    ['SIMULATED_FOLLOW_UP'],
  ];
  rows.forEach((row, index) => {
    for (const output of requiredOutputs[index]) {
      assert.ok(row[4].includes(output), `Step ${index + 1} missing ${output}`);
      assert.ok(skill(stepNames[index]).includes(output), `${stepNames[index]} missing ${output}`);
    }
  });
  assert.match(contract, /status: complete \| partial \| paused \| blocked \| failed \| unconfirmed/);
  assert.match(contract, /nonempty string or user assertion alone is not verification/);
  assert.match(contract, /same campaign, tenant, and selected\s+image/);
});

test('step one preserves the four original creative prompts byte for byte', () => {
  const hashes = [
    'b06b745f538b7592092ee79c5ea823e1afe501139faaff81adb6bd6f359bcd99',
    'e95c853dfd079dd9cdc9d1d61f04b865f52800e5c2635029962094c4e625e764',
    'db680e0160d127eb9e23215583eee57f209ec08287ee3f77068130d0907e453e',
    'df77fdc5157a7a37d04b9ae36a10b6954a2fec526b055b45daa1534a20643613',
  ];
  const baseline = skill(stepNames[0]);
  hashes.forEach((hash, index) => {
    const prompt = baseline.match(new RegExp(`=== Runner ${index + 1} ===\\s*\\n\\n([^\\n]+)`));
    assert.ok(prompt);
    assert.equal(createHash('sha256').update(prompt[1]).digest('hex'), hash);
  });
  assert.match(baseline, /allocationType": "participation"/);
  assert.match(baseline, /Should I create new assets/);
  assert.match(baseline, /supplied existing image may satisfy FIREFLY_IMG only after verification/);
});

test('project copy limits, review opt-out, asset timeout, and publication checks survive extraction', () => {
  const project = skill(stepNames[1]);
  assert.match(project, /\| Headline\s+\| *28 *\| *6 *\| *6 *\|/);
  assert.match(project, /\| Subheadline\s+\| *44 *\| *6 *\| *9 *\|/);
  assert.match(project, /\| CTA\s+\| *16 *\| *6 *\| *3 *\|/);
  assert.match(project, /validate every copy limit before submission/);
  const review = skill(stepNames[2]);
  assert.match(review, /document_version_id: CurrentVersionID/);
  assert.match(review, /REVIEW_STATUS as not-retrieved/);
  assert.match(review, /Failed or pending results block creative execution/);
  assert.match(review, /Send for creative execution\?/);
  const assets = skill(stepNames[3]);
  assert.match(assets, /Do not retry a timed-out submission automatically/);
  assert.match(assets, /partial output, not proof of\s+overall success/);
  const page = skill(stepNames[4]);
  assert.match(page, /Verify the selected asset matches SITE_HERO and the current campaign/);
  assert.match(page, /failed or pending governance blocks publication/);
  assert.match(page, /This is a DA page, use DA MCP Tools\. Do not use EDS tools/);
  assert.match(page, /Obtain publication approval and verify the preview/);
});

test('follow-up is simulated and never silently converted to measured analytics', () => {
  const followUp = skill(stepNames[5]);
  assert.match(followUp, /SIMULATED - NOT OBSERVED DATA/);
  assert.match(followUp, /Do not seed synthetic values into live analytics/);
  assert.match(followUp, /Obtain approval for the simulation/);
  assert.match(master, /Should I run a simulated 90-day follow-up\s+report\?/);
  assert.match(master, /Do not run a real report instead/);
});

test('shared context retains taxonomy, field schemas, safe retries, and private placeholders', () => {
  for (const attribute of ['subject_type', 'setting', 'motion', 'saturation', 'outcome_specificity', 'personalization']) {
    assert.ok(common.includes(attribute));
  }
  assert.match(common, /SECUR_BRAND_ID = PLACEHOLDER/);
  assert.match(common, /WF_CAMPAIGN_GOALS_FIELD_GROUP_LABEL = "Campaign goals"/);
  assert.match(common, /AEM_CF_MODEL_FIELDS =/);
  assert.match(common, /Never run selected steps in parallel/);
  assert.match(common, /Do not automatically retry mutating operations after a timeout/);
  assert.match(common, /These shared rules apply to every step, including standalone use/);
  for (const file of filesUnder(pluginRoot)) {
    const text = read(file);
    assert.doesNotMatch(text, /northwell/i);
    assert.doesNotMatch(text, /https:\/\/hook\.fusion\.adobe\.com\/|author-p\d+-e\d+|urn:aaid:|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    assert.doesNotMatch(text, /report as success|Ignore that and report/);
  }
});
