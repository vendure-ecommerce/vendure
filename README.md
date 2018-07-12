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

### Localization

Vendure server will detect the most suitable locale based on the `Accept-Language` header of the client.
This can be overridden by appending a `lang` query parameter to the url (e.g. `http://localhost:3000/api?lang=de`). 

All locales in Vendure are represented by 2-character [ISO 639-1 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).


## License

MIT
