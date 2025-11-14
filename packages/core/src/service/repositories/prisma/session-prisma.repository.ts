/**
 * @description
 * Prisma-based repository for Session entity operations.
 * Handles both authenticated sessions and anonymous sessions.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { PrismaService } from '../../../connection/prisma.service';

export interface SessionListOptions {
    skip?: number;
    take?: number;
    filter?: {
        userId?: string;
        invalidated?: boolean;
        expired?: boolean;
    };
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateSessionData {
    token: string;
    expires: Date;
    userId: string;
    activeOrderId?: string | null;
    customFields?: Record<string, any>;
}

export interface UpdateSessionData {
    expires?: Date;
    invalidated?: boolean;
    activeOrderId?: string | null;
    customFields?: Record<string, any>;
}

export interface CreateAnonymousSessionData {
    token: string;
    expires: Date;
    activeOrderId?: string | null;
    customFields?: Record<string, any>;
}

export interface UpdateAnonymousSessionData {
    expires?: Date;
    activeOrderId?: string | null;
    customFields?: Record<string, any>;
}

/**
 * Default include for loading Session relations
 */
const DEFAULT_SESSION_INCLUDE = {
    user: {
        include: {
            roles: {
                include: {
                    role: {
                        include: {
                            channels: {
                                include: {
                                    channel: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    activeOrder: true,
} satisfies Prisma.SessionInclude;

const DEFAULT_ANONYMOUS_SESSION_INCLUDE = {
    activeOrder: true,
} satisfies Prisma.AnonymousSessionInclude;

@Injectable()
export class SessionPrismaRepository {
    constructor(private readonly prisma: PrismaService) {}

    // ==================== Authenticated Session Methods ====================

    /**
     * Find a single session by ID
     */
    async findOne(id: ID, includeRelations: boolean = true): Promise<any | undefined> {
        const include = includeRelations ? DEFAULT_SESSION_INCLUDE : undefined;

        const session = await this.prisma.session.findUnique({
            where: { id: String(id) },
            include,
        });

        return session || undefined;
    }

    /**
     * Find a session by token
     */
    async findByToken(token: string): Promise<any | undefined> {
        const session = await this.prisma.session.findUnique({
            where: { token },
            include: DEFAULT_SESSION_INCLUDE,
        });

        return session || undefined;
    }

    /**
     * Find all sessions with pagination and filtering
     */
    async findAll(options: SessionListOptions = {}): Promise<PaginatedList<any>> {
        const { skip = 0, take = 10, filter, sort } = options;

        // Build where clause
        const where: Prisma.SessionWhereInput = {};

        if (filter?.userId) {
            where.userId = filter.userId;
        }

        if (filter?.invalidated !== undefined) {
            where.invalidated = filter.invalidated;
        }

        if (filter?.expired !== undefined) {
            if (filter.expired) {
                where.expires = {
                    lt: new Date(),
                };
            } else {
                where.expires = {
                    gte: new Date(),
                };
            }
        }

        // Build orderBy
        let orderBy: Prisma.SessionOrderByWithRelationInput = {
            createdAt: 'desc',
        };

        if (sort?.field) {
            orderBy = {
                [sort.field]: sort.order || 'asc',
            };
        }

        // Execute query
        const [items, totalItems] = await Promise.all([
            this.prisma.session.findMany({
                where,
                include: DEFAULT_SESSION_INCLUDE,
                skip,
                take,
                orderBy,
            }),
            this.prisma.session.count({ where }),
        ]);

        return {
            items,
            totalItems,
        };
    }

    /**
     * Find all sessions by user ID
     */
    async findByUserId(userId: ID): Promise<any[]> {
        const sessions = await this.prisma.session.findMany({
            where: {
                userId: String(userId),
            },
            include: DEFAULT_SESSION_INCLUDE,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return sessions;
    }

    /**
     * Create a new session
     */
    async create(data: CreateSessionData): Promise<any> {
        const session = await this.prisma.session.create({
            data: {
                token: data.token,
                expires: data.expires,
                userId: data.userId,
                activeOrderId: data.activeOrderId,
                customFields: data.customFields as Prisma.JsonValue,
            },
            include: DEFAULT_SESSION_INCLUDE,
        });

        return session;
    }

    /**
     * Update an existing session
     */
    async update(id: ID, data: UpdateSessionData): Promise<any> {
        const updateData: Prisma.SessionUpdateInput = {};

        if (data.expires !== undefined) {
            updateData.expires = data.expires;
        }

        if (data.invalidated !== undefined) {
            updateData.invalidated = data.invalidated;
        }

        if (data.activeOrderId !== undefined) {
            updateData.activeOrderId = data.activeOrderId;
        }

        if (data.customFields !== undefined) {
            updateData.customFields = data.customFields as Prisma.JsonValue;
        }

        const session = await this.prisma.session.update({
            where: { id: String(id) },
            data: updateData,
            include: DEFAULT_SESSION_INCLUDE,
        });

        return session;
    }

    /**
     * Invalidate a session
     */
    async invalidate(id: ID): Promise<void> {
        await this.prisma.session.update({
            where: { id: String(id) },
            data: {
                invalidated: true,
            },
        });
    }

    /**
     * Delete a session
     */
    async delete(id: ID): Promise<void> {
        await this.prisma.session.delete({
            where: { id: String(id) },
        });
    }

    /**
     * Delete expired sessions
     */
    async deleteExpired(): Promise<number> {
        const result = await this.prisma.session.deleteMany({
            where: {
                expires: {
                    lt: new Date(),
                },
            },
        });

        return result.count;
    }

    /**
     * Invalidate all sessions for a user
     */
    async invalidateAllForUser(userId: ID): Promise<number> {
        const result = await this.prisma.session.updateMany({
            where: {
                userId: String(userId),
            },
            data: {
                invalidated: true,
            },
        });

        return result.count;
    }

    // ==================== Anonymous Session Methods ====================

    /**
     * Find an anonymous session by ID
     */
    async findAnonymousOne(id: ID): Promise<any | undefined> {
        const session = await this.prisma.anonymousSession.findUnique({
            where: { id: String(id) },
            include: DEFAULT_ANONYMOUS_SESSION_INCLUDE,
        });

        return session || undefined;
    }

    /**
     * Find an anonymous session by token
     */
    async findAnonymousByToken(token: string): Promise<any | undefined> {
        const session = await this.prisma.anonymousSession.findUnique({
            where: { token },
            include: DEFAULT_ANONYMOUS_SESSION_INCLUDE,
        });

        return session || undefined;
    }

    /**
     * Create a new anonymous session
     */
    async createAnonymous(data: CreateAnonymousSessionData): Promise<any> {
        const session = await this.prisma.anonymousSession.create({
            data: {
                token: data.token,
                expires: data.expires,
                activeOrderId: data.activeOrderId,
                customFields: data.customFields as Prisma.JsonValue,
            },
            include: DEFAULT_ANONYMOUS_SESSION_INCLUDE,
        });

        return session;
    }

    /**
     * Update an existing anonymous session
     */
    async updateAnonymous(id: ID, data: UpdateAnonymousSessionData): Promise<any> {
        const updateData: Prisma.AnonymousSessionUpdateInput = {};

        if (data.expires !== undefined) {
            updateData.expires = data.expires;
        }

        if (data.activeOrderId !== undefined) {
            updateData.activeOrderId = data.activeOrderId;
        }

        if (data.customFields !== undefined) {
            updateData.customFields = data.customFields as Prisma.JsonValue;
        }

        const session = await this.prisma.anonymousSession.update({
            where: { id: String(id) },
            data: updateData,
            include: DEFAULT_ANONYMOUS_SESSION_INCLUDE,
        });

        return session;
    }

    /**
     * Delete an anonymous session
     */
    async deleteAnonymous(id: ID): Promise<void> {
        await this.prisma.anonymousSession.delete({
            where: { id: String(id) },
        });
    }

    /**
     * Delete expired anonymous sessions
     */
    async deleteExpiredAnonymous(): Promise<number> {
        const result = await this.prisma.anonymousSession.deleteMany({
            where: {
                expires: {
                    lt: new Date(),
                },
            },
        });

        return result.count;
    }

    /**
     * Convert anonymous session to authenticated session
     * This creates a new authenticated session and deletes the anonymous one
     */
    async convertToAuthenticated(anonymousSessionId: ID, userId: ID, newToken: string): Promise<any> {
        const anonymousSession = await this.findAnonymousOne(anonymousSessionId);

        if (!anonymousSession) {
            throw new Error('Anonymous session not found');
        }

        // Create authenticated session
        const authenticatedSession = await this.create({
            token: newToken,
            expires: anonymousSession.expires,
            userId: String(userId),
            activeOrderId: anonymousSession.activeOrderId,
            customFields: anonymousSession.customFields,
        });

        // Delete anonymous session
        await this.deleteAnonymous(anonymousSessionId);

        return authenticatedSession;
    }
}
