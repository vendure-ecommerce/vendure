# Vendure

An open-source headless commerce platform built on [Node.js](https://nodejs.org) with [GraphQL](https://graphql.org/), [Nest](https://nestjs.com/) & [TypeScript](http://www.typescriptlang.org/), with a focus on developer productivity and ease of customization.

> [!IMPORTANT]
> **We're introducing our new React-based Admin Dashboard**</br>
> Check out our beta preview now: [v3.3.0 release notes](https://github.com/vendure-ecommerce/vendure/releases/tag/v3.3.0)</br>
> We're phasing out our Angular-based Admin UI with support until June 2026:
> [Read more here](https://vendure.io/blog/2025/02/vendure-react-admin-ui)

[![Build Status](https://github.com/vendure-ecommerce/vendure/actions/workflows/build_and_test.yml/badge.svg?branch=master)](https://github.com/vendure-ecommerce/vendure/actions/workflows/build_and_test.yml)
[![Publish & Install](https://github.com/vendure-ecommerce/vendure/actions/workflows/publish_and_install.yml/badge.svg?branch=master)](https://github.com/vendure-ecommerce/vendure/actions/workflows/publish_and_install.yml)
[![Lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

![vendure-github-social-banner](https://github.com/vendure-ecommerce/vendure/assets/24294584/ada25fa3-185d-45ce-896d-bece3685a829)

### [www.vendure.io](https://www.vendure.io/)

- [Getting Started](https://docs.vendure.io/guides/getting-started/installation/): Get Vendure up and running locally in a matter of minutes with a single command
- [Public Demo](https://vendure.io/demo): Take a look the Vendure Admin UI
- [Vendure Discord](https://www.vendure.io/community): Join us on Discord for support and answers to your questions

## Branches

- `master` - The latest stable release, currently the 3.x series.
- `minor` - The next minor release, including new features
- `major` - The next major release (v4.0)
- `v2.x` - The 2.x line, which will receive critical fixes until the end-of-life on 31.12.2024. The code in this branch is under the MIT license.

## Structure

This project is a monorepo managed with [Lerna](https://github.com/lerna/lerna). Several npm packages are published from this repo, which can be found in the `packages/` directory.

```
vendure/
├── docs/           # Documentation source
├── e2e-common/     # Shared config for package e2e tests
├── license/        # License information & CLA signature log
├── packages/       # Source for the Vendure server, admin-ui & core plugin packages
├── scripts/
    ├── changelog/  # Scripts used to generate the changelog based on the git history
    ├── codegen/    # Scripts used to generate TypeScript code from the GraphQL APIs
    ├── docs/       # Scripts used to generate documentation markdown from the source
```

## Contributing

You are very much welcome to contribute to Vendure, we appreciate every pull request made, issue reported or any other form of feedback or input.

Before getting started, please read our [Contribution Guidelines](https://github.com/vendure-ecommerce/vendure/blob/master/CONTRIBUTING.md) first to make the most out of your time and ours.

If you're looking for a place to start, check out our [list of issues labeled "contributions welcome"](https://github.com/vendure-ecommerce/vendure/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22contributions%20welcome%22).

Thank you for considering making Vendure better!

## Development

> [!IMPORTANT]
> The following instructions are for those who want to develop the Vendure core framework or plugins (e.g. if you intend to make a pull request). For instructions on how to build a project _using_ Vendure, please see the [Getting Started guide](https://docs.vendure.io/guides/getting-started/installation/).

### 1. Install top-level dependencies

`npm install`

The root directory has a `package.json` which contains build-related dependencies for tasks including:

- Building & deploying the docs
- Generating TypeScript types from the GraphQL schema
- Linting, formatting & testing tasks to run on git commit & push

### 2. Build all packages

`npm run build`

Packages must be built (i.e. TypeScript compiled, Admin UI app built, certain assets copied etc.) before being used.

Note that this can take a few minutes.

### 3. Start the docker containers

All the necessary infrastructure is defined in the root [docker-compose.yml](./docker-compose.yml) file. At a minimum,
you will need to start a database, for example:

```bash
docker-compose up -d mariadb
```

MariaDB/MySQL is the default that will be used by the dev server if you don't explicitly set the `DB` environment variable.

If for example you are doing development on the Elasticsearch plugin, you will also need to start the Elasticsearch container:

```bash
docker-compose up -d elasticsearch
```

### 4. Populate test data

Vendure uses [TypeORM](http://typeorm.io) and officially supports **MySQL**, **MariaDB**, **PostgreSQL**, and **SQLite**.

The first step is to populate the dev server with some test data:

```bash
cd packages/dev-server
npm run populate
```

By default, if you do not specify the `DB` environment variable, it will use **MySQL/MariaDB**.

If you want to develop against **PostgreSQL**:

1. Run the `postgres_16` Docker container.

```bash
docker-compose up -d postgres_16
```

2. Create a .env file in `/packages/dev-server` and declare the `DB` variable inside it:

    ```env
    DB=postgres
    ```
3. Now run the npm populate script.

> [!TIP]
> You can also set the environment variable directly in the CLI:
>
> ```bash
> DB=postgres npm run populate
> ```

### 5. Run the dev server

```bash
cd packages/dev-server
npm run dev
```

This will start the development server, and you should see output in your terminal indicating that the **Vendure development server** has successfully started.

The output lists the available endpoints for the Shop API, Admin API, GraphiQL interfaces, asset server, development mailbox, and the Admin UI, along with their respective URLs.

You can now access these services in your browser for development and testing.

Default Admin UI credentials:

Username: `superadmin`
Password: `superadmin`

### Testing Admin UI changes locally

If you are making changes to the Admin UI, you need to start the Admin UI independent from the dev-server:

> [!NOTE]
> You don't need this step when you just use the Admin UI just
> to test backend changes since the `dev-server` package ships with a default admin-ui

```
cd packages/admin-ui
npm run dev
```

This will run a separate process of admin-ui on "http://localhost:4200", you can login with the default credentials:

Username: `superadmin`
Password: `superadmin`

This will auto restart when you make changes to the Admin UI.

### Testing your changes locally

This example shows how to test changes to the `payments-plugin` package locally.
This same workflow can be used for other packages as well.

### Terminal Setup

**In 2 separate terminal windows:**

**Terminal 1** - Watch changes to the package:

```bash
cd packages/payments-plugin
npm run watch
```

**Terminal 2** - Run the development server:

```bash
cd packages/dev-server
npm run dev
```

> [!NOTE]
> After making changes, you need to stop and restart the development server to see your changes.

> [!WARNING]
> If you are developing changes for the `core` package, you also need to watch the `common` package:

in the root of the project:

```shell
npm run watch:core-common
```

#### Development Workflow Summary

1. Start your package watcher (npm run watch)
2. Start the dev-server (npm run dev)
3. Make code changes
4. Wait for compilation to complete
5. Restart dev-server to see changes

### Interactive debugging

To debug the dev server with VS Code use the included [launch.json](/.vscode/launch.json) configuration.

### Code generation

[graphql-code-generator](https://github.com/dotansimha/graphql-code-generator) is used to automatically create TypeScript interfaces for all GraphQL server operations and Admin UI queries. These generated interfaces are used in both the Admin UI and the server.

Running `npm run codegen` will generate the following files:

- [`packages/common/src/generated-types.ts`](./packages/common/src/generated-types.ts): Types, Inputs & resolver args relating to the Admin API
- [`packages/common/src/generated-shop-types.ts`](./packages/common/src/generated-shop-types.ts): Types, Inputs & resolver args relating to the Shop API
- [`packages/admin-ui/src/lib/core/src/common/generated-types.ts`](./packages/admin-ui/src/lib/core/src/common/generated-types.ts): Types & operations relating to the admin-ui queries & mutations.
- [`packages/admin-ui/src/lib/core/src/common/introspection-result.ts`](./packages/admin-ui/src/lib/core/src/common/introspection-result.ts): Used by the Apollo Client [`IntrospectionFragmentMatcher`](https://www.apollographql.com/docs/react/data/fragments/#fragments-on-unions-and-interfaces) to correctly handle fragments in the Admin UI.
- Also generates types used in e2e tests in those packages which feature e2e tests (core, elasticsearch-plugin, asset-server-plugin etc).

### Testing

#### Server Unit Tests

The core and several other packages have unit tests which can be run all together by running `npm run test` from the root directory, or individually by running it from the package directory.

Unit tests are co-located with the files which they test, and have the suffix `.spec.ts`.

If you're getting `Error: Bindings not found.`, please run `npm rebuild @swc/core`.

#### End-to-end Tests

Certain packages have e2e tests, which are located at `/packages/<name>/e2e/`. All e2e tests can be run by running `npm run e2e` from the root directory, or individually by running it from the package directory.

e2e tests use the `@vendure/testing` package. For details of how the setup works, see the [Testing docs](https://docs.vendure.io/guides/developer-guide/testing/).

When **debugging e2e tests**, set an environment variable `E2E_DEBUG=true` which will increase the global Jest timeout and allow you to step through the e2e tests without the tests automatically failing due to timeout.

### Release Process

All packages in this repo are released at every version change (using [Lerna's fixed mode](https://lerna.js.org/docs/features/version-and-publish#fixedlocked-mode-default)). This simplifies both the development (tracking multiple disparate versions is tough) and also the developer experience for users of the framework (it is simple to see that all packages are up-to-date and compatible).

To make a release:

##### 1. `npm run publish-release`

It will run `lerna version` which will prompt for which version to update to. Although we are using [conventional commits](https://www.conventionalcommits.org), the version is not automatically being calculated from the commit messages. Therefore, the next version should be manually selected.

Next it will build all packages to ensure the distributed files are up to date.

Finally, the command will create changelog entries for this release and create a tagged commit.

##### 2. `git push origin master --follow-tags`

The reason we do not rely on Lerna to push the release to Git is that this repo has a lengthy pre-push hook which runs all tests and builds the Admin UI. This long wait then invalidates the npm OTP and the publish will fail. So the solution is to publish first and then push.

##### 3. Create a GitHub release

Finally, a GitHub release should be created based on the tag generated by Lerna. This will trigger the "Publish to npmjs" workflow
which will publish & sign each package.

## License

See [LICENSE.md](./LICENSE.md).
