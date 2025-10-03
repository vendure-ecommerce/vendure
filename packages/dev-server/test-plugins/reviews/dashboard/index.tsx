import {
    Button,
    DataTableBulkActionItem,
    defineDashboardExtension,
    LogoMark,
    usePage,
} from '@vendure/dashboard';
import { InfoIcon } from 'lucide-react';
import { toast } from 'sonner';

import {
    BodyInputComponent,
    ResponseDisplay,
    ReviewMultiSelect,
    ReviewSingleSelect,
    ReviewStateSelect,
    TextareaCustomField,
} from './custom-form-components';
import { CustomWidget } from './custom-widget';
import { reviewDetail } from './review-detail';
import { reviewList } from './review-list';

defineDashboardExtension({
    login: {
        logo: {
            component: () => (
                <div className="text-red-500 italic">
                    <LogoMark className="text-red-500 h-6 w-auto" />
                </div>
            ),
        },
        afterForm: {
            component: () => (
                <div>
                    <Button variant="secondary" className="w-full">
                        Login with Vendure ID
                    </Button>
                </div>
            ),
        },
        loginImage: {
            component: () => (
                <div className="h-full w-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold">
                    Custom Login Image
                </div>
            ),
        },
    },
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
            pageId: 'product-detail',
            component: props => {
                const page = usePage();
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
    customFormComponents: {
        customFields: [
            {
                id: 'textarea',
                component: TextareaCustomField,
            },
            {
                id: 'review-single-select',
                component: ReviewSingleSelect,
            },
            {
                id: 'review-multi-select',
                component: ReviewMultiSelect,
            },
        ],
    },
    detailForms: [
        {
            pageId: 'product-variant-detail',
            // extendDetailDocument: `
            //     query {
            //         productVariant(id: $id) {
            //             stockOnHand
            //             product {
            //               facetValues {
            //                 id
            //                 name
            //                 facet {
            //                 code
            //                 }
            //               }
            //               customFields {
            //                 featuredReview {
            //                     id
            //                     productVariant {
            //                         id
            //                         name
            //                     }
            //                     product {
            //                     name
            //                     }
            //                 }
            //               }
            //             }
            //         }
            //     }
            // `,
        },
        {
            pageId: 'review-detail',
            inputs: [
                {
                    blockId: 'main-form',
                    field: 'body',
                    component: BodyInputComponent,
                },
                {
                    blockId: 'main-form',
                    field: 'state',
                    component: ReviewStateSelect,
                },
                {
                    blockId: 'main-form',
                    field: 'response',
                    component: ResponseDisplay,
                },
            ],
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
            // extendListDocument: `
            //     query {
            //         products {
            //             items {
            //                 customFields {
            //                     featuredReview {
            //                         id
            //                         productVariant {
            //                             id
            //                             name
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // `,
        },
    ],
});
