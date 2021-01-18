import { Injectable } from '@nestjs/common';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

import { RequestContext } from '../../api/common/request-context';
import { Taggable } from '../../common/types/common-types';
import { VendureEntity } from '../../entity/base/base.entity';
import { Tag } from '../../entity/tag/tag.entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

@Injectable()
export class TagService {
    constructor(private connection: TransactionalConnection) {}

    async valuesToTags(ctx: RequestContext, values: string[]): Promise<Tag[]> {
        const tags: Tag[] = [];
        for (const value of unique(values)) {
            tags.push(await this.tagValueToTag(ctx, value));
        }
        return tags;
    }

    getTagsForEntity(ctx: RequestContext, entity: Type<VendureEntity & Taggable>, id: ID): Promise<Tag[]> {
        return this.connection
            .getRepository(ctx, entity)
            .createQueryBuilder()
            .relation(entity, 'tags')
            .of(id)
            .loadMany();
    }

    private async tagValueToTag(ctx: RequestContext, value: string): Promise<Tag> {
        const existing = await this.connection.getRepository(ctx, Tag).findOne({ where: { value } });
        if (existing) {
            return existing;
        }
        return await this.connection.getRepository(ctx, Tag).save(new Tag({ value }));
    }
}
