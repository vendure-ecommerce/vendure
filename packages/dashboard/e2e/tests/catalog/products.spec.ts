import { expect } from '@playwright/test';

import { createCrudTestSuite } from '../../utils/crud-test-factory.js';

createCrudTestSuite({
    entityName: 'product',
    entityNamePlural: 'products',
    listPath: '/products',
    listTitle: 'Products',
    newButtonLabel: 'New Product',
    newPageTitle: 'New product',
    createFields: [{ label: 'Product name', value: 'E2E Test Product' }],
    afterFillCreate: async (_page, detail) => {
        await expect(detail.formItem('Slug').getByRole('textbox')).not.toHaveValue('', { timeout: 5_000 });
    },
});
