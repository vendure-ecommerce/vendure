import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { User } from '../user/user.entity';

/**
 * Admin API key bound to an Administrator.
 * Hash at rest; raw secret is shown only once at creation/rotation.
 * @since 3.5.0
 */
@Entity()
export class ApiKey extends VendureEntity {
    constructor(input?: DeepPartial<ApiKey>) {
        super(input);
    }

    /**
     * User (Admin or Customer) who owns this key and whose Roles/Permissions/Channels are used.
     * @since 3.5.0
     */
    @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
    @Index()
    user: User;

    /** Human-readable label. @since 3.5.0 */
    @Column()
    name: string;

    /** Hash of the raw key (no plaintext stored). @since 3.5.0 */
    @Column()
    keyHash: string;

    /**
     * Stable lookup hash of the raw key, used for direct database lookup without iterating keys.
     * Typically a SHA-256 hex digest of the raw key, or as produced by the configured generation strategy.
     * @since 3.5.0
     */
    @Column({ unique: true })
    @Index({ unique: true })
    lookupHash: string;

    /** active|revoked status. @since 3.5.0 */
    @Column({ default: 'active' })
    @Index()
    status: 'active' | 'revoked';

    /** Expiry time (required). @since 3.5.0 */
    @Column({ type: Date, nullable: false })
    expiresAt: Date;

    /** Time of revocation. @since 3.5.0 */
    @Column({ type: Date, nullable: true })
    revokedAt: Date | null;

    /** Last successful use timestamp. @since 3.5.0 */
    @Column({ type: Date, nullable: true })
    lastUsedAt: Date | null;

    /** Algorithm/versioning marker. @since 3.5.0 */
    @Column({ default: 1 })
    version: number;

    /** Optional notes. @since 3.5.0 */
    @Column({ type: 'text', nullable: true })
    notes: string | null;

    /**
     * Scope indicates intended API surface. Currently 'admin' is used for Admin API keys.
     * 'shop' may be used for Shop API keys.
     * @since 3.5.0
     */
    @Column({ default: 'admin' })
    @Index()
    scope: 'admin' | 'shop';
}
