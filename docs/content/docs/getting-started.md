---
title: "Getting Started"
weight: 1
---

# Getting Started

## Requirements
 
* [Node.js](https://nodejs.org/en/) v8 or above
* An SQL database compatible with [TypeORM](http://typeorm.io/#/), i.e. MySQL, MariaDB, PostgreSQL, SQLite, Microsoft SQL Server, sql.js, Oracle.
 
## Installation

```bash
$ npm install --save @vendure/core
```

Vendure includes a CLI program which can generate the initial configuration and entry file for your server:

```bash
$ npx vendure init
```

The init command will ask a series of questions which allow the CLI to generate a configuration and index file.

```bash
$ ts-node index
```

or if using JavaScript:
```bash
$ node index
```

## Making a request

When making an API request, it must include a `vendure-token` header with the value being the channel token of the active channel. This value is set in the config by the `defaultChannelToken` property. If this is not set, or does not match a valid channel token, you will get the error `No valid channel was specified`.

For example:
```TypeScript
// index.ts
bootstrap({
    port: 3000,
    apiPath: 'api',
    defaultChannelToken: 'default-channel'
    // ...
});
```

```TypeScript
// API call
fetch(
    'http://localhost:3000/api',
    {
        headers: {
            'content-type': 'application/json',
            'vendure-token': 'default-channel',
        },
        body: '{"query":"mutation { login(username: \\"superadmin\\", password: \\"superadmin\\") { user { id } } }"}',
        method: 'POST',
    },
);
```
