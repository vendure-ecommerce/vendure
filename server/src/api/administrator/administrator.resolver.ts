import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { Administrator } from '../../entity/administrator/administrator.entity';
import { Permission } from '../../entity/role/permission';
import { AdministratorService } from '../../service/administrator.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';
import { RolesGuard } from '../roles-guard';

@Resolver('Administrator')
export class AdministratorResolver {
    constructor(private administratorService: AdministratorService) {}

    @Query()
    @RolesGuard([Permission.ReadAdministrator])
    @ApplyIdCodec()
    administrators(): Promise<Administrator[]> {
        return this.administratorService.findAll();
    }

    @Query()
    @RolesGuard([Permission.ReadAdministrator])
    @ApplyIdCodec()
    administrator(obj, args): Promise<Administrator | undefined> {
        return this.administratorService.findOne(args.id);
    }

    @Mutation()
    @RolesGuard([Permission.CreateAdministrator])
    @ApplyIdCodec()
    createAdministrator(_, args): Promise<Administrator> {
        const { input } = args;
        return this.administratorService.create(input);
    }
}
