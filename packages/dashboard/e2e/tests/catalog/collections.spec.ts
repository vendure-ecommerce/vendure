import { expect } from '@playwright/test';

import { createCrudTestSuite } from '../../utils/crud-test-factory.js';

createCrudTestSuite({
    entityName: 'collection',
    entityNamePlural: 'collections',
    listPath: '/collections',
    listTitle: 'Collections',
    newButtonLabel: 'New Collection',
    newPageTitle: 'New collection',
    createFields: [{ label: 'Name', value: 'E2E Test Collection' }],
    afterFillCreate: async (_page, detail) => {
        await expect(detail.formItem('Slug').getByRole('textbox')).not.toHaveValue('', { timeout: 5_000 });
    },
});
