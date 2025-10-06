import { Button, defineDashboardExtension } from '@vendure/dashboard';
import { useState } from 'react';

defineDashboardExtension({
    pageBlocks: [
        // Here's an example of a page block extension. If you visit a product detail page,
        // you should see the block in action.
        {
            id: 'example-page-block',
            location: {
                pageId: 'product-detail',
                position: {
                    blockId: 'product-variants-table',
                    order: 'after',
                },
                column: 'main',
            },
            component: () => {
                const [count, setCount] = useState(0);
                return (
                    <div>
                        <p>This is an example custom component.</p>
                        <p className="text-muted-foreground mb-4">
                            As is traditional, let's include counter functionality:
                        </p>
                        <Button variant="secondary" onClick={() => setCount(c => c + 1)}>
                            Clicked {count} times
                        </Button>
                    </div>
                );
            },
        },
    ],
    // The following extension points are only listed here
    // to give you an idea of all the ways that the Dashboard
    // can be extended. Feel free to delete any that you don't need.
    routes: [],
    navSections: [],
    actionBarItems: [],
    alerts: [],
    widgets: [],
    customFormComponents: {},
    dataTables: [],
    detailForms: [],
    login: {},
    historyEntries: [],
});
