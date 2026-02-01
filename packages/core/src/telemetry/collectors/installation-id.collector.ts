import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Manages a persistent installation ID for telemetry purposes.
 * The ID is a random UUID stored in .vendure/.installation-id
 * in the project root (where node_modules resides).
 */
@Injectable()
export class InstallationIdCollector {
    private cachedId: string | undefined;

    /**
     * Returns the installation ID, creating one if it doesn't exist.
     * Falls back to an ephemeral ID if filesystem operations fail.
     */
    collect(): string {
        if (this.cachedId) {
            return this.cachedId;
        }

        try {
            const idPath = this.getInstallationIdPath();
            const vendureDir = path.dirname(idPath);

            // Try to read existing ID
            if (fs.existsSync(idPath)) {
                const existingId = fs.readFileSync(idPath, 'utf-8').trim();
                if (existingId && this.isValidUUID(existingId)) {
                    this.cachedId = existingId;
                    return existingId;
                }
            }

            // Generate new ID
            const newId = crypto.randomUUID();

            // Ensure .vendure directory exists
            if (!fs.existsSync(vendureDir)) {
                fs.mkdirSync(vendureDir, { recursive: true });
            }

            // Write the new ID
            fs.writeFileSync(idPath, newId, 'utf-8');
            this.cachedId = newId;
            return newId;
        } catch {
            // If filesystem fails, use ephemeral ID
            if (!this.cachedId) {
                this.cachedId = crypto.randomUUID();
            }
            return this.cachedId;
        }
    }

    private getInstallationIdPath(): string {
        // Find the project root by looking for node_modules
        let currentDir = process.cwd();

        // Walk up to find project root (where node_modules is)
        while (currentDir !== path.dirname(currentDir)) {
            if (fs.existsSync(path.join(currentDir, 'node_modules'))) {
                return path.join(currentDir, '.vendure', '.installation-id');
            }
            currentDir = path.dirname(currentDir);
        }

        // Fallback to cwd
        return path.join(process.cwd(), '.vendure', '.installation-id');
    }

    private isValidUUID(str: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    }
}
