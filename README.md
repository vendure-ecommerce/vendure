# Vendure

![logo](admin-ui/src/assets/cube-logo-300px.png)

A headless ecommerce framework built on TypeScript, Node & GraphQL.

### Status

Currently in pre-alpha, i.e. it is not yet useable.

## Structure

Vendure is a headless framework, which means that it is just an API serving JSON via a GraphQL endpoint. The code for
the server is located in the `server` directory.

We will ship with an administration UI which is a stand-alone web application which can be used to perform tasks such
as inventory, order and customer management. The code for this is located in the `admin-ui` directory.

## Development

### Server

* `cd server && yarn`
* `yarn start:dev`

### Admin UI

* `cd admin-ui && yarn`
* `yarn start`

## License

MIT
