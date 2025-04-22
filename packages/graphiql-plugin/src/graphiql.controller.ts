import { Controller, Get, Inject, Param, Res, UseGuards } from '@nestjs/common';
import { Logger } from '@vendure/core';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';

import { PLUGIN_INIT_OPTIONS, loggerCtx } from './constants';
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

    /**
     * Serve static assets from the dist folder
     */
    @Get('assets/*path')
    serveAssets(@Param('path') assetPath: string, @Res() res: Response) {
        try {
            const filePath = join(this.distDir, 'assets', assetPath.toString());

            if (fs.existsSync(filePath)) {
                return res.sendFile(filePath);
            } else {
                return res.status(404).send('Asset not found');
            }
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            Logger.error(`Error serving static asset: ${errorMessage}`, loggerCtx);
            return res.status(500).send('An error occurred while serving static asset');
        }
    }
}
