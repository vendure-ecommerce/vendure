# Vendure Dashboard

This is a React-based admin dashboard for Vendure. It is a standalone application that can be extended to suit the
needs of any Vendure project.

## Development

Run `npx vite` to start Vite in dev mode.

### Note on internal `@/vdb` imports

You will notice that the dashboard uses internal Vendure Dashboard imports prefixed with `@/vdb`. This is adapted from the
convention of Shadcn which uses a `@/*` path alias for internal imports.

**Why not just use relative imports?**

The problem with using relative imports is that they are handled differently by Vite when compiling the dashboard. This
manifests as things like React Context not working correctly. The underlying reason is that Vite will selectively
pre-compile source code and mixing the imports between alias and relative can result in 2 "versions" of the same code
being loaded, which causes issues with React Context and other things that rely on a single instance of a module.

For this reason, try to use the `@/vdb` alias for all internal Vendure Dashboard imports to the "src/lib" directory.

This is especially import for hooks (since many of them use React Context) and there is even a pre-commit hook
that will run [a script](./scripts/check-internal-imports.js) to ensure that you are not using relative imports for
internal Vendure Dashboard code.

**Type Safety for Consumers**

Because we ship source code in the npm package, consumers need to tell TypeScript how to resolve these internal
imports by adding the path alias to _their_ `tsconfig.json` file.

```json
{
    "compilerOptions": {
        "paths": {
            "@/vdb/*": [
                "./node_modules/@vendure/dashboard/src/lib/*"
            ]
        }
    }
}
```

Note: even without that path alias, the vite compilation will still work, but TypeScript types will not resolve correctly
when developing dashboard extensions.

## Testing

Run `npm run test` to run tests once, or `npx vitest` to run tests in watch mode
