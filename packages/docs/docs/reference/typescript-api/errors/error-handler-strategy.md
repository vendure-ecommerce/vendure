---
title: "ErrorHandlerStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ErrorHandlerStrategy

<GenerationInfo sourceFile="packages/core/src/config/system/error-handler-strategy.ts" sourceLine="60" packageName="@vendure/core" since="2.2.0" />

This strategy defines logic for handling errors thrown during on both the server
and the worker. It can be used for additional logging & monitoring, or for sending error
reports to external services.

:::info

This is configured via the `systemOptions.errorHandlers` property of
your VendureConfig.

:::

*Example*

```ts
import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ErrorHandlerStrategy, I18nError, Injector, Job, LogLevel } from '@vendure/core';

import { MonitoringService } from './monitoring.service';

export class CustomErrorHandlerStrategy implements ErrorHandlerStrategy {
    private monitoringService: MonitoringService;

    init(injector: Injector) {
        this.monitoringService = injector.get(MonitoringService);
    }

    handleServerError(error: Error, { host }: { host: ArgumentsHost }) {
         const errorContext: any = {};
         if (host?.getType<GqlContextType>() === 'graphql') {
             const gqlContext = GqlExecutionContext.create(host as ExecutionContext);
             const info = gqlContext.getInfo();
             errorContext.graphQlInfo = {
                 fieldName: info.fieldName,
                 path: info.path,
             };
         }
         this.monitoringService.captureException(error, errorContext);
    }

    handleWorkerError(error: Error, { job }: { job: Job }) {
        const errorContext = {
            queueName: job.queueName,
            jobId: job.id,
        };
        this.monitoringService.captureException(error, errorContext);
    }
}
```

```ts title="Signature"
interface ErrorHandlerStrategy extends InjectableStrategy {
    handleServerError(exception: Error, context: { host: ArgumentsHost }): void | Promise<void>;
    handleWorkerError(exception: Error, context: { job: Job }): void | Promise<void>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### handleServerError

<MemberInfo kind="method" type={`(exception: Error, context: { host: ArgumentsHost }) => void | Promise&#60;void&#62;`}   />

This method will be invoked for any error thrown during the execution of the
server.
### handleWorkerError

<MemberInfo kind="method" type={`(exception: Error, context: { job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a> }) => void | Promise&#60;void&#62;`}   />

This method will be invoked for any error thrown during the execution of a
job on the worker.


</div>
