# Contributing

This marketplace targets Claude Desktop/Cowork. Add only plugins that are ready
for public distribution and that you have permission to publish.

## Add a repository-local plugin

1. Create a directory under `plugins/`, for example `plugins/example-plugin/`.
2. Add its manifest at `plugins/example-plugin/.claude-plugin/plugin.json`.
   Keep plugin components, such as `skills/`, at the plugin root, not inside
   `.claude-plugin/`. Follow the
   [plugin structure documentation](https://claude.com/docs/plugins/build).
   Put each skill in `skills/<skill-name>/SKILL.md` with YAML frontmatter
   containing its `name` and `description`.
3. Add an entry to the `plugins` array in
   [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json):

   ```json
   {
     "name": "example-plugin",
     "source": "./plugins/example-plugin",
     "description": "A concise description of the plugin."
   }
   ```

   This object is an example, not a currently available plugin. The entry's
   name must match the `name` in the plugin's own manifest. Source paths are
   relative to the repository root; do not use `..` to traverse outside it.
4. Document the plugin's purpose, usage, prerequisites, permissions, external
   services, and any handling of user data in its own README. Include the
   applicable license or distribution terms for contributed material.
5. Validate the shared plugin format using the Claude Code CLI as a maintainer
   tool, from the repository root:

   ```sh
   claude plugin validate ./plugins/example-plugin
   claude plugin validate .
   ```

6. Test the plugin in Claude Desktop using **Customize > Plugins > Add >
   Upload plugin** with the plugin folder or a ZIP containing its contents.
   After publication, also test installation from the GitHub marketplace.
   Verify actual skill behavior and connector availability in an authorized
   demo environment. Desktop users do not need the Claude Code CLI.
   Validation alone does not test skills, hooks, or integrations.
7. Open a pull request with the plugin's purpose and validation results.

## Review checklist

- The plugin has a clear purpose and accurate documentation.
- The marketplace entry and plugin manifest have matching names.
- All referenced files are committed and available publicly.
- No credentials, private endpoints, customer data, or internal-only content
  are included. Document an approved private configuration mechanism for
  required secrets; never publish live webhook URLs.
- Tool permissions, hooks, external integrations, and data access are explicit.
- All content can legally be distributed and its licensing is documented.
- Shared-format validation and a functional desktop installation test pass.

The marketplace may also reference plugins hosted in separate public
repositories. Follow the
[marketplace source reference](https://code.claude.com/docs/en/plugins/marketplace-reference)
for those entries and verify their availability and distribution permissions.
