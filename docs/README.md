# Vendure Docs

This is the source for the Vendure documentation website. Docs are written in markdown and the website is generated with [Hugo](https://gohugo.io).

## Building the docs

1. [Install Hugo](https://gohugo.io/getting-started/installing/) on your machine. Currently, the live docs are built with **Hugo v0.7**.
2. Install docs dependencies by running `yarn install` or `npm install` in this directory.
3. Then run the `docs:build` script from the root of this repo.

This task will:

* Auto-generate the API markdown files based on the Vendure server source (see below)
* Run webpack to build the JavaScript and CSS for the docs site
* Run Hugo to build and output the site into the `docs/public` directory.

## Dev mode

Run `docs:watch` when developing the docs site. This will run all of the above in watch mode, so you can go to [http://localhost:1313](http://localhost:1313) to view the docs site. It will auto-reload the browser on any changes to the server source, the docs script/styles assets, or the Hugo templates.

## Docs Generation

All of the documentation for the interal APIs (configuration docs) and the GraphQL API is auto-generated.

### GraphQL Docs

The GraphQL API docs are generated from the `schema.json` file which is created as part of the "generate-gql-types" script.

### Configuration Docs

The configuration docs are generated from the TypeScript source files by running the "generate-config-docs" script:

```bash
yarn generate-config-docs [-w]
```

This script uses the TypeScript compiler API to traverse the server source code and extract data about the types as well as other information such as descriptions and default values.

Currently, any `interface`, `class` or `type` which includes the JSDoc `@docCategory` tag will be extracted into a markdown file in the [content/docs/api](./content/docs/api) directory. Hugo can then build the API documentation from these markdown files.

#### Docs-specific JSDoc tags

##### `@docsCategory`

This is required as its presence determines whether the declaration is extracted into the docs. Its value should be a string corresponding to the API sub-section that this declaration belongs to, e.g. "payment", "shipping" etc.

##### `@docsPage`

This optional tag can be used to group declarations together onto a single page. This is useful e.g. in the case of utility functions or
type aliases, which may be considered too trivial to get an entire page to themselves.

##### `@description`

This tag specifies the text description of the declaration. It supports markdown, but should not be used for code blocks, which should be tagged with `@example` (see below). Links to other declarations can be made with the `{@link SomeOtherDeclaration}` syntax. Also applies to class/interface members.

##### `@example`

This tag should be used to include any code blocks. Remember to specify the language after the opening delimiter for correct highlighting. Also applies to class/interface members.

##### `@default`

This is used to specify the default value of a property, e.g. when documenting an optional configuration option.

##### `@internal`

This is used to exlude members from appearing in the docs. For example, a class may need a particular
public method for internal use, but this method is not intended to be used by external consumers of that
class.

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


## A note on icons

The docs site also uses the [Clarity icons](https://clarity.design/icons) to maintain consistency with the Vendure admin ui app. However, currently [this bug](https://github.com/vmware/clarity/issues/2599) makes the use of the custom-elements based icons unfeasible since it adds about 400kb to the JS bundle size. This is unacceptable for what is essentially a static HTML site.

So for now we are hand-picking the icons as svg files from [https://icongr.am/clarity](https://icongr.am/clarity) and using them as regular images. The downside is that to get different colours, the svg files themselves must be edited.

This is a pain but for the small number of icons planned, it is workable.
