---
title: "Installation"
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Requirements
 
* [Node.js](https://nodejs.org/en/) **v16** or above, with support for **even-numbered Node.js versions**.
* The [supported TypeScript version](https://github.com/vendure-ecommerce/vendure/blob/master/packages/create/src/constants.ts#L7) is set upon installation. Upgrading to a newer version of TypeScript might result in compilation errors.
* If you want to use MySQL, MariaDB, or Postgres as your data store, then you'll need an instance available locally. However, if you are just testing out Vendure, we recommend using SQLite, which has no external requirements.

## Installation with @vendure/create

The recommended way to get started with Vendure is by using the [@vendure/create](https://github.com/vendure-ecommerce/vendure/tree/master/packages/create) tool. This is a command-line tool which will scaffold and configure your new Vendure project and install all dependencies.


<Tabs>
<TabItem value="npx" label="npx" default>

```
npx @vendure/create my-shop
```

</TabItem>
<TabItem value="npm init" label="npm init">

```
npm init @vendure my-shop
```

</TabItem>
<TabItem value="yarn create" label="yarn create">

```
yarn create @vendure my-shop
``` 

</TabItem>
</Tabs>

:::note
By default, the `@vendure/create` tool will use [Yarn](https://yarnpkg.com/) to manage your dependencies if you have it installed. If you want to force it to use npm, use the `--use-npm` flag.
:::

*For other installation options see the [@vendure/create documentation](https://github.com/vendure-ecommerce/vendure/blob/master/packages/create/README.md).*


"my-shop" in the above command would be replaced by whatever you'd like to name your new project.
Vendure Create will guide you through the setup. When done, you can run:

```sh
cd my-shop

yarn dev
# or
npm run dev
```

Assuming the default config settings, you can now access:

* The Vendure Admin GraphQL API: [http://localhost:3000/admin-api](http://localhost:3000/admin-api)
* The Vendure Shop GraphQL API: [http://localhost:3000/shop-api](http://localhost:3000/shop-api)
* The Vendure Admin UI: [http://localhost:3000/admin](http://localhost:3000/admin)

:::tip
Open [http://localhost:3000/admin](http://localhost:3000/admin) in your browser and log in with the superadmin credentials you specified, which default to:

* **username**: superadmin
* **password**: superadmin
:::

## Troubleshooting

If you encounter any issues during installation, you can get a more detailed output by setting the log level to `verbose`:

```sh
npx @vendure/create my-shop --log-level verbose
```
