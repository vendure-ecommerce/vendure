---
title: "Deployment"
showtoc: true
---

# Deploying a Vendure Application

A Vendure application is essentially a Node.js application, and can be deployed to any environment that supports Node.js.

The bare minimum requirements are:

* A server with Node.js installed
* A database server (if using MySQL/Postgres)

A typical pattern is to run the Vendure app on the server, e.g. at `http://localhost:3000` an then use [nginx as a reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) to direct requests from the Internet to the Vendure application.

Here is a good guide to setting up a production-ready server for an app such as Vendure: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04

## Admin UI

If you have customized the Admin UI with extensions, it can make sense to [compile your extensions ahead-of-time as part of the deployment process]({{< relref "/docs/plugins/extending-the-admin-ui" >}}#compiling-as-a-deployment-step).
