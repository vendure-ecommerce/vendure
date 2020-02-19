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

This runs the Lerna "bootstrap" command, which installs dependencies for all packages.

### 3. Build all packages

`yarn build`

Packages must be built (i.e. TypeScript compiled, admin ui app built, certain assets copied etc.) before being used.

Note that this can take a few minutes.

### 4. Set up the server

The server requires an SQL database to be available. I am currently using [bitnami-docker-phpmyadmin](https://github.com/bitnami/bitnami-docker-phpmyadmin) Docker image,
which is MariaDB including phpMyAdmin. However, the simplest option is to use SQLite.

Vendure uses [TypeORM](http://typeorm.io), so it is compatible with any database which works with TypeORM.

1. Configure the [dev config](./packages/dev-server/dev-config.ts), making sure the connection settings in the `getDbConfig()` function are correct for the database type you will be using.
2. Create the database using your DB admin tool of choice (e.g. phpMyAdmin if you are using the docker image suggested above). Name it according to the `getDbConfig()` settings. If you are using SQLite, you can skip this step.
3. Populate mock data with `DB=<mysql|postgres|sqlite> yarn dev-server:populate`. If you do not specify the `db` argument, it will default to "mysql".

### 5. Run the dev server

```
DB=<mysql|postgres|sqlite> yarn dev-server:start
```

 If you do not specify the `db` argument, it will default to "mysql".

### 6. Launch the admin ui

1. `cd admin-ui`
2. `yarn start`
3. Go to http://localhost:4200 and log in with "superadmin", "superadmin"

### Code generation

[graphql-code-generator](https://github.com/dotansimha/graphql-code-generator) is used to automatically create TypeScript interfaces
for all GraphQL server operations and admin ui queries. These generated interfaces are used in both the admin ui and the server.

Running `yarn codegen` will generate the following files:

* [`packages/common/src/generated-types.ts`](./packages/common/src/generated-types.ts): Types, Inputs & resolver args relating to the Admin API
* [`packages/common/src/generated-shop-types.ts`](./packages/common/src/generated-shop-types.ts): Types, Inputs & resolver args relating to the Shop API
* [`admin-ui/src/app/common/generated-types.ts`](./admin-ui/src/app/common/generated-types.ts): Types & operations relating to the admin-ui queries & mutations.
* [`packages/core/e2e/graphql/generated-e2e-admin-types.ts`](./packages/core/e2e/graphql/generated-e2e-admin-types.ts): Types used in e2e tests of the Admin API
* [`packages/core/e2e/graphql/generated-e2e-shop-types.ts`](./packages/core/e2e/graphql/generated-e2e-shop-types.ts): Types used in e2e tests of the Shop API

### Testing

#### Server Unit Tests

The server has unit tests which are run with `yarn test:common` and `yarn test:core`.

Unit tests are co-located with the files which they test, and have the suffix `.spec.ts`.

#### Server e2e Tests

The server has e2e tests which test the API with real http calls and against a real Sqlite database powered by [sql.js](https://github.com/kripken/sql.js/). 
The tests are run with `yarn test:e2e`

The e2e tests are located in [`/packages/core/e2e`](./packages/core/e2e). Each test suite (file) has the suffix `.e2e-spec.ts`. The first time the e2e tests are run,
sqlite files will be generated in the `__data__` directory. These files are used to speed up subsequent runs of the e2e tests. They can be freely deleted
and will be re-created the next time the e2e tests are run.

When **debugging e2e tests**, set an environment variable `E2E_DEBUG=true` which will increase the global Jest timeout and allow you to step through the e2e tests without the tests automatically failing due to timeout.

#### Admin UI Unit Tests

The Admin UI has unit tests which are run with `yarn test:admin-ui`.

Unit tests are co-located with the files which they test, and have the suffix `.spec.ts`.

### Release Process

All packages in this repo are released at every version change (using [Lerna's fixed mode](https://github.com/lerna/lerna#fixedlocked-mode-default)). This simplifies both the development (tracking multiple disparate versions is tough) and also the developer experience for users of the framework (it is simple to see that all packages are up-to-date and compatible).

To make a release:

##### 1. `yarn publish-release`

It will run `lerna publish` which will prompt for which version to update to. Although we are using [conventional commits](https://www.conventionalcommits.org), the version is not automatically being calculated from the commit messages. Therefore the next version should be manually selected. 

Next it will build all packages to ensure the distributed files are up to date.

Finally the command will create changelog entries for this release.

##### 2. `git push origin master --follow-tags`

The reason we do not rely on Lerna to push the release to Git is that this repo has a lengthy pre-push hook which runs all tests and builds the admin ui. This long wait then invalidates the npm OTP and the publish will fail. So the solution is to publish first and then push.


## User Guide

TODO: Move this info to the docs

### Localization

Vendure server will detect the most suitable locale based on the `Accept-Language` header of the client.
This can be overridden by appending a `lang` query parameter to the url (e.g. `http://localhost:3000/api?lang=de`). 

All locales in Vendure are represented by 2-character [ISO 639-1 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

Translations for localized strings are located in the [i18n/messages](./packages/core/src/i18n/messages) directory.

### Errors

All errors thrown by the Vendure server can be found in the [errors.ts file](./packages/core/src/common/error/errors.ts). 

All errors extend from `I18nError`, which means that the error messages are localized as described above. Each error type
has a distinct code which can be used by the front-end client in order to correctly handle the error.

### Orders Process

The orders process is governed by a finite state machine which allows each Order to transition only from one valid state
to another, as defined by the [OrderState definitions](packages/core/src/service/helpers/order-state-machine/order-state.ts):

```TypeScript
export type OrderState =
    | 'AddingItems'
    | 'ArrangingPayment'
    | 'PaymentAuthorized'
    | 'PaymentSettled'
    | 'OrderComplete'
    | 'Cancelled';
```

This process can augmented with extra states according to the needs of the business, and these states are defined
in the `orderProcessOptions` property of the VendureConfig object which is used to bootstrap Vendure. Additional
logic can also be defined which will be executed on transition from one state to another.

## License

MIT
