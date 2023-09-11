import { constantCase, pascalCase } from 'change-case';

import { TemplateContext } from '../types';

export function renderPlugin(context: TemplateContext) {
    const { pluginName, pluginInitOptionsName } = context;
    const optionalImports: string[] = [];
    const optionalMetadata: string[] = [];
    if (context.withCustomEntity) {
        optionalImports.push(
            `import { ${context.entity.className} } from './entities/${context.entity.fileName}';`,
        );
        optionalMetadata.push(`entities: [${context.entity.className}],`);
    } else {
        optionalMetadata.push(`entities: [],`);
    }
    if (context.withApiExtensions) {
        optionalImports.push(`import { shopApiExtensions, adminApiExtensions } from './api/api-extensions';`);
        optionalImports.push(`import { ShopResolver } from './api/shop.resolver';`);
        optionalImports.push(`import { AdminResolver } from './api/admin.resolver';`);
        optionalMetadata.push(`shopApiExtensions: { resolvers: [ShopResolver], schema: shopApiExtensions },`);
        optionalMetadata.push(
            `adminApiExtensions: { resolvers: [AdminResolver], schema: adminApiExtensions },`,
        );
    }

    return /* language=TypeScript */ `
import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';
import path from 'path';

import { ${context.service.className} } from './services/${context.service.fileName}';
import { ${pluginInitOptionsName} } from './constants';
import { PluginInitOptions } from './types';
${optionalImports.join('\n')}

@VendurePlugin({
    imports: [PluginCommonModule],
    ${optionalMetadata.join('\n    ')}
    providers: [
        ${context.service.className},
        { provide: ${pluginInitOptionsName}, useFactory: () => ${pluginName}.options },
    ],
    compatibility: '^2.0.0',
})
export class ${pluginName} {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<${pluginName}> {
        this.options = options;
        return ${pluginName};
    }
}
`;
}
