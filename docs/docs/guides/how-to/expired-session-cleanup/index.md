---
title: 'Expired Session Cleanup'
---

# Expired Session Cleanup

As noted in [SessionService](/reference/typescript-api/services/session-service), sessions are not automatically deleted when expired. This means that if you have a large number of sessions, you may need to clean them up periodically to avoid clogging up your database.

This guide aims to demonstrate how to create [Stand-alone CLI Scripts](/guides/developer-guide/stand-alone-scripts/) to automate the process of cleaning up expired sessions.

## Code

This code bootstraps the Vendure Worker, then retrieves the `SessionService` and calls the `cleanupExpiredSessions` method on it, completely removing all expired sessions from the database. It can be easily run from the command-line or scheduled to run periodically.

```ts title="src/expired-session-cleanup.ts"
import { bootstrapWorker, Logger, SessionService, RequestContextService } from '@vendure/core';
import { config } from './vendure-config';

const loggerCtx = 'ExpiredSessionCleanup';

if (require.main === module) {
    cleanupExpiredSessions()
        .then(() => process.exit(0))
        .catch(err => {
            Logger.error(err, loggerCtx);
            process.exit(1);
        });
}

async function cleanupExpiredSessions() {
    Logger.info('Session cleanup started.', loggerCtx);

    // Bootstrap an instance of the Vendure Worker
    const { app } = await bootstrapWorker(config);

    // Retrieve the SessionService
    const sessionService = app.get(SessionService);

    // Create a RequestContext for administrative tasks
    const ctx = await app.get(RequestContextService).create({
        apiType: 'admin',
    });

    // Call the cleanup function
    await sessionService.cleanupExpiredSessions(ctx);

    Logger.info('Session cleanup completed.', loggerCtx);
}
```
