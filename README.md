# Vendure [![Build Status](https://travis-ci.org/vendure-ecommerce/vendure.svg?branch=master)](https://travis-ci.org/vendure-ecommerce/vendure)

![logo](admin-ui/src/assets/cube-logo-300px.png)

A headless [GraphQL](https://graphql.org/) ecommerce framework built on [NestJS](https://nestjs.com/) with [TypeScript](http://www.typescriptlang.org/).

### Status

Currently in pre-alpha, i.e. it is not yet useable.

## Structure

Vendure is a headless framework, which means that it is just an API serving JSON via a GraphQL endpoint. The code for
the server is located in the `server` directory.

We will ship with an administration UI which is a stand-alone web application which can be used to perform tasks such
as inventory, order and customer management. The code for this is located in the `admin-ui` directory.

## Development

### Server

The server requires an SQL database to be available. I am currently using [bitnami-docker-phpmyadmin](https://github.com/bitnami/bitnami-docker-phpmyadmin) Docker image,
which is MariaDB including phpMyAdmin.

Vendure uses [TypeORM](http://typeorm.io), so it compatible will any database which works with TypeORM.

* Configure the [dev config](./server/dev-config.ts)
* `cd server && yarn`
* `yarn start:dev`
* Populate mock data with `yarn populate`

### Admin UI

* `cd admin-ui && yarn`
* `yarn start`
* Go to http://localhost:4200 and log in with "admin@test.com", "test"

## User Guide

### Code Generation

[apollo-cli](https://github.com/apollographql/apollo-cli) is used to automatically create TypeScript interfaces
for all GraphQL queries used in the admin ui. These generated interfaces are used in both the admin ui and the server.

Run `yarn generate-gql-types` to generate TypeScript interfaces based on these queries. The generated
types are located at [`./shared/generated-types.ts`](./shared/generated-types.ts).

### Localization

Vendure server will detect the most suitable locale based on the `Accept-Language` header of the client.
This can be overridden by appending a `lang` query parameter to the url (e.g. `http://localhost:3000/api?lang=de`). 

All locales in Vendure are represented by 2-character [ISO 639-1 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

### Custom Fields

The developer may add custom fields to most of the entities in Vendure, which may contain any data specific to their
business requirements. For example, attaching extra login data to a User or some boolean flag to a Product.

Custom fields can currently be added to the following entities:

* Address
* Customer
* Facet
* FacetValue
* Product
* ProductOption
* ProductOptionGroup
* ProductVariant
* User

Custom fields are configured by means of a `customFields` property in the VendureConfig object passed to the `bootstrap()` function.

#### Example

```TypeScript
bootstrap({
    port: API_PORT,
    apiPath: API_PATH,
    cors: true,
    jwtSecret: 'some-secret',
    dbConnectionOptions: {
        // ...
    },
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


## License

MIT
