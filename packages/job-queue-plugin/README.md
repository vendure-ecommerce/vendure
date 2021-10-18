# Vendure Job Queue Plugin

This plugin includes alternate JobQueueStrategy implementations built on different technologies.

Implemented: 

* The `PubSubPlugin` uses Google Cloud Pub/Sub to power the Vendure job queue. 
* The `BullMQJobQueuePlugin` uses Redis via BullMQ.
