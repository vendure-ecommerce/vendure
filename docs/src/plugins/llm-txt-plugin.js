const path = require('path');
const fs = require('fs');

const DOCS_BASE_URL = process.env.DOCS_BASE_URL || 'https://docs.vendure.io';

module.exports = function (context) {
    return {
        name: 'llms-txt-plugin',
        loadContent: async () => {
            const { siteDir } = context;
            const contentDir = siteDir;
            const allMdx = [];

            console.log('contentDir', contentDir);

            // recursive function to get all mdx files
            const getMdxFiles = async dir => {
                const entries = await fs.promises.readdir(dir, { withFileTypes: true });

                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        await getMdxFiles(fullPath);
                    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
                        const content = await fs.promises.readFile(fullPath, 'utf8');
                        allMdx.push(content);
                    }
                }
            };

            await getMdxFiles(contentDir);
            return { allMdx };
        },
        postBuild: async ({ content, routes, outDir }) => {
            const { allMdx } = content;

            // Write concatenated MDX content
            const concatenatedPath = path.join(outDir, 'llms-full.txt');
            await fs.promises.writeFile(concatenatedPath, allMdx.join('\n\n---\n\n'));

            // we need to dig down several layers:
            // find PluginRouteConfig marked by plugin.name === "docusaurus-plugin-content-docs"
            const docsPluginRouteConfig = routes.filter(
                route => route.plugin.name === 'docusaurus-plugin-content-docs',
            )[0];

            // docsPluginRouteConfig has a routes property has a record with the path "/" that contains all docs routes.
            const allDocsRouteConfig = docsPluginRouteConfig.routes?.filter(route => route.path === '/')[0];

            // A little type checking first
            if (!allDocsRouteConfig?.props?.version) {
                return;
            }

            // this route config has a `props` property that contains the current documentation.
            const currentVersionDocsRoutes = allDocsRouteConfig.props.version.docs;

            console.log('currentVersionDocsRoutes', currentVersionDocsRoutes);

            // for every single docs route we now parse a path (which is the key) and a title
            const docsRecords = Object.entries(currentVersionDocsRoutes).map(([path, record]) => {
                return `- [${record.title}](${DOCS_BASE_URL}/${path}): ${record.description}`;
            });

            // Build up llms.txt file
            const llmsTxt = `# ${context.siteConfig.title}\n\n## Docs\n\n${docsRecords.join('\n')}`;

            // Write llms.txt file
            const llmsTxtPath = path.join(outDir, 'llms.txt');
            try {
                fs.writeFileSync(llmsTxtPath, llmsTxt);
            } catch (err) {
                throw err;
            }
        },
    };
};
