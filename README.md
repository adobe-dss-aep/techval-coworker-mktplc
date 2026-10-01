# TechVal Coworker Marketplace

A public Claude Desktop/Cowork plugin marketplace maintained by
[adobe-dss-aep](https://github.com/adobe-dss-aep).

Repository: https://github.com/adobe-dss-aep/techval-coworker-mktplc

## Status

| Plugin | Skill | Purpose |
| --- | --- | --- |
| [secur-csc-fsi](plugins/secur-csc-fsi/README.md) | `secur-csc-fsi` | Public-safe, configurable Secur Financial/Get Moving Content Supply Chain demo workflow |

The first plugin uses Secur Financial branding while preserving the supplied
demo workflow, imagery, and appointment metrics. Authorized connectors and
private environment configuration are required before running it.

This is a community-maintained marketplace, not an official Anthropic
marketplace. Publication does not imply endorsement by Adobe or Anthropic.

## Add the marketplace

In the Claude Desktop app:

1. Open **Customize > Plugins**.
2. Select **Add marketplace** (under **Add** in some app versions).
3. Enter `https://github.com/adobe-dss-aep/techval-coworker-mktplc`.
4. Select **secur-csc-fsi** and install it.
5. In Cowork, ask: "Use secur-csc-fsi to build the Secur Financial Get Moving demo."

Adding the marketplace registers its catalog; installing a plugin is a
separate step. To fetch updates, select **Check for updates** on the marketplace
or enable **Sync automatically**.

Claude Code is not required to install or use this plugin in Claude Desktop.
The CLI below is only a maintainer validation tool for the shared manifest
format.

## Repository layout

- [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json):
  marketplace identity, maintainer, and plugin catalog.
- [`.github/workflows/validate-marketplace.yml`](.github/workflows/validate-marketplace.yml):
  automated manifest validation on pushes and pull requests.
- [`plugins/secur-csc-fsi/`](plugins/secur-csc-fsi/): the first plugin and skill.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): how to add and validate plugins.

The GitHub repository itself hosts the marketplace. A GitHub Pages website is
not required and is not configured.

## Validate locally

Maintainers with the Claude Code CLI can validate the shared plugin format
from the repository root:

```sh
claude plugin validate ./plugins/secur-csc-fsi
claude plugin validate .
```

CI uses Claude Code version `2.1.233`. When changing the CI validator version,
also update this version reference and validate the catalog with that version.
Structural validation does not verify desktop installation or Adobe service
execution; test those separately in an authorized environment.

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a plugin. Do not publish
credentials, customer information, internal-only material, or content you do
not have permission to distribute.

## References

- [Install plugins in Claude Desktop/Cowork](https://claude.com/docs/cowork/guide/plugins)
- [Plugin structure and testing](https://claude.com/docs/plugins/build)
- [Marketplace manifest reference](https://code.claude.com/docs/en/plugins/marketplace-reference)
