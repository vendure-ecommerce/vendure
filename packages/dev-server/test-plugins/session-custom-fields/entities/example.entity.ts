import { DeepPartial, VendureEntity } from '@vendure/core';
import { Column, Entity } from 'typeorm';

@Entity()
export class SessionCustomFieldsTestEntity extends VendureEntity {
    constructor(input?: DeepPartial<SessionCustomFieldsTestEntity>) {
        super(input);
    }

    @Column()
    code: string;
}