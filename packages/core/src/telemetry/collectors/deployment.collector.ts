import { Injectable } from '@nestjs/common';
import fs from 'fs';

import { ProcessContext } from '../../process-context/process-context';
import { isCI } from '../helpers/ci-detector.helper';
import { TelemetryDeployment } from '../telemetry.types';

/**
 * Cloud provider detection based on environment variables.
 */
const CLOUD_PROVIDERS: Array<{ name: string; envVars: string[] }> = [
    { name: 'aws', envVars: ['AWS_REGION', 'AWS_LAMBDA_FUNCTION_NAME', 'AWS_EXECUTION_ENV'] },
    { name: 'gcp', envVars: ['GOOGLE_CLOUD_PROJECT', 'GCLOUD_PROJECT', 'GCP_PROJECT'] },
    { name: 'azure', envVars: ['AZURE_FUNCTIONS_ENVIRONMENT', 'WEBSITE_SITE_NAME'] },
    { name: 'vercel', envVars: ['VERCEL', 'VERCEL_ENV'] },
    { name: 'railway', envVars: ['RAILWAY_ENVIRONMENT', 'RAILWAY_PROJECT_ID'] },
    { name: 'render', envVars: ['RENDER', 'RENDER_SERVICE_ID'] },
    { name: 'fly', envVars: ['FLY_APP_NAME', 'FLY_REGION'] },
    { name: 'heroku', envVars: ['DYNO', 'HEROKU_APP_NAME'] },
    { name: 'digitalocean', envVars: ['DIGITALOCEAN_APP_NAME', 'DO_APP_PLATFORM'] },
    { name: 'northflank', envVars: ['NORTHFLANK_APP_NAME', 'NF_PROJECT_NAME'] },
];

/**
 * Serverless environment detection.
 */
const SERVERLESS_ENV_VARS = [
    'AWS_LAMBDA_FUNCTION_NAME',
    'FUNCTION_NAME', // GCP Cloud Functions
    'AZURE_FUNCTIONS_ENVIRONMENT',
    'VERCEL_ENV',
    'NETLIFY_FUNCTIONS',
];

/**
 * Collects deployment environment information for telemetry.
 */
@Injectable()
export class DeploymentCollector {
    constructor(private processContext: ProcessContext) {}

    collect(): TelemetryDeployment {
        return {
            containerized: this.isContainerized(),
            cloudProvider: this.detectCloudProvider(),
            workerMode: this.getWorkerMode(),
            serverless: this.isServerless(),
            ci: isCI(),
        };
    }

    private isContainerized(): boolean {
        // Check for Docker
        if (fs.existsSync('/.dockerenv')) {
            return true;
        }

        // Check for Kubernetes
        if (process.env.KUBERNETES_SERVICE_HOST) {
            return true;
        }

        // Check cgroup for containerization (Linux only)
        try {
            if (fs.existsSync('/proc/1/cgroup')) {
                const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf-8');
                if (
                    cgroup.includes('docker') ||
                    cgroup.includes('kubepods') ||
                    cgroup.includes('containerd')
                ) {
                    return true;
                }
            }
        } catch {
            // Ignore errors
        }

        return false;
    }

    private detectCloudProvider(): string | undefined {
        for (const provider of CLOUD_PROVIDERS) {
            const hasEnvVar = provider.envVars.some(envVar => {
                const value = process.env[envVar];
                return value !== undefined && value !== '';
            });

            if (hasEnvVar) {
                return provider.name;
            }
        }

        return undefined;
    }

    private getWorkerMode(): 'integrated' | 'separate' {
        // If we're in the server process and detecting telemetry,
        // we check if there's a separate worker based on ProcessContext
        // The presence of ProcessContext.isWorker being false means we're in server
        // but we can't know if there's a separate worker without additional config
        // So we report based on current process context
        return this.processContext.isWorker ? 'separate' : 'integrated';
    }

    private isServerless(): boolean {
        return SERVERLESS_ENV_VARS.some(envVar => {
            const value = process.env[envVar];
            return value !== undefined && value !== '';
        });
    }
}
