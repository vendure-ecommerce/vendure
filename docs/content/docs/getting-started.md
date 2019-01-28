---
title: "Getting Started"
weight: 0
---

# Getting Started

## Requirements
 
* [Node.js](https://nodejs.org/en/) v8 or above
* An SQL database compatible with [TypeORM](http://typeorm.io/#/), i.e. MySQL, MariaDB, PostgreSQL, SQLite, Microsoft SQL Server, sql.js, Oracle.
 
## Installation

The following instructions describe how to run a development instance of Vendure using ts-node and a MySQL / MariaDB server

### Set up the database

You'll need a database server available from your local machine. For example, [this MariaDB & phpMyAdmin Docker image](https://github.com/bitnami/bitnami-docker-phpmyadmin) can be used. Create a new database and name it e.g. "vendure".

You'll also need a driver for Vendure to connect to the database. In this case, the `mysql` package.

```bash
$ npm install mysql --save
```

### Install ts-node

This allows us to run TypeScript directly without a compilation step. Useful for development.

```bash
$ npm install --save-dev ts-node
```

### Install Vendure

```bash
$ npm install --save @vendure/core
```

### Initialize with the Vendure CLI

Vendure includes a CLI program which can generate the initial configuration and entry file for your server:

```bash
$ npx vendure init
```

The init command will ask a series of questions which allow the CLI to generate a configuration and index file.

### Run

Once the init script has completed, the server can be started.

```bash
$ ts-node index
```

Assuming the default config settings, you can now access:

* The Vendure GraphQL API: [http://localhost:3000/api](http://localhost:3000/api)
* The Vendure Admin UI: [http://localhost:3000/admin](http://localhost:3000/admin)

{{% alert primary %}}
Log in with the superadmin credentials:

* **username**: superadmin
* **password**: superadmin
{{% /alert %}}
