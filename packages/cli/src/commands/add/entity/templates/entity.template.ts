import { VendureEntity, DeepPartial, HasCustomFields } from '@vendure/core';
import { Entity, Column } from 'typeorm';

export class ScaffoldEntityCustomFields {}

@Entity()
export class ScaffoldEntity extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<ScaffoldEntity>) {
        super(input);
    }

    @Column()
    name: string;

    @Column(type => ScaffoldEntityCustomFields)
    customFields: ScaffoldEntityCustomFields;
}
