---
title: "Getting Started"
weight: 0
---

# Getting Started

## Requirements
 
* [Node.js](https://nodejs.org/en/) **v8.9.0** or above
* If you want to use MySQL, MariaDB, or Postgres as your data store, then you'll need an instance available locally. However, if you are just testing out Vendure, we recommend using SQLite, which has no external requirements.
* For Windows users: make sure you have **[windows build tools](https://www.npmjs.com/package/windows-build-tools) installed**
  * `npm install --global --production windows-build-tools`
  * This step should be done with administrative rights, and is required because Vendure makes use of some dependencies which must be compiled upon installation.
 
## Installation with @vendure/create

The recommended way to get started with Vendure is by using the [@vendure/create](https://github.com/vendure-ecommerce/vendure/tree/master/packages/create) tool. This is a command-line tool which will scaffold and configure your new Vendure project and install all dependiencies.

{{% tab "npx" %}}
```sh
npx @vendure/create my-app
```

{{% alert primary %}}
[npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher.
{{% /alert %}}
{{% /tab %}}
{{% tab "npm init" %}}
```sh
npm init @vendure my-app
```
{{% alert primary %}}
`npm init <initializer>` is available in npm 6+
{{% /alert %}}
{{% /tab %}}
{{% tab "yarn create" %}}
```sh
yarn create @vendure my-app
```
{{% alert primary %}}
`yarn create` is available in Yarn 0.25+
{{% /alert %}}
{{% /tab %}}

*For other installation options see the [@vendure/create documentation](https://github.com/vendure-ecommerce/vendure/blob/master/packages/create/README.md).*


"my-app" in the above command would be replaced by whatever you'd like to name your new project.
Vendure Create will guide you through the setup. When done, you can run:

```sh
cd my-app

yarn start
# or
npm run start
```

Assuming the default config settings, you can now access:

* The Vendure Admin GraphQL API: [http://localhost:3000/admin-api](http://localhost:3000/admin-api)
* The Vendure Shop GraphQL API: [http://localhost:3000/shop-api](http://localhost:3000/shop-api)
* The Vendure Admin UI: [http://localhost:3000/admin](http://localhost:3000/admin)

{{% alert primary %}}
Log in with the superadmin credentials:

* **username**: superadmin
* **password**: superadmin
{{% /alert %}}

## Next Steps

* Get a better understanding of how Vendure works by reading the [Architecture Overview]({{< relref "/docs/developer-guide/overview" >}})
* Learn how to implement a storefront with the [GraphQL API Guide]({{< relref "/docs/storefront/shop-api-guide" >}})
