import { test } from '@playwright/test';

import { createCrudTestSuite } from '../../utils/crud-test-factory.js';

test.describe('Facets', () => {
    test.describe.configure({ mode: 'serial' });

    // The Code field uses a SlugInput that auto-generates from the Name,
    // so we only need to fill Name. Code will auto-populate.
    createCrudTestSuite({
        entityName: 'facet',
        entityNamePlural: 'facets',
        listPath: '/facets',
        listTitle: 'Facets',
        newButtonLabel: 'New Facet',
        newPageTitle: 'New facet',
        createFields: [{ label: 'Name', value: 'E2E Test Facet' }],
        updateFields: [{ label: 'Name', value: 'E2E Test Facet Updated' }],
        hasBulkDelete: true,
    });
});
