import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { ProcessContext } from '../process-context/process-context';
import { VENDURE_VERSION } from '../version';

import { ConfigCollector } from './collectors/config.collector';
import { DatabaseCollector } from './collectors/database.collector';
import { DeploymentCollector } from './collectors/deployment.collector';
import { InstallationIdCollector } from './collectors/installation-id.collector';
import { PluginCollector } from './collectors/plugin.collector';
import { SystemInfoCollector } from './collectors/system-info.collector';
import { isTelemetryDisabled } from './helpers/is-telemetry-disabled.helper';
import { TelemetryPayload } from './telemetry.types';

const TELEMETRY_ENDPOINT = 'https://telemetry.vendure.io/api/v1/collect';
const TELEMETRY_TIMEOUT_MS = 5000;

/**
 * @description
 * The TelemetryService collects anonymous usage data on Vendure application startup
 * and sends it to the Vendure telemetry endpoint. This data helps the Vendure team
 * understand how the framework is being used and prioritize development efforts.
 *
 * **Privacy guarantees:**
 * - Installation ID is a random UUID, not derived from any system information
 * - Custom plugin names are NOT collected (only count)
 * - Entity counts use ranges, not exact numbers
 * - No PII (no hostnames, IPs, user data) is collected
 * - All failures are silently ignored
 *
 * **Opt-out:**
 * Set the environment variable `VENDURE_DISABLE_TELEMETRY=true` to disable telemetry.
 *
 * **CI environments:**
 * Telemetry is automatically disabled in CI environments.
 *
 * @docsCategory Telemetry
 * @since 3.2.0
 */
@Injectable()
export class TelemetryService implements OnApplicationBootstrap {
    constructor(
        private readonly processContext: ProcessContext,
        private readonly installationIdCollector: InstallationIdCollector,
        private readonly systemInfoCollector: SystemInfoCollector,
        private readonly databaseCollector: DatabaseCollector,
        private readonly pluginCollector: PluginCollector,
        private readonly configCollector: ConfigCollector,
        private readonly deploymentCollector: DeploymentCollector,
    ) {}

    onApplicationBootstrap() {
        // Skip if worker process - only run from server
        if (this.processContext.isWorker) {
            return;
        }

        // Skip if disabled or CI environment
        if (this.isTelemetryDisabled()) {
            return;
        }

        // Delay telemetry collection to allow user bootstrap code to complete
        // This ensures JobQueueService.start() has been called (if it will be)
        // before we check worker mode
        setTimeout(() => {
            this.sendTelemetry().catch(() => {
                // Silently ignore all errors
            });
        }, 5000);
    }

    /**
     * Checks if telemetry is disabled via environment variable or CI detection.
     */
    private isTelemetryDisabled(): boolean {
        return isTelemetryDisabled();
    }

    /**
     * Collects and sends telemetry data.
     */
    private async sendTelemetry(): Promise<void> {
        const payload = await this.collectPayload();
        await this.send(payload);
    }

    /**
     * Collects all telemetry data from the various collectors.
     */
    private async collectPayload(): Promise<TelemetryPayload> {
        const installationId = await this.installationIdCollector.collect();
        const databaseInfo = await this.databaseCollector.collect();

        const systemInfo = this.systemInfoCollector.collect();
        const plugins = this.pluginCollector.collect();
        const config = this.configCollector.collect();
        const deployment = this.deploymentCollector.collect();

        return {
            // Required fields
            installationId,
            timestamp: new Date().toISOString(),
            vendureVersion: VENDURE_VERSION,
            nodeVersion: systemInfo.nodeVersion,
            databaseType: databaseInfo.databaseType,

            // Optional fields
            environment: process.env.NODE_ENV,
            platform: systemInfo.platform,
            plugins,
            metrics: databaseInfo.metrics,
            deployment,
            config,
        };
    }

    /**
     * Sends the telemetry payload to the collection endpoint.
     * Uses a 5-second timeout to prevent blocking.
     */
    private async send(payload: TelemetryPayload): Promise<void> {
        const endpoint = TELEMETRY_ENDPOINT;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TELEMETRY_TIMEOUT_MS);

        try {
            await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });
        } finally {
            clearTimeout(timeoutId);
        }
    }
}
