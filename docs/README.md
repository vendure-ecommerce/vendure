# Vendure Docs

This is the source for the documentation part of the vendure.io website. Docs are written in markdown and the website is generated with [Hugo](https://gohugo.io).

## Structure

```
docs
├── content/
│   └── # The actual markdown files
│       # which make up the docs, both manually-written
│       # and auto-generated from source.
├── data/
│   └── # Data files used in generating the docs website
└── diagrams/
    └── # PlantUML diagrams used in the documentation
```

The `content` directory contains the actual documentation markdown files and images.

## Docs Generation

All of the documentation for the TypeScript APIs and the GraphQL API is auto-generated.

Run the `docs:build` script from the root of this repo.

This task will:

* Auto-generate the API markdown files based on the Vendure server source (see below)
* Update the build data to match the current version and commit

The generated markdown is then used by an external project which builds the Vendure website.

### GraphQL Docs

The GraphQL API docs are generated from the `schema.json` file which is created as part of the `codegen` script.

### TypeScript Docs

The TypeScript docs are generated from the TypeScript source files by running the `docs:generate-typescript-docs` script:

```bash
yarn docs:generate-typescript-docs [-w]
```

This script uses the TypeScript compiler API to traverse the server source code and extract data about the types as well as other information such as descriptions and default values.

Currently, any `interface`, `class` or `type` which includes the JSDoc `@docCategory` tag will be extracted into a markdown file in the [content/docs/api](./content/docs/api) directory. Hugo can then build the API documentation from these markdown files.

#### Docs-specific JSDoc tags

##### `@docsCategory`

This is required as its presence determines whether the declaration is extracted into the docs. Its value should be a string corresponding to the API sub-section that this declaration belongs to, e.g. "payment", "shipping" etc.

##### `@docsPage`

This optional tag can be used to group declarations together onto a single page. This is useful e.g. in the case of utility functions or
type aliases, which may be considered too trivial to get an entire page to themselves.

##### `@docsWeight`

This optional tag can be used to define the order of definitions on a single page. By default, multiple definitions on a page are sorted alphabetically,
but this sometimes leaves the "main" definition near the bottom. In this case, the `@docsWeight` tag can promote it to the top (0 is first).

##### `@description`

This tag specifies the text description of the declaration. It supports markdown, but should not be used for code blocks, which should be tagged with `@example` (see below). Links to other declarations can be made with the `{@link SomeOtherDeclaration}` syntax. Also applies to class/interface members.

##### `@example`

This tag should be used to include any code blocks. Remember to specify the language after the opening delimiter for correct highlighting. Also applies to class/interface members. If the example code includes the `@` character, it must be escaped
so that it is not interpreted as a JSDoc tag:

```ts
import { VendureConfig } from '\@vendure/core';
```

##### `@default`

This is used to specify the default value of a property, e.g. when documenting an optional configuration option.

##### `@internal`

This is used to exclude members from appearing in the docs. For example, a class may need a particular
public method for internal use, but this method is not intended to be used by external consumers of that
class.

##### `@since`

The @since tag indicates that a class, method, or other symbol was added in a specific version.

##### Example

````ts
/**
 * @description
 * Greets people with a friendly message. 
 * Used by the {@link AppInitializer} during the start-up process.
 *
 * @example
 * ```ts
 * const greeter = new Greeter();
 * console.log(greeter.greet('mike'));
 * // -> 'Hi, mike, good to see you!'
 * ```
 *
 * @docsCategory helpers
 */
export class Greeter {

    /**
     * @description
     * Greets the person by name
     */
    greet(name: string): string {
      return `Hi, ${name}, good to see you!`;
    }
    
    /**
     * Required as a work-around for issue #1234
     * @internal
     */
    someMethodUsedOnlyByVendureCore() {
        // ...
    }
}
````
