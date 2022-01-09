import { Field, ID as GID, ObjectType } from '@nestjs/graphql';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';

import { VendureEntity } from '../../../entity/base/base.entity';

@ObjectType()
export class BaseNode extends VendureEntity {
    constructor(input: DeepPartial<BaseNode>) {
        super(input);
    }

    @Field(() => GID)
    id: ID;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
