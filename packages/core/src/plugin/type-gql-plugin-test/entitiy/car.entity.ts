// product-review.entity.ts
import { Field, ID as GID, ObjectType } from '@nestjs/graphql';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity } from 'typeorm';

import { BaseNode } from './node.entity';

@Entity()
@ObjectType()
class Car extends BaseNode {
    constructor(input: DeepPartial<Car>) {
        super(input);
    }

    @Field()
    @Column('text')
    brand: string;

    @Field()
    @Column()
    model: number;
}

export default Car;
