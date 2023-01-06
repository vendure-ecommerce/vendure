import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationCreateVendorArgs,
    MutationDeleteVendorArgs,
    MutationUpdateVendorArgs,
    Permission,
    QueryVendorArgs,
    QueryVendorsArgs,
    VendorList,
} from '@vendure/common/lib/generated-types';

import { Vendor } from '../../../entity/vendor/vendor.entity';
import { VendorService } from '../../../service/services/vendor.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('Vendor')
export class VendorResolver {
    constructor(private vendorService: VendorService) {}

    @Query()
    @Allow(Permission.ReadSettings, Permission.ReadVendor, Permission.ReadAsset)
    async vendors(@Ctx() ctx: RequestContext, @Args() args: QueryVendorsArgs): Promise<VendorList> {
        return this.vendorService.findAll(ctx, args.options);
    }

    @Query()
    @Allow(Permission.ReadSettings, Permission.ReadVendor, Permission.ReadAsset)
    async vendor(@Ctx() ctx: RequestContext, @Args() args: QueryVendorArgs): Promise<Vendor | undefined> {
        return this.vendorService.findOne(ctx, args.id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateSettings, Permission.CreateVendor)
    async createVendor(@Ctx() ctx: RequestContext, @Args() args: MutationCreateVendorArgs): Promise<Vendor> {
        return this.vendorService.create(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateSettings, Permission.UpdateVendor)
    async updateVendor(@Ctx() ctx: RequestContext, @Args() args: MutationUpdateVendorArgs): Promise<Vendor> {
        return this.vendorService.update(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteSettings, Permission.DeleteVendor)
    async deleteVendor(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteVendorArgs,
    ): Promise<DeletionResponse> {
        return this.vendorService.delete(ctx, args.id);
    }
}
