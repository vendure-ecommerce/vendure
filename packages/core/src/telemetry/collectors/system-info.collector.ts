import { Injectable } from '@nestjs/common';
import os from 'os';

export interface SystemInfo {
    nodeVersion: string;
    platform: string;
}

/**
 * Collects basic system information for telemetry.
 */
@Injectable()
export class SystemInfoCollector {
    collect(): SystemInfo {
        return {
            nodeVersion: process.version,
            platform: `${os.platform()} ${os.arch()}`,
        };
    }
}
