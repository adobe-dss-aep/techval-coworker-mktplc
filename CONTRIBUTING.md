# Contributing

The initial catalog is intentionally empty. Add only plugins that are ready for
public distribution and that you have permission to publish.

## Add a repository-local plugin

1. Create a directory under `plugins/`, for example `plugins/example-plugin/`.
2. Add its manifest at `plugins/example-plugin/.claude-plugin/plugin.json`.
   Keep plugin components, such as `skills/`, at the plugin root, not inside
   `.claude-plugin/`. Follow the
   [Claude plugin documentation](https://code.claude.com/docs/en/plugins).
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
5. Validate the plugin and the marketplace from the repository root:

   ```sh
   claude plugin validate ./plugins/example-plugin
   claude plugin validate .
   ```

6. Test registration and installation locally:

   ```sh
   claude plugin marketplace add .
   claude plugin install example-plugin@techval-coworker-mktplc
   ```

   Use a separate test environment if this marketplace name is already
   registered from GitHub. Verify the actual plugin behavior as well as its
   manifest. Validation alone does not test skills, hooks, or integrations.
7. Open a pull request with the plugin's purpose and validation results.

## Review checklist

- The plugin has a clear purpose and accurate documentation.
- The marketplace entry and plugin manifest have matching names.
- All referenced files are committed and available publicly.
- No credentials, private endpoints, customer data, or internal-only content
  are included. Use documented environment variables for required secrets.
- Tool permissions, hooks, external integrations, and data access are explicit.
- All content can legally be distributed and its licensing is documented.
- Claude Code validation and a functional installation test pass.

The marketplace may also reference plugins hosted in separate public
repositories. Follow the
[marketplace source reference](https://code.claude.com/docs/en/plugins/marketplace-reference)
for those entries and verify their availability and distribution permissions.
