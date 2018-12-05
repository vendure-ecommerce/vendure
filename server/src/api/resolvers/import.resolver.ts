import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ImportInfo, ImportProductsMutationArgs, Permission } from 'shared/generated-types';

import {
    ImportParser,
    ParsedProductWithVariants,
} from '../../data-import/providers/import-parser/import-parser';
import { Importer } from '../../data-import/providers/importer/importer';
import { RequestContext } from '../common/request-context';
import { Allow } from '../decorators/allow.decorator';
import { Ctx } from '../decorators/request-context.decorator';

@Resolver('Import')
export class ImportResolver {
    constructor(private importParser: ImportParser, private importer: Importer) {}

    @Mutation()
    @Allow(Permission.SuperAdmin)
    async importProducts(
        @Ctx() ctx: RequestContext,
        @Args() args: ImportProductsMutationArgs,
    ): Promise<ImportInfo> {
        const { stream, filename, mimetype, encoding } = await args.csvFile;
        let parsed: ParsedProductWithVariants[];
        try {
            parsed = await this.importParser.parseProducts(stream);
        } catch (err) {
            return {
                errors: [err.message],
                importedCount: 0,
            };
        }

        if (parsed) {
            const result = await this.importer.importProducts(ctx, parsed);
            return {
                errors: [],
                importedCount: parsed.length,
            };
        } else {
            return {
                errors: ['nothing to parse!'],
                importedCount: 0,
            };
        }
    }
}
