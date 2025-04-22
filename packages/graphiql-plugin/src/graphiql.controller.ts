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
     * Serves the Admin API GraphiQL UI
     */
    @Get('admin')
    serveAdminGraphiQL(@Res() res: Response) {
        try {
            const indexHtmlPath = join(this.distDir, 'index.html');

            if (fs.existsSync(indexHtmlPath)) {
                // Read the HTML file
                let html = fs.readFileSync(indexHtmlPath, 'utf-8');

                // Inject API URLs
                const adminApiUrl = this.graphiQLService.getAdminApiUrl();
                const shopApiUrl = this.graphiQLService.getShopApiUrl();

                html = html.replace(
                    '</head>',
                    `<script>
                        window.GRAPHIQL_SETTINGS = {
                            adminApiUrl: "${adminApiUrl}",
                            shopApiUrl: "${shopApiUrl}"
                        };
                    </script>
                    </head>`,
                );

                return res.send(html);
            }

            throw new Error(`GraphiQL Admin UI not found: ${indexHtmlPath}`);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            Logger.error(`Error serving Admin GraphiQL: ${errorMessage}`, loggerCtx);
            return res.status(500).send('An error occurred while rendering GraphiQL for Admin API');
        }
    }

    /**
     * Serves the Shop API GraphiQL UI
     */
    @Get('shop')
    serveShopGraphiQL(@Res() res: Response) {
        try {
            const indexHtmlPath = join(this.distDir, 'index.html');

            if (fs.existsSync(indexHtmlPath)) {
                // Read the HTML file
                let html = fs.readFileSync(indexHtmlPath, 'utf-8');

                // Inject API URLs
                const adminApiUrl = this.graphiQLService.getAdminApiUrl();
                const shopApiUrl = this.graphiQLService.getShopApiUrl();

                html = html.replace(
                    '</head>',
                    `<script>
                        window.GRAPHIQL_SETTINGS = {
                            adminApiUrl: "${adminApiUrl}",
                            shopApiUrl: "${shopApiUrl}"
                        };
                    </script>
                    </head>`,
                );

                return res.send(html);
            }

            throw new Error(`GraphiQL Shop UI not found: ${indexHtmlPath}`);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            Logger.error(`Error serving Shop GraphiQL: ${errorMessage}`, loggerCtx);
            return res.status(500).send('An error occurred while rendering GraphiQL for Shop API');
        }
    }

    /**
     * Redirect to the admin API GraphiQL by default
     */
    @Get()
    redirectToAdmin() {
        return `
            <html>
                <head>
                    <meta http-equiv="refresh" content="0;URL='graphiql/admin'" />
                </head>
                <body>
                    Redirecting to <a href="graphiql/admin">GraphiQL Admin API</a>...
                </body>
            </html>
        `;
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

    /**
     * Serve the favicon
     */
    @Get('favicon.svg')
    serveFavicon(@Res() res: Response) {
        try {
            const faviconPath = join(this.distDir, 'favicon.svg');

            if (fs.existsSync(faviconPath)) {
                return res.sendFile(faviconPath);
            } else {
                return res.status(404).send('Favicon not found');
            }
        } catch (e: unknown) {
            return res.status(404).end();
        }
    }
}
