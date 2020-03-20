# Vendure

A headless [GraphQL](https://graphql.org/) ecommerce framework built on [Node.js](https://nodejs.org) with [Nest](https://nestjs.com/) & [TypeScript](http://www.typescriptlang.org/), with a focus on developer productivity and ease of customization.

[![Build Status](https://github.com/vendure-ecommerce/vendure/workflows/Build%20&%20Test/badge.svg)](https://github.com/vendure-ecommerce/vendure/actions) 
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

### [www.vendure.io](https://www.vendure.io/)

* [Getting Started](https://www.vendure.io/docs/getting-started/): Get Vendure up and running locally in a matter of minutes with a single command
* [Live Demo](https://demo.vendure.io/)
* [Vendure Slack](https://join.slack.com/t/vendure-ecommerce/shared_invite/enQtNzA1NTcyMDY3NTg0LTMzZGQzNDczOWJiMTU2YjAyNWJlMzdmZGE3ZDY5Y2RjMGYxZWNlYTI4NmU4Y2Q1MDNlYzE4MzQ5ODcyYTdmMGU) Join us on Slack for support and answers to your questions

## Structure

This project is a monorepo managed with [Lerna](https://github.com/lerna/lerna). Several npm packages are published from this repo, which can be found in the `packages/` directory.

```
vendure/
├── docs/           # Documentation source
├── e2e-common/     # Shared config for package e2e tests
├── packages/       # Source for the Vendure server, admin-ui & plugin packages
├── scripts/
    ├── changelog/  # Scripts used to generate the changelog based on the git history
    ├── codegen/    # Scripts used to generate TypeScript code from the GraphQL APIs
    ├── docs/       # Scripts used to generate documentation markdown from the source
```

## Development

The following instructions are for those who want to develop the Vendure core framework or plugins (e.g. if you intend to make a pull request). For instructions on how to build a project *using* Vendure, please see the [Getting Started guide](https://www.vendure.io/docs/getting-started/).

### 1. Install top-level dependencies

`yarn`

The root directory has a `package.json` which contains build-related dependencies for tasks including:

* Building & deploying the docs 
* Generating TypeScript types from the GraphQL schema
* Linting, formatting & testing tasks to run on git commit & push

### 2. Bootstrap the packages

`yarn bootstrap`

This runs the Lerna "bootstrap" command, which cross-links monorepo dependencies.

### 3. Build all packages

`yarn build`

Packages must be built (i.e. TypeScript compiled, admin ui app built, certain assets copied etc.) before being used.

Note that this can take a few minutes.

### 4. Set up the server

The server requires an SQL database to be available. I am currently using [bitnami-docker-phpmyadmin](https://github.com/bitnami/bitnami-docker-phpmyadmin) Docker image,
which is MariaDB including phpMyAdmin. However, the simplest option is to use SQLite.

Vendure uses [TypeORM](http://typeorm.io), and officially supports **MySQL**, **PostgreSQL** and **SQLite**, though other TypeORM-supported databases may work.

1. Configure the [dev config](./packages/dev-server/dev-config.ts), making sure the connection settings in the `getDbConfig()` function are correct for the database type you will be using.
2. Create the database using your DB admin tool of choice (e.g. phpMyAdmin if you are using the docker image suggested above). Name it according to the `getDbConfig()` settings. If you are using SQLite, you can skip this step.
3. Populate mock data: 
   ```bash
    cd packages/dev-server
    DB=<mysql|postgres|sqlite> yarn populate
    ```
   If you do not specify the `DB` variable, it will default to "mysql".

### 5. Run the dev server

```
DB=<mysql|postgres|sqlite> yarn dev-server:start
```

If you do not specify the `DB` argument, it will default to "mysql".

### 6. Launch the admin ui

1. `cd admin-ui`
2. `yarn start`
3. Go to http://localhost:4200 and log in with "superadmin", "superadmin"

### Code generation

[graphql-code-generator](https://github.com/dotansimha/graphql-code-generator) is used to automatically create TypeScript interfaces for all GraphQL server operations and admin ui queries. These generated interfaces are used in both the admin ui and the server.

Running `yarn codegen` will generate the following files:

* [`packages/common/src/generated-types.ts`](./packages/common/src/generated-types.ts): Types, Inputs & resolver args relating to the Admin API
* [`packages/common/src/generated-shop-types.ts`](./packages/common/src/generated-shop-types.ts): Types, Inputs & resolver args relating to the Shop API
* [`packages/admin-ui/src/lib/core/src/common/generated-types.ts`](./packages/admin-ui/src/lib/core/src/common/generated-types.ts): Types & operations relating to the admin-ui queries & mutations.
* [`packages/admin-ui/src/lib/core/src/common/introspection-result.ts`](./packages/admin-ui/src/lib/core/src/common/introspection-result.ts): Used by the Apollo Client [`IntrospectionFragmentMatcher`](https://www.apollographql.com/docs/react/data/fragments/#fragments-on-unions-and-interfaces) to correctly handle fragements in the Admin UI.
* Also generates types used in e2e tests in those packages which feature e2e tests (core, elasticsearch-plugin, asset-server-plugin etc).

### Testing

#### Server Unit Tests

The core and several other packages have unit tests which are can be run all together by running `yarn test` from the root directory, or individually by running it from the package directory.

Unit tests are co-located with the files which they test, and have the suffix `.spec.ts`.

#### End-to-end Tests

Certain packages have e2e tests, which are located at `/packages/<name>/e2e/`. All e2e tests can be run by running `yarn e2e` from the root directory, or individually by running it from the package directory.

e2e tests use the `@vendure/testing` package. For details of how the setup works, see the [Testing docs](https://www.vendure.io/docs/developer-guide/testing/)

When **debugging e2e tests**, set an environment variable `E2E_DEBUG=true` which will increase the global Jest timeout and allow you to step through the e2e tests without the tests automatically failing due to timeout.

### Release Process

All packages in this repo are released at every version change (using [Lerna's fixed mode](https://github.com/lerna/lerna#fixedlocked-mode-default)). This simplifies both the development (tracking multiple disparate versions is tough) and also the developer experience for users of the framework (it is simple to see that all packages are up-to-date and compatible).

To make a release:

##### 1. `yarn publish-release`

It will run `lerna publish` which will prompt for which version to update to. Although we are using [conventional commits](https://www.conventionalcommits.org), the version is not automatically being calculated from the commit messages. Therefore the next version should be manually selected. 

Next it will build all packages to ensure the distributed files are up to date.

Finally the command will create changelog entries for this release.

##### 2. `git push origin master --follow-tags`

The reason we do not rely on Lerna to push the release to Git is that this repo has a lengthy pre-push hook which runs all tests and builds the admin ui. This long wait then invalidates the npm OTP and the publish will fail. So the solution is to publish first and then push.

## License

MIT
