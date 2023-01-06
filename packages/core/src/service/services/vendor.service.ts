import { Injectable } from '@nestjs/common';
import {
    CreateVendorInput,
    DeletionResponse,
    DeletionResult,
    UpdateVendorInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { ListQueryOptions } from '../../common/types/common-types';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Vendor } from '../../entity/vendor/vendor.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';

/**
 * @description
 * Contains methods relating to {@link Vendor} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class VendorService {
    constructor(private connection: TransactionalConnection, private listQueryBuilder: ListQueryBuilder) {}

    findAll(ctx: RequestContext, options?: ListQueryOptions<Vendor>): Promise<PaginatedList<Vendor>> {
        return this.listQueryBuilder
            .build(Vendor, options, { ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(ctx: RequestContext, vendorId: ID): Promise<Vendor | undefined> {
        return this.connection.getRepository(ctx, Vendor).findOne(vendorId);
    }

    create(ctx: RequestContext, input: CreateVendorInput) {
        return this.connection.getRepository(ctx, Vendor).save(new Vendor(input));
    }

    async update(ctx: RequestContext, input: UpdateVendorInput) {
        const vendor = await this.connection.getEntityOrThrow(ctx, Vendor, input.id);
        if (input.name) {
            vendor.name = input.name;
            await this.connection.getRepository(ctx, Vendor).save(vendor);
        }
        return vendor;
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const vendor = await this.connection.getEntityOrThrow(ctx, Vendor, id);
        await this.connection.getRepository(ctx, Vendor).remove(vendor);
        return {
            result: DeletionResult.DELETED,
        };
    }
}
