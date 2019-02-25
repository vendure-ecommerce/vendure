---
title: "Getting Started"
weight: 0
---

# Getting Started

## Requirements
 
* [Node.js](https://nodejs.org/en/) **v8.9.0** or above
* An SQL database compatible with [TypeORM](http://typeorm.io/#/), i.e. MySQL, MariaDB, PostgreSQL, SQLite, Microsoft SQL Server, sql.js, Oracle.
 
## Installation

The following instructions describe how to run a development instance of Vendure using ts-node and SQLite.

### Set up the database

You'll need a database to store your shop data.

{{% tab "SQLite" %}}
The simplest way to try out Vendure is to use SQLite, since it does not require a separate database server to work. You only need to install the [sqlite3 driver](https://www.npmjs.com/package/sqlite3) to allow Vendure to read and write to an SQLite database file:
```bash
$ npm install sqlite3

# or with Yarn
$ yarn add sqlite3

```
{{% /tab %}}
{{% tab "MySQL/MariaDB" %}}
You'll need a MySQL or MariaDB server available to your local machine. For development we can recommend the [bitnami-docker-phpmyadmin](https://github.com/bitnami/bitnami-docker-phpmyadmin) Docker image, which is MariaDB including phpMyAdmin.

In addition, you must install the [mysql driver](https://www.npmjs.com/package/mysql) for Node.js:
```bash
$ npm install mysql

# or with Yarn
$ yarn add mysql

```
{{% /tab %}}
{{% tab "PostgreSQL" %}}
You'll need a PostgreSQL server available to your local machine.

In addition, you must install the [pg driver](https://www.npmjs.com/package/pg) for Node.js:
```bash
$ npm install pg

# or with Yarn
$ yarn add pg

```
{{% /tab %}}

### Install ts-node

**TypeScript only:** If you want to use TypeScript, [ts-node](https://www.npmjs.com/package/ts-node) allows you to run TypeScript directly without a compilation step, which is convenient for development.

```bash
$ npm install --save-dev ts-node

# or with Yarn
$ yarn add --dev ts-node 
```

### Install Vendure

```bash
$ npm install @vendure/core@alpha

# or with Yarn
$ yarn add @vendure/core@alpha
```

### Initialize with the Vendure CLI

Vendure includes a CLI program which can generate the initial configuration and entry file for your server:

```bash
$ npx vendure init

# or with Yarn
$ yarn vendure init
```

The init command will ask a series of questions which allow the CLI to generate a configuration and index file.

### Run

Once the init script has completed, the server can be started.

{{% tab "TypeScript" %}}
```bash
$ npx ts-node index

# or with Yarn
$ yarn ts-node index
```
{{% /tab %}}
{{% tab "JavaScript" %}}
```bash
$ node index
```
{{% /tab %}}

Assuming the default config settings, you can now access:

* The Vendure Admin GraphQL API: [http://localhost:3000/admin-api](http://localhost:3000/admin-api)
* The Vendure Shop GraphQL API: [http://localhost:3000/shop-api](http://localhost:3000/shop-api)
* The Vendure Admin UI: [http://localhost:3000/admin](http://localhost:3000/admin)

{{% alert primary %}}
Log in with the superadmin credentials:

* **username**: superadmin
* **password**: superadmin
{{% /alert %}}
