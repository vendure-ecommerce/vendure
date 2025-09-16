import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Administrator } from '../administrator/administrator.entity';
import { VendureEntity } from '../base/base.entity';

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
    /** Administrator whose Roles/Channels are inherited. @since 3.5.0 */
    @ManyToOne(() => Administrator, { onDelete: 'CASCADE', eager: true })
    @Index()
    administrator: Administrator;

    /** Key prefix (e.g., "vk_live_") for quick identification. @since 3.5.0 */
    @Column()
    @Index()
    prefix: string;

    /** Human-readable label. @since 3.5.0 */
    @Column()
    name: string;

    /** Hash of the raw key (no plaintext stored). @since 3.5.0 */
    @Column()
    keyHash: string;

    /** active|revoked status. @since 3.5.0 */
    @Column({ default: 'active' })
    @Index()
    status: 'active' | 'revoked';

    /** Optional expiry time. @since 3.5.0 */
    @Column({ type: Date, nullable: true })
    expiresAt: Date | null;

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
}
