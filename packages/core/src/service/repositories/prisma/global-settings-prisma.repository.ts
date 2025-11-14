/**
 * @description
 * Prisma-based repository for GlobalSettings entity operations.
 * GlobalSettings is typically a singleton entity with only one record.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ID } from '@vendure/common/lib/shared-types';

import { PrismaService } from '../../../connection/prisma.service';

export interface CreateGlobalSettingsData {
    availableLanguages: string[];
    trackInventory?: boolean;
    outOfStockThreshold?: number;
    customFields?: Record<string, any>;
}

export interface UpdateGlobalSettingsData {
    availableLanguages?: string[];
    trackInventory?: boolean;
    outOfStockThreshold?: number;
    customFields?: Record<string, any>;
}

@Injectable()
export class GlobalSettingsPrismaRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find the global settings
     * Since GlobalSettings is a singleton, this returns the first (and usually only) record
     */
    async find(): Promise<any | undefined> {
        const settings = await this.prisma.globalSettings.findFirst({
            orderBy: {
                createdAt: 'asc',
            },
        });

        return settings || undefined;
    }

    /**
     * Find a single global settings by ID
     */
    async findOne(id: ID): Promise<any | undefined> {
        const settings = await this.prisma.globalSettings.findUnique({
            where: { id: String(id) },
        });

        return settings || undefined;
    }

    /**
     * Create global settings
     * This should typically only be called during initial setup
     */
    async create(data: CreateGlobalSettingsData): Promise<any> {
        const settings = await this.prisma.globalSettings.create({
            data: {
                availableLanguages: data.availableLanguages,
                trackInventory: data.trackInventory ?? false,
                outOfStockThreshold: data.outOfStockThreshold ?? 0,
                customFields: data.customFields as Prisma.JsonValue,
            },
        });

        return settings;
    }

    /**
     * Update global settings
     */
    async update(id: ID, data: UpdateGlobalSettingsData): Promise<any> {
        const updateData: Prisma.GlobalSettingsUpdateInput = {};

        if (data.availableLanguages !== undefined) {
            updateData.availableLanguages = data.availableLanguages;
        }

        if (data.trackInventory !== undefined) {
            updateData.trackInventory = data.trackInventory;
        }

        if (data.outOfStockThreshold !== undefined) {
            updateData.outOfStockThreshold = data.outOfStockThreshold;
        }

        if (data.customFields !== undefined) {
            updateData.customFields = data.customFields as Prisma.JsonValue;
        }

        const settings = await this.prisma.globalSettings.update({
            where: { id: String(id) },
            data: updateData,
        });

        return settings;
    }

    /**
     * Upsert global settings
     * Creates if not exists, updates if exists
     */
    async upsert(data: CreateGlobalSettingsData): Promise<any> {
        const existing = await this.find();

        if (existing) {
            return this.update(existing.id, data);
        } else {
            return this.create(data);
        }
    }

    /**
     * Add a language to available languages
     */
    async addLanguage(languageCode: string): Promise<any> {
        const settings = await this.find();

        if (!settings) {
            throw new Error('GlobalSettings not initialized');
        }

        const availableLanguages = settings.availableLanguages || [];

        if (!availableLanguages.includes(languageCode)) {
            availableLanguages.push(languageCode);

            return this.update(settings.id, {
                availableLanguages,
            });
        }

        return settings;
    }

    /**
     * Remove a language from available languages
     */
    async removeLanguage(languageCode: string): Promise<any> {
        const settings = await this.find();

        if (!settings) {
            throw new Error('GlobalSettings not initialized');
        }

        const availableLanguages = (settings.availableLanguages || []).filter(
            (lang: string) => lang !== languageCode,
        );

        return this.update(settings.id, {
            availableLanguages,
        });
    }

    /**
     * Check if a language is available
     */
    async isLanguageAvailable(languageCode: string): Promise<boolean> {
        const settings = await this.find();

        if (!settings) {
            return false;
        }

        return (settings.availableLanguages || []).includes(languageCode);
    }

    /**
     * Get all available languages
     */
    async getAvailableLanguages(): Promise<string[]> {
        const settings = await this.find();

        if (!settings) {
            return [];
        }

        return settings.availableLanguages || [];
    }

    /**
     * Set inventory tracking enabled/disabled
     */
    async setTrackInventory(enabled: boolean): Promise<any> {
        const settings = await this.find();

        if (!settings) {
            throw new Error('GlobalSettings not initialized');
        }

        return this.update(settings.id, {
            trackInventory: enabled,
        });
    }

    /**
     * Set out of stock threshold
     */
    async setOutOfStockThreshold(threshold: number): Promise<any> {
        const settings = await this.find();

        if (!settings) {
            throw new Error('GlobalSettings not initialized');
        }

        return this.update(settings.id, {
            outOfStockThreshold: threshold,
        });
    }
}
