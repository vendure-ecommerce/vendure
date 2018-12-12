import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { ImportInfo, ImportProductsMutationArgs, Permission } from '../../../../shared/generated-types';
import { Importer } from '../../data-import/providers/importer/importer';
import { RequestContext } from '../common/request-context';
import { Allow } from '../decorators/allow.decorator';
import { Ctx } from '../decorators/request-context.decorator';

@Resolver('Import')
export class ImportResolver {
    constructor(private importer: Importer) {}

    @Mutation()
    @Allow(Permission.SuperAdmin)
    async importProducts(
        @Ctx() ctx: RequestContext,
        @Args() args: ImportProductsMutationArgs,
    ): Promise<ImportInfo> {
        const { stream, filename, mimetype, encoding } = await args.csvFile;
        return this.importer.parseAndImport(stream, ctx).toPromise();
    }
}
