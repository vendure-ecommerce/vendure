import { Column, Entity } from 'typeorm';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Permission } from '@vendure/common/lib/generated-types';

import { VendureEntity } from '..';

/**
 * @description
 * Stores plugin-defined key-value config entries, with associated CRUD permissions.
 *
 * @docsCategory entities
 */
@Entity()
export class Config extends VendureEntity {
    constructor(input?: DeepPartial<Config>) {
        super(input);
    }

    /**
     * The unique key identifying this config entry.
     */
    @Column({ unique: true })
    key: string;

    /**
     * The plugin which registered this config entry.
     */
    @Column()
    plugin: string;

    /**
     * The JSON-stringified value of this config entry.
     */
    @Column('text')
    value: string;

    /**
     * Permissions required to create this config entry.
     */
    @Column('simple-array')
    createPermissions: Permission[];

    /**
     * Permissions required to read this config entry.
     */
    @Column('simple-array')
    readPermissions: Permission[];

    /**
     * Permissions required to update this config entry.
     */
    @Column('simple-array')
    updatePermissions: Permission[];

    /**
     * Permissions required to delete this config entry.
     */
    @Column('simple-array')
    deletePermissions: Permission[];
}