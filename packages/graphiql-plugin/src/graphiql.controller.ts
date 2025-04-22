import { Controller, Inject } from '@nestjs/common';
import { join } from 'path';

import { PLUGIN_INIT_OPTIONS } from './constants';
import { GraphiQLService } from './graphiql.service';
import { GraphiQLPluginOptions } from './types';

/**
 * This controller handles the GraphiQL UI requests.
 */
@Controller('graphiql')
export class GraphiQLController {
    private distDir: string;

    constructor(
        private graphiQLService: GraphiQLService,
        @Inject(PLUGIN_INIT_OPTIONS) private options: GraphiQLPluginOptions,
    ) {
        this.distDir = join(__dirname, '../dist/graphiql');
    }
}
