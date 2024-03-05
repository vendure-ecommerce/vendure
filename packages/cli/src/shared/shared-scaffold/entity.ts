export function renderEntity<T extends { entity: { className: string } }>(context: T): string {
    return /* language=TypeScript */ `
import { Entity, Column } from 'typeorm';
import { VendureEntity, DeepPartial, HasCustomFields } from '@vendure/core';

export class ${context.entity.className}CustomFields {}

@Entity()
export class ${context.entity.className} extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<${context.entity.className}>) {
        super(input);
    }

    @Column()
    name: string;
    
    @Column(type => ${context.entity.className}CustomFields)
    customFields: ${context.entity.className}CustomFields;
}
`;
}
