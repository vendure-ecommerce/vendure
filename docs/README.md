# Vendure Docs

This is the source for the Vendure documentation website. Docs are written in markdown and the website is generated with [Hugo](https://gohugo.io).

Currently requires the extended Hugo binary (for Sass support).

### API Docs Generation

The API docs are generated from the TypeScript source files by running the "generate-docs" script:

```bash
yarn generate-docs [-w]
```

This script uses the TypeScript compiler API to traverse the server source code and extract data about the types as well as other information such as descriptions and default values.

Currently, any `interface` which includes the JSDoc `@docCategory` tag will be extracted into a markdown file in the [content/docs/api](./content/docs/api) directory. Hugo can then build the API documentation from these markdown files. This will probably be expanded to be able to parse `class` and `type` declarations too.
