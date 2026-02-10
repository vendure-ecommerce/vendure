> **Notice:** The Pub/Sub plugin (`PubSubPlugin`) is moving to
> [`@vendure-community/pub-sub-plugin`](https://github.com/vendurehq/community-plugins).
> It will be removed from this package in Vendure v3.6.0.
> The BullMQ plugin remains here unchanged.

# Vendure Job Queue Plugin

This plugin includes alternate JobQueueStrategy implementations built on different technologies.

Implemented: 

* The `PubSubPlugin` uses Google Cloud Pub/Sub to power the Vendure job queue. 
* The `BullMQJobQueuePlugin` uses Redis via BullMQ.
