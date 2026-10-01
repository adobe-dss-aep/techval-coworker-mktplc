# TechVal Coworker Marketplace

A public Claude plugin marketplace maintained by
[adobe-dss-aep](https://github.com/adobe-dss-aep).

Repository: https://github.com/adobe-dss-aep/techval-coworker-mktplc

## Status

The marketplace is initialized with an **empty catalog**. No plugins are
currently available to install. This repository provides the catalog and
contribution process for publishing future Technical Validation plugins.

This is a community-maintained marketplace, not an official Anthropic
marketplace. Publication does not imply endorsement by Adobe or Anthropic.

## Add the marketplace

With [Claude Code](https://code.claude.com/docs/en/setup) installed, run:

```sh
claude plugin marketplace add adobe-dss-aep/techval-coworker-mktplc
```

Alternatively, inside a Claude Code session:

```text
/plugin marketplace add adobe-dss-aep/techval-coworker-mktplc
```

Adding the marketplace registers its catalog; it does not install any plugins.
Once plugins are published, their installation IDs will follow this pattern:

```text
<plugin-name>@techval-coworker-mktplc
```

To fetch catalog updates:

```sh
claude plugin marketplace update techval-coworker-mktplc
```

## Repository layout

- [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json):
  marketplace identity, maintainer, and plugin catalog.
- [`.github/workflows/validate-marketplace.yml`](.github/workflows/validate-marketplace.yml):
  automated Claude Code validation on pushes and pull requests.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): how to add and validate plugins.

The GitHub repository itself hosts the marketplace. A GitHub Pages website is
not required and is not configured.

## Validate locally

From the repository root:

```sh
claude plugin validate .
```

CI uses Claude Code version `2.1.233`. When changing the CI validator version,
also update this version reference and validate the catalog with that version.

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a plugin. Do not publish
credentials, customer information, internal-only material, or content you do
not have permission to distribute.

## References

- [Create a Claude plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces)
- [Marketplace manifest reference](https://code.claude.com/docs/en/plugins/marketplace-reference)
- [Create plugins](https://code.claude.com/docs/en/plugins)
