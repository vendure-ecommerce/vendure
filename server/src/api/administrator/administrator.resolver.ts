import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { Administrator } from '../../entity/administrator/administrator.entity';
import { AdministratorService } from '../../service/administrator.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';

@Resolver('Administrator')
export class AdministratorResolver {
    constructor(private administratorService: AdministratorService) {}

    @Query('administrators')
    @ApplyIdCodec()
    administrators(): Promise<Administrator[]> {
        return this.administratorService.findAll();
    }

    @Query('administrator')
    @ApplyIdCodec()
    administrator(obj, args): Promise<Administrator | undefined> {
        return this.administratorService.findOne(args.id);
    }

    @Mutation()
    @ApplyIdCodec()
    createAdministrator(_, args): Promise<Administrator> {
        const { input } = args;
        return this.administratorService.create(input);
    }
}
