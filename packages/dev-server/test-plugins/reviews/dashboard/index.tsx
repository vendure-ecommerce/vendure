import { Button, DataTableBulkActionItem, defineDashboardExtension } from '@vendure/dashboard';
import { InfoIcon } from 'lucide-react';
import { toast } from 'sonner';

import { TextareaCustomField } from './custom-form-components';
import { CustomWidget } from './custom-widget';
import { reviewDetail } from './review-detail';
import { reviewList } from './review-list';

export default defineDashboardExtension({
    routes: [reviewList, reviewDetail],
    widgets: [
        {
            id: 'custom-widget',
            name: 'Custom Widget',
            component: CustomWidget,
            defaultSize: { w: 3, h: 3 },
        },
    ],
    actionBarItems: [
        {
            label: 'Custom Action Bar Item',
            component: props => {
                return (
                    <Button
                        type="button"
                        onClick={() => {
                            console.log('Clicked custom action bar item');
                        }}
                    >
                        Test Button
                    </Button>
                );
            },
            locationId: 'product-detail',
        },
    ],
    pageBlocks: [
        {
            id: 'my-block',
            component: ({ context }) => {
                return <div>Here is my custom block!</div>;
            },
            title: 'My Custom Block',
            location: {
                pageId: 'product-detail',
                column: 'side',
                position: { blockId: 'main-form', order: 'after' },
            },
        },
    ],
    customFormComponents: [
        {
            id: 'textarea',
            component: TextareaCustomField,
        },
    ],
    dataTables: [
        {
            pageId: 'product-list',
            bulkActions: [
                {
                    component: props => (
                        <DataTableBulkActionItem
                            onClick={() => {
                                console.log('Selection:', props.selection);
                                toast.message(`There are ${props.selection.length} selected items`);
                            }}
                            label="My Custom Action"
                            icon={InfoIcon}
                        />
                    ),
                },
            ],
            extendListDocument: `
                query {
                    products {
                        items {
                            customFields {
                                featuredReview {
                                    id
                                    productVariant {
                                        id
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            `,
        },
    ],
});
