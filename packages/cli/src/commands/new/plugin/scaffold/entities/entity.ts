import { TemplateContext } from '../../types';

export function renderEntity(context: TemplateContext): string {
    return /* language=TypeScript */ `
import { Entity, Column } from 'typeorm';
import { VendureEntity, DeepPartial } from '@vendure/core';

@Entity()
export class ${context.entity.className} extends VendureEntity {
    constructor(input?: DeepPartial<${context.entity.className}>) {
        super(input);
    }

    @Column()
    name: string;
}
`;
}
