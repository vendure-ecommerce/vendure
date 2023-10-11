---
title: "Using docker"
showtoc: true
weight: 3
---

# Using Docker

[Docker](https://docs.docker.com/) is a technology which allows you to run your Vendure application inside a [container](https://docs.docker.com/get-started/#what-is-a-container).
The default installation with `@vendure/create` includes a sample Dockerfile:

```dockerfile title="Dockerfile"
FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./ 
RUN npm install --production
COPY . .
RUN npm run build
```

This Dockerfile can then be built into an "image" using:

```sh
docker build -t vendure .
```

This same image can be used to run both the Vendure server and the worker:

```sh
# Run the server
docker run -dp 3000:3000 --name vendure-server vendure npm run start:server

# Run the worker
docker run -dp 3000:3000 --name vendure-worker vendure npm run start:worker
```

Here is a breakdown of the command used above:

- `docker run` - run the image we created with `docker build`
- `-dp 3000:3000` - the `-d` flag means to run in "detached" mode, so it runs in the background and does not take control of your terminal. `-p 3000:3000` means to expose port 3000 of the container (which is what Vendure listens on by default) as port 3000 on your host machine.
- `--name vendure-server` - we give the container a human-readable name.
- `vendure` - we are referencing the tag we set up during the build.
- `npm run start:server` - this last part is the actual command that should be run inside the container.

## Docker Compose

Managing multiple docker containers can be made easier using [Docker Compose](https://docs.docker.com/compose/). In the below example, we use 
the same Dockerfile defined above, and we also define a Postgres database to connect to:

```yaml
version: "3"
services:
  server:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - 3000:3000
    command: ["npm", "run", "start:server"]
    volumes:
      - /usr/src/app
    environment:
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: vendure
      DB_USERNAME: postgres
      DB_PASSWORD: password
  worker:
    build:
      context: .
      dockerfile: Dockerfile
    command: ["npm", "run", "start:worker"]
    volumes:
      - /usr/src/app
    environment:
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: vendure
      DB_USERNAME: postgres
      DB_PASSWORD: password
  database:
    image: postgres
    volumes:
      - /var/lib/postgresql/data
    ports:
      - 5432:5432
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: vendure
```

## Kubernetes

[Kubernetes](https://kubernetes.io/) is used to manage multiple containerized applications. 
This deployment starts the shop container we created above as both worker and server.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vendure-shop
spec:
  selector:
    matchLabels:
      app: vendure-shop
  replicas: 1
  template:
    metadata:
      labels:
        app: vendure-shop
    spec:
      containers:
        - name: server
          image: vendure-shop:latest
          command:
            - node
          args:
            - "dist/index.js"
          env:
          # your env config here
          ports:
            - containerPort: 3000

        - name: worker
          image: vendure-shop:latest
          imagePullPolicy: Always
          command:
            - node
          args:
            - "dist/index-worker.js"
          env:
          # your env config here
          ports:
            - containerPort: 3000
```

## Health/Readiness Checks

If you wish to deploy with Kubernetes or some similar system, you can make use of the health check endpoints. 

### Server

This is a regular REST route (note: _not_ GraphQL), available at `/health`.

```text 
REQUEST: GET http://localhost:3000/health
```
 
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

Health checks are built on the [Nestjs Terminus module](https://docs.nestjs.com/recipes/terminus). You can also add your own health checks by creating plugins that make use of the [HealthCheckRegistryService](/reference/typescript-api/health-check/health-check-registry-service/).

### Worker

Although the worker is not designed as an HTTP server, it contains a minimal HTTP server specifically to support HTTP health checks. To enable this, you need to call the `startHealthCheckServer()` method after bootstrapping the worker:

```ts
bootstrapWorker(config)
    .then(worker => worker.startJobQueue())
    .then(worker => worker.startHealthCheckServer({ port: 3020 }))
    .catch(err => {
        console.log(err);
    });
```
This will make the `/health` endpoint available. When the worker instance is running, it will return the following:

```text 
REQUEST: GET http://localhost:3020/health
```

```json
{
  "status": "ok"
}
```
