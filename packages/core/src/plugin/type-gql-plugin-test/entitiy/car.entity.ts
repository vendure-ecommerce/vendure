// product-review.entity.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity } from 'typeorm';

import { VendureEntity } from '../../../entity/base/base.entity';

@Entity()
@ObjectType()
class Car extends VendureEntity {
    constructor(input: DeepPartial<Car>) {
        super(input);
    }

    @Column()
    @Field()
    brand: string;

    @Column()
    @Field()
    model: number;
}

export default Car;
