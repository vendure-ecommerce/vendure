---
title: "Logger"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Logger

<GenerationInfo sourceFile="packages/core/src/config/logger/vendure-logger.ts" sourceLine="136" packageName="@vendure/core" />

The Logger is responsible for all logging in a Vendure application.

It is intended to be used as a static class:

*Example*

```ts
import { Logger } from '@vendure/core';

Logger.info(`Some log message`, 'My Vendure Plugin');
```

The actual implementation - where the logs are written to - is defined by the <a href='/reference/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a>
instance configured in the <a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>. By default, the <a href='/reference/typescript-api/logger/default-logger#defaultlogger'>DefaultLogger</a> is used, which
logs to the console.

## Implementing a custom logger

A custom logger can be passed to the `logger` config option by creating a class which implements the
<a href='/reference/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a> interface. For example, here is how you might go about implementing a logger which
logs to a file:

*Example*

```ts
import { VendureLogger } from '@vendure/core';
import fs from 'fs';

// A simple custom logger which writes all logs to a file.
export class SimpleFileLogger implements VendureLogger {
    private logfile: fs.WriteStream;

    constructor(logfileLocation: string) {
        this.logfile = fs.createWriteStream(logfileLocation, { flags: 'w' });
    }

    error(message: string, context?: string) {
        this.logfile.write(`ERROR: [${context}] ${message}\n`);
    }
    warn(message: string, context?: string) {
        this.logfile.write(`WARN: [${context}] ${message}\n`);
    }
    info(message: string, context?: string) {
        this.logfile.write(`INFO: [${context}] ${message}\n`);
    }
    verbose(message: string, context?: string) {
        this.logfile.write(`VERBOSE: [${context}] ${message}\n`);
    }
    debug(message: string, context?: string) {
        this.logfile.write(`DEBUG: [${context}] ${message}\n`);
    }
}

// in the VendureConfig
export const config = {
    // ...
    logger: new SimpleFileLogger('server.log'),
}
```

```ts title="Signature"
class Logger implements LoggerService {
    logger: VendureLogger
    error(message: string, context?: string, trace?: string) => void;
    warn(message: string, context?: string) => void;
    info(message: string, context?: string) => void;
    verbose(message: string, context?: string) => void;
    debug(message: string, context?: string) => void;
}
```
* Implements: <code>LoggerService</code>



<div className="members-wrapper">

### logger

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a>`}   />


### error

<MemberInfo kind="method" type={`(message: string, context?: string, trace?: string) => void`}   />


### warn

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### info

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### verbose

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />


### debug

<MemberInfo kind="method" type={`(message: string, context?: string) => void`}   />




</div>
