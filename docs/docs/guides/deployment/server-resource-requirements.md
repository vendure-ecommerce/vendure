---
title: 'Server resource requirements'
showtoc: true
weight: 1
---

## Server resource requirements

### RAM

The Vendure server and worker process each use around 200-300MB of RAM when idle. This figure will increase under load.

The total RAM required by a single instance of the server depends on your project size (the number of products, variants, customers, orders etc.) as well as expected load (the number of concurrent users you expect). As a rule, 512MB per process would be a practical minimum for a smaller project with low expected load.

### CPU

CPU resources are generally measured in "cores" or "vCPUs" (virtual CPUs) depending on the type of hosting. The exact relationship between vCPUs and physical CPU cores is out of the scope of this guide, but for our purposes we will use "CPU" to refer to both physical and virtual CPU resources.

Because Node.js is single-threaded, a single instance of the Vendure server or worker will not be able to take advantage of multiple CPUs. For example, if you set up a server instance running with 4 CPUs, the server will only use 1 of those CPUs and the other 3 will be wasted.

Therefore, when looking to optimize performance (for example, the number of requests that can be serviced per second), it makes sense to scale horizontally by running multiple instances of the Vendure server. See the [Horizontal Scaling guide](/guides/deployment/horizontal-scaling).

## Load testing

It is important to test whether your current server configuration will be able to handle the loads you expect when you go into production. There are numerous tools out there to help you load test your application, such as:

- [k6](https://k6.io/)
- [Artillery](https://www.artillery.io/)
- [jMeter](https://jmeter.apache.org/)
