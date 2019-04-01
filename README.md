# Vendure [![Build Status](https://travis-ci.org/vendure-ecommerce/vendure.svg?branch=master)](https://travis-ci.org/vendure-ecommerce/vendure)

A headless [GraphQL](https://graphql.org/) ecommerce framework built on [Node.js](https://nodejs.org) with [Nest](https://nestjs.com/) with [TypeScript](http://www.typescriptlang.org/).

### [www.vendure.io](https://www.vendure.io/)

## Structure

Vendure is a headless framework, which means that it is just an API serving JSON via a GraphQL endpoint. The code for
the server is located in the `server` directory.

We ship with an administration UI which is a stand-alone web application which can be used to perform tasks such
as inventory, order and customer management. The code for this is located in the `admin-ui` directory.

```
vendure/
├── admin-ui/       # Source of the admin ui app (an Angular CLI project)
├── docs/           # Documentation source
├── packages/       # Source for the Vendure server & plugin packages
├── scripts/
    ├── codegen/    # Scripts used to generate TypeScript code from the GraphQL APIs
```

## Development

### 1. Install top-level dependencies

`yarn`

The root directory has a `package.json` which contains build-related dependencies for tasks including:

* Building & deploying the docs 
* Generating TypeScript types from the GraphQL schema
* Linting, formatting & testing tasks to run on git commit & push

### 2. Set up the server

The server requires an SQL database to be available. I am currently using [bitnami-docker-phpmyadmin](https://github.com/bitnami/bitnami-docker-phpmyadmin) Docker image,
which is MariaDB including phpMyAdmin.

Vendure uses [TypeORM](http://typeorm.io), so it compatible will any database which works with TypeORM.

1. Configure the [dev config](./server/dev-config.ts)
2. Create the database using your DB admin tool of choice (e.g. phpMyAdmin if you are using the docker image suggested above). Name it according to the config ("vendure-dev").
3. `cd server && yarn`
4. Populate mock data with `yarn populate`
5. `yarn start:dev` to start the server

### 3. Set up the admin ui

1. `cd admin-ui && yarn`
2. `yarn start`
3. Go to http://localhost:4200 and log in with "superadmin", "superadmin"

### Code generation

[graphql-code-generator](https://github.com/dotansimha/graphql-code-generator) is used to automatically create TypeScript interfaces
for all GraphQL server operations and admin ui queries. These generated interfaces are used in both the admin ui and the server.

Run `yarn codegen` to generate TypeScript interfaces based on these queries. The generated
types are located at [`packages/common/src/generated-types.ts`](./packages/common/src/generated-types.ts) & [`packages/common/src/generated-shop-types.ts`](./packages/common/src/generated-shop-types.ts).

### Testing

#### Server Unit Tests

The server has unit tests which are run with the following scripts in the `server` directory:

* `yarn test` - Run unit tests once
* `yarn test:watch` - Run unit tests in watch mode

Unit tests are co-located with the files which they test, and have the suffix `.spec.ts`.

#### Server e2e Tests

The server has e2e tests which test the API with real http calls and against a real Sqlite database powered by [sql.js](https://github.com/kripken/sql.js/). 
The tests are run with the following scripts in the `server` directory:

* `yarn test:e2e` - Run e2e tests once
* `yarn test:e2e:watch` - Run e2e tests in watch mode

The e2e tests are located in [`/server/e2e`](./server/e2e). Each test suite (file) has the suffix `.e2e-spec.ts`. The first time the e2e tests are run,
sqlite files will be generated in the `__data__` directory. These files are used to speed up subsequent runs of the e2e tests. They can be freely deleted
and will be re-created the next time the e2e tests are run.

#### Admin UI Unit Tests

The Admin UI has unit tests which are run with the following scripts in the `admin-ui` directory:

* `yarn test --watch=false` - Run unit tests once.
* `yarn test` - Run unit tests in watch mode.

Unit tests are co-located with the files which they test, and have the suffix `.spec.ts`.

## User Guide

### Localization

Vendure server will detect the most suitable locale based on the `Accept-Language` header of the client.
This can be overridden by appending a `lang` query parameter to the url (e.g. `http://localhost:3000/api?lang=de`). 

All locales in Vendure are represented by 2-character [ISO 639-1 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

Translations for localized strings are located in the [i18n/messages](./server/src/i18n/messages) directory.

### Errors

All errors thrown by the Vendure server can be found in the [errors.ts file](./server/src/common/error/errors.ts). 

All errors extend from `I18nError`, which means that the error messages are localized as described above. Each error type
has a distinct code which can be used by the front-end client in order to correctly handle the error.

### Custom Fields

The developer may add custom fields to most of the entities in Vendure, which may contain any data specific to their
business requirements. For example, attaching extra login data to a User or some boolean flag to a Product.

Custom fields can currently be added to the following entities:

* Address
* Customer
* Facet
* FacetValue
* GlobalSettings
* Product
* ProductCategory
* ProductOption
* ProductOptionGroup

Custom fields are configured by means of a `customFields` property in the VendureConfig object passed to the `bootstrap()` function.

#### Example

```TypeScript
bootstrap({
    // ...
    customFields: {
        Product: [
            { name: 'infoUrl', type: 'string' },
            { name: 'downloadable', type: 'boolean' },
            { name: 'shortName', type: 'localeString' },
        ],
        User: [
            { name: 'socialLoginToken', type: 'string' },
        ],
    },
})
```

When Vendure runs, the specified properties will be added to a `customFields` property of the Product and User entities, and
the GraphQL schema will be updated to reflect the availability of these fields.

In the admin UI, there will be form inputs which allow these fields to be updated by an administrator.

#### Custom Field Types

Currently the supported types are:

| type          | corresponding type in DB  | corresponding GraphQL type    |
| ----          | ------------------------  | --------------------------    |
| string        | varchar                   | String                        |
| localeString  | varchar                   | String                        |
| int           | int                       | Int                           |
| float         | double                    | Float                         |
| boolean       | bool / tinyint            | Boolean                       | 
| datetime      | datetime / timestamp      | String                        |

Note that the "localeString" type can be localized into any languages supported by your instance.

The following types are under consideration:

* blob
* text

#### Planned extensions

Currently a custom field configuration has only a "name" and "type". We will be adding further configuration
options in the future as the framework matures. Currently-planned options are:

* **Enum-like options for strings**. This would display a `<select>` control with pre-defined values.
* **Access control based on user permissions**. So that read / update access to a given custom field can be
restricted e.g. only authenticated users / admins / not exposed via the GraphQL API at all (in the case where)
the custom field will be used solely programatically by business logic contained in custom plugins).
* **Config for the controls in the admin UI**. For example, an "int" field could have its "step", "max" and "min" values
specified, which would add corresponding constraints in the admin UI.
* **Validation logic**. It may be useful to allow the developer to pass a validation function for that field in the config,
so that any specific constraints can be imposed on the inputted data in a consistent manner.
* **Custom UI Widget**. For certain specialized custom fields, it may be desirable for the administrator to be able to use
a custom-made form input to set the value in the admin UI. For example, a "location" field could use a visual map interface
to set the coordiantes of a point. This would probably be a post-1.0 feature.

### Orders Process

The orders process is governed by a finite state machine which allows each Order to transition only from one valid state
to another, as defined by the [OrderState definitions](server/src/service/helpers/order-state-machine/order-state.ts):

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
