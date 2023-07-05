---
title: "Logging"
showtoc: true
---

# Logging

Logging allows you to see what is happening inside the Vendure server. It is useful for debugging and for monitoring the health of the server in production.

In Vendure, logging is configured using the `logger` property of the [VendureConfig]({{< relref "vendure-config" >}}) object. The logger must implement the [VendureLogger]({{< relref "vendure-logger" >}}) interface.

See also: [Implementing a custom logger]({{< relref "logger" >}}#implementing-a-custom-logger)

## Log levels

Vendure uses 5 log levels, in order of increasing severity:

| Level     | Description                                                                                              |
|-----------|----------------------------------------------------------------------------------------------------------|
| `Debug`   | The most verbose level, used for debugging purposes. The output can be very noisy at this level          |
| `Verbose` | More information than the Info level, but less than `Debug`                                              |
| `Info`    | General information about the normal running of the server                                               |
| `Warning` | Issues which might need attention or action, but which do not prevent the server from continuing to run. |
| `Error`   | Errors which should be investigated and handled; something has gone wrong.                               |


## DefaultLogger

Vendure ships with a [DefaultLogger]({{< relref "default-logger" >}}) which logs to the console (process.stdout). It can be configured with the desired log level:

```TypeScript
import { DefaultLogger, VendureConfig } from '@vendure/core';

const config: VendureConfig = {
    // ...
    logger: new DefaultLogger({ level: LogLevel.Debug }),
};
```

## Logging database queries

To log database queries, set the `logging` property of the `dbConnectionOptions` as well as setting the logger to `Debug` level.

```TypeScript
import { DefaultLogger, LogLevel, VendureConfig } from '@vendure/core';

const config: VendureConfig = {
    // ...
    logger: new DefaultLogger({ level: LogLevel.Debug }),
    dbConnectionOptions: {
        // ... etc
        logging: true,
        
        // You can also specify which types of DB events to log:
        // logging: ['error', 'warn', 'schema', 'query', 'info', 'log'],
    },
};
```

More information about the `logging` option can be found in the [TypeORM logging documentation](https://typeorm.io/logging).

## Logging in your own plugins

When you extend Vendure by creating your own plugins, it's a good idea to log useful information about what your plugin is doing. To do this, you need to import the [Logger]({{< relref "logger" >}}) class from `@vendure/core` and use it in your plugin:

```TypeScript
import { Logger } from '@vendure/core';

// It is customary to define a logger context for your plugin
// so that the log messages can be easily identified.
const loggerCtx = 'MyPlugin';

// somewhere in your code
Logger.info(`My plugin is doing something!`, loggerCtx);
```
