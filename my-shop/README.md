# my-shop

This project was generated with [`@vendure/create`](https://github.com/vendure-ecommerce/vendure/tree/master/packages/create).

Useful links:

- [Vendure docs](https://www.vendure.io/docs)
- [Vendure Discord community](https://www.vendure.io/community)
- [Vendure on GitHub](https://github.com/vendure-ecommerce/vendure)
- [Vendure plugin template](https://github.com/vendure-ecommerce/plugin-template)

## Directory structure

* `/src` contains the source code of your Vendure server. All your custom code and plugins should reside here.
* `/static` contains static (non-code) files such as assets (e.g. uploaded images) and email templates.

## Development

```
npm run dev
```

will start the Vendure server and [worker](https://www.vendure.io/docs/developer-guide/vendure-worker/) processes from
the `src` directory.

## Build

```
npm run build
```

will compile the TypeScript sources into the `/dist` directory.

## Production

For production, there are many possibilities which depend on your operational requirements as well as your production
hosting environment.

### Running directly

You can run the built files directly with the `start` script:

```
npm run start
```

You could also consider using a process manager like [pm2](https://pm2.keymetrics.io/) to run and manage
the server & worker processes.

### Using Docker

We've included a sample [Dockerfile](./Dockerfile) which you can build with the following command:

```
docker build -t vendure .
```

This builds an image and tags it with the name "vendure". We can then run it with:

```
# Run the server
docker run -dp 3000:3000 -e "DB_HOST=host.docker.internal" --name vendure-server vendure npm run start:server

# Run the worker
docker run -dp 3000:3000 -e "DB_HOST=host.docker.internal" --name vendure-worker vendure npm run start:worker
```

Here is a breakdown of the command used above:

- `docker run` - run the image we created with `docker build`
- `-dp 3000:3000` - the `-d` flag means to run in "detached" mode, so it runs in the background and does not take
control of your terminal. `-p 3000:3000` means to expose port 3000 of the container (which is what Vendure listens
on by default) as port 3000 on your host machine.
- `-e "DB_HOST=host.docker.internal"` - the `-e` option allows you to define environment variables. In this case we
are setting the `DB_HOST` to point to a special DNS name that is created by Docker desktop which points to the IP of
the host machine. Note that `host.docker.internal` only exists in a Docker Desktop environment and thus should only be
used in development.
- `--name vendure-server` - we give the container a human-readable name.
- `vendure` - we are referencing the tag we set up during the build.
- `npm run start:server` - this last part is the actual command that should be run inside the container.

### Docker Compose

We've included a [docker-compose.yml](./docker-compose.yml) file which includes configuration for commonly-used
services such as PostgreSQL, MySQL, MariaDB, Elasticsearch and Redis.

To use Docker Compose, you will need to have Docker installed on your machine. Here are installation
instructions for [Mac](https://docs.docker.com/desktop/install/mac-install/), [Windows](https://docs.docker.com/desktop/install/windows-install/),
and [Linux](https://docs.docker.com/desktop/install/linux/).

You can start the services with:

```shell
docker-compose up <service>

# examples:
docker-compose up postgres_db
docker-compose up redis
```

## Plugins

In Vendure, your custom functionality will live in [plugins](https://www.vendure.io/docs/plugins/).
These should be located in the `./src/plugins` directory.

To create a new plugin run:

```
npx vendure add
```

and select `[Plugin] Create a new Vendure plugin`.

## Migrations

[Migrations](https://www.vendure.io/docs/developer-guide/migrations/) allow safe updates to the database schema. Migrations
will be required whenever you make changes to the `customFields` config or define new entities in a plugin.

To generate a new migration, run:

```
npx vendure migrate
```

The generated migration file will be found in the `./src/migrations/` directory, and should be committed to source control.
Next time you start the server, and outstanding migrations found in that directory will be run by the `runMigrations()`
function in the [index.ts file](./src/index.ts).

If, during initial development, you do not wish to manually generate a migration on each change to customFields etc, you
can set `dbConnectionOptions.synchronize` to `true`. This will cause the database schema to get automatically updated
on each start, removing the need for migration files. Note that this is **not** recommended once you have production
data that you cannot lose.

---

You can also run any pending migrations manually, without starting the server via the "vendure migrate" command.

---

## Troubleshooting

### Error: Could not load the "sharp" module using the \[OS\]-x\[Architecture\] runtime when running Vendure server.

- Make sure your Node version is ^18.17.0 || ^20.3.0 || >=21.0.0 to support the Sharp library.
- Make sure your package manager is up to date.
- **Not recommended**: if none of the above helps to resolve the issue, install sharp specifying your machines OS and Architecture. For example: `pnpm install sharp --config.platform=linux --config.architecture=x64` or `npm install sharp --os linux --cpu x64`

