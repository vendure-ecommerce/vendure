import { bootstrapWorker, Logger, ProductService, RequestContextService } from '@vendure/core';

import { devConfig } from './dev-config';

if (require.main === module) {
    getProductCount()
        .then(() => process.exit(0))
        .catch(err => {
            Logger.error(err);
            process.exit(1);
        });
}

async function getProductCount() {
    // This will bootstrap an instance of the Vendure Worker, providing
    // us access to all of the services defined in the Vendure core.
    const { app } = await bootstrapWorker(devConfig);

    // Using `app.get()` we can grab an instance of _any_ provider defined in the
    // Vendure core as well as by our plugins.
    const productService = app.get(ProductService);

    // For most service methods, we'll need to pass a RequestContext object.
    // We can use the RequestContextService to create one.
    const ctx = await app.get(RequestContextService).create({
        apiType: 'admin',
    });

    // We use the `findAll()` method to get the total count. Since we aren't
    // interested in the actual product objects, we can set the `take` option to 0.
    const { totalItems } = await productService.findAll(ctx, { take: 0 });

    Logger.info(
        [
            '\n-----------------------------------------',
            `There are ${totalItems} products in the database`,
            '-----------------------------------------',
        ].join('\n'),
    );
}
