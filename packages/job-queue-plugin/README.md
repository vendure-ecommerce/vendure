# Vendure Job Queue Plugin

This plugin is under development. It will house plugins that implement alternate JobQueueStrategies aimed at handling more demanding production loads than can be comfortably handled by the database-powered DefaultJobQueuePlugin which ships with Vendure core.

Implemented: 

* The `PubSubPlugin` uses Google Cloud Pub/Sub to power the Vendure job queue. 

Planned:

* Redis
* RabbitMQ
