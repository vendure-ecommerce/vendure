/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

const icon = {
    bolt: `<path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />`,
    angleBrackets: `<path fill-rule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.377 2.011a.75.75 0 01.612.867l-2.5 14.5a.75.75 0 01-1.478-.255l2.5-14.5a.75.75 0 01.866-.612z" clip-rule="evenodd" />`,
    puzzle: `<path d="M12 4.467c0-.405.262-.75.559-1.027.276-.257.441-.584.441-.94 0-.828-.895-1.5-2-1.5s-2 .672-2 1.5c0 .362.171.694.456.953.29.265.544.6.544.994a.968.968 0 01-1.024.974 39.655 39.655 0 01-3.014-.306.75.75 0 00-.847.847c.14.993.242 1.999.306 3.014A.968.968 0 014.447 10c-.393 0-.729-.253-.994-.544C3.194 9.17 2.862 9 2.5 9 1.672 9 1 9.895 1 11s.672 2 1.5 2c.356 0 .683-.165.94-.441.276-.297.622-.559 1.027-.559a.997.997 0 011.004 1.03 39.747 39.747 0 01-.319 3.734.75.75 0 00.64.842c1.05.146 2.111.252 3.184.318A.97.97 0 0010 16.948c0-.394-.254-.73-.545-.995C9.171 15.693 9 15.362 9 15c0-.828.895-1.5 2-1.5s2 .672 2 1.5c0 .356-.165.683-.441.94-.297.276-.559.622-.559 1.027a.998.998 0 001.03 1.005c1.337-.05 2.659-.162 3.961-.337a.75.75 0 00.644-.644c.175-1.302.288-2.624.337-3.961A.998.998 0 0016.967 12c-.405 0-.75.262-1.027.559-.257.276-.584.441-.94.441-.828 0-1.5-.895-1.5-2s.672-2 1.5-2c.362 0 .694.17.953.455.265.291.601.545.995.545a.97.97 0 00.976-1.024 41.159 41.159 0 00-.318-3.184.75.75 0 00-.842-.64c-1.228.164-2.473.271-3.734.319A.997.997 0 0112 4.467z" />`,
    book: `<path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11a.75.75 0 00.954.721A7.506 7.506 0 015 15.5c1.579 0 3.042.487 4.25 1.32V4.065z" />`,
    computer: `<path fill-rule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z" clip-rule="evenodd" />`,
    shoppingBag: `<path fill-rule="evenodd" d="M6 5v1H4.667a1.75 1.75 0 00-1.743 1.598l-.826 9.5A1.75 1.75 0 003.84 19H16.16a1.75 1.75 0 001.743-1.902l-.826-9.5A1.75 1.75 0 0015.333 6H14V5a4 4 0 00-8 0zm4-2.5A2.5 2.5 0 007.5 5v1h5V5A2.5 2.5 0 0010 2.5zM7.5 10a2.5 2.5 0 005 0V8.75a.75.75 0 011.5 0V10a4 4 0 01-8 0V8.75a.75.75 0 011.5 0V10z" clip-rule="evenodd" />`,
    academicCap: `<path fill-rule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 101.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 013.095 2.348.75.75 0 00.992 0 26.547 26.547 0 015.93-3.95.75.75 0 00.42-.739 41.053 41.053 0 00-.39-3.114 29.925 29.925 0 00-5.199 2.801 2.25 2.25 0 01-2.514 0c-.41-.275-.826-.541-1.25-.797a6.985 6.985 0 01-1.084 3.45 26.503 26.503 0 00-1.281-.78A5.487 5.487 0 006 12v-.54z" clip-rule="evenodd" />`,
    cloudArrowUp: `<path fill-rule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clip-rule="evenodd" />`,
    tsLogo: `<rect fill="#3178c6" height="128" rx="6" width="128"></rect><path clip-rule="evenodd" d="m74.2622 99.468v14.026c2.2724 1.168 4.9598 2.045 8.0625 2.629 3.1027.585 6.3728.877 9.8105.877 3.3503 0 6.533-.321 9.5478-.964 3.016-.643 5.659-1.702 7.932-3.178 2.272-1.476 4.071-3.404 5.397-5.786 1.325-2.381 1.988-5.325 1.988-8.8313 0-2.5421-.379-4.7701-1.136-6.6841-.758-1.9139-1.85-3.6159-3.278-5.1062-1.427-1.4902-3.139-2.827-5.134-4.0104-1.996-1.1834-4.246-2.3011-6.752-3.353-1.8352-.7597-3.4812-1.4975-4.9378-2.2134-1.4567-.7159-2.6948-1.4464-3.7144-2.1915-1.0197-.7452-1.8063-1.5341-2.3598-2.3669-.5535-.8327-.8303-1.7751-.8303-2.827 0-.9643.2476-1.8336.7429-2.6079s1.1945-1.4391 2.0976-1.9943c.9031-.5551 2.0101-.9861 3.3211-1.2929 1.311-.3069 2.7676-.4603 4.3699-.4603 1.1658 0 2.3958.0877 3.6928.263 1.296.1753 2.6.4456 3.911.8109 1.311.3652 2.585.8254 3.824 1.3806 1.238.5552 2.381 1.198 3.43 1.9285v-13.1051c-2.127-.8182-4.45-1.4245-6.97-1.819s-5.411-.5917-8.6744-.5917c-3.3211 0-6.4674.3579-9.439 1.0738-2.9715.7159-5.5862 1.8336-7.844 3.353-2.2578 1.5195-4.0422 3.4553-5.3531 5.8075-1.311 2.3522-1.9665 5.1646-1.9665 8.4373 0 4.1785 1.2017 7.7433 3.6052 10.6945 2.4035 2.9513 6.0523 5.4496 10.9466 7.495 1.9228.7889 3.7145 1.5633 5.375 2.323 1.6606.7597 3.0954 1.5486 4.3044 2.3668s2.1628 1.7094 2.8618 2.6736c.7.9643 1.049 2.06 1.049 3.2873 0 .9062-.218 1.7462-.655 2.5202s-1.1 1.446-1.9885 2.016c-.8886.57-1.9956 1.016-3.3212 1.337-1.3255.321-2.8768.482-4.6539.482-3.0299 0-6.0305-.533-9.0021-1.6-2.9715-1.066-5.7245-2.666-8.2591-4.799zm-23.5596-34.9136h18.2974v-11.5544h-51v11.5544h18.2079v51.4456h14.4947z" fill="#fff" fill-rule="evenodd"></path>`,
    graphqlLogo: `<path fill-rule="evenodd" fill="#e10098" clip-rule="evenodd" d="M50 6.90308L87.323 28.4515V71.5484L50 93.0968L12.677 71.5484V28.4515L50 6.90308ZM16.8647 30.8693V62.5251L44.2795 15.0414L16.8647 30.8693ZM50 13.5086L18.3975 68.2457H81.6025L50 13.5086ZM77.4148 72.4334H22.5852L50 88.2613L77.4148 72.4334ZM83.1353 62.5251L55.7205 15.0414L83.1353 30.8693V62.5251Z"></path><circle fill="#e10098"  cx="50" cy="9.3209" r="8.82"></circle><circle fill="#e10098"  cx="85.2292" cy="29.6605" r="8.82"></circle><circle fill="#e10098"  cx="85.2292" cy="70.3396" r="8.82"></circle><circle fill="#e10098"  cx="50" cy="90.6791" r="8.82"></circle><circle fill="#e10098"  cx="14.7659" cy="70.3396" r="8.82"></circle><circle fill="#e10098"  cx="14.7659" cy="29.6605" r="8.82"></circle>`,
};

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    // By default, Docusaurus generates a sidebar from the docs folder structure
    learnSidebar: [
        {
            type: 'category',
            label: 'Getting Started',
            items: [
                'guides/getting-started/installation/index',
                'guides/getting-started/graphql-intro/index',
                'guides/getting-started/try-the-api/index',
            ],
            customProps: {
                icon: icon.bolt,
            },
        },
        {
            type: 'category',
            label: 'Core Concepts',
            items: [{ type: 'autogenerated', dirName: 'guides/core-concepts' }],
            customProps: {
                icon: icon.puzzle,
            },
        },
        {
            type: 'category',
            label: 'Developer Guide',
            items: [
                {
                    type: 'html',
                    value: 'Overview',
                    className: 'sidebar-section-header',
                },
                'guides/developer-guide/overview/index',
                'guides/developer-guide/the-api-layer/index',
                'guides/developer-guide/the-service-layer/index',
                {
                    type: 'html',
                    value: 'Fundamentals',
                    className: 'sidebar-section-header',
                },
                'guides/developer-guide/cli/index',
                'guides/developer-guide/configuration/index',
                'guides/developer-guide/custom-fields/index',
                'guides/developer-guide/error-handling/index',
                'guides/developer-guide/events/index',
                'guides/developer-guide/migrations/index',
                'guides/developer-guide/plugins/index',
                'guides/developer-guide/strategies-configurable-operations/index',
                'guides/developer-guide/testing/index',
                'guides/developer-guide/updating/index',
                'guides/developer-guide/worker-job-queue/index',
                {
                    type: 'html',
                    value: 'Extend',
                    className: 'sidebar-section-header',
                },
                'guides/developer-guide/rest-endpoint/index',
                'guides/developer-guide/custom-permissions/index',
                'guides/developer-guide/database-entity/index',
                'guides/developer-guide/extend-graphql-api/index',
                {
                    type: 'html',
                    value: 'Advanced Topics',
                    className: 'sidebar-section-header',
                },
                'guides/developer-guide/db-subscribers/index',
                'guides/developer-guide/importing-data/index',
                'guides/developer-guide/logging/index',
                {
                    type: 'category',
                    label: 'Migrating from v1',
                    items: [{ type: 'autogenerated', dirName: 'guides/developer-guide/migrating-from-v1' }],
                },
                'guides/developer-guide/stand-alone-scripts/index',
                'guides/developer-guide/translations/index',
                'guides/developer-guide/uploading-files/index',
                'guides/developer-guide/nest-devtools/index',
            ],
            customProps: {
                icon: icon.angleBrackets,
            },
        },
        {
            type: 'category',
            label: 'How-to Guides',
            items: [{ type: 'autogenerated', dirName: 'guides/how-to' }],
            customProps: {
                icon: icon.book,
            },
        },
        {
            type: 'category',
            label: 'Extending the Admin UI',
            customProps: {
                icon: icon.computer,
            },
            items: [
                'guides/extending-the-admin-ui/getting-started/index',
                'guides/extending-the-admin-ui/ui-library/index',
                'guides/extending-the-admin-ui/admin-ui-theming-branding/index',
                'guides/extending-the-admin-ui/adding-ui-translations/index',
                'guides/extending-the-admin-ui/using-other-frameworks/index',
                {
                    type: 'html',
                    value: 'Providers',
                    className: 'sidebar-section-header',
                },
                'guides/extending-the-admin-ui/nav-menu/index',
                'guides/extending-the-admin-ui/alerts/index',
                'guides/extending-the-admin-ui/add-actions-to-pages/index',
                'guides/extending-the-admin-ui/page-tabs/index',
                'guides/extending-the-admin-ui/custom-form-inputs/index',
                'guides/extending-the-admin-ui/custom-data-table-components/index',
                'guides/extending-the-admin-ui/custom-detail-components/index',
                'guides/extending-the-admin-ui/bulk-actions/index',
                'guides/extending-the-admin-ui/dashboard-widgets/index',
                'guides/extending-the-admin-ui/custom-timeline-components/index',
                {
                    type: 'html',
                    value: 'Routes',
                    className: 'sidebar-section-header',
                },
                'guides/extending-the-admin-ui/defining-routes/index',
                'guides/extending-the-admin-ui/creating-list-views/index',
                'guides/extending-the-admin-ui/creating-detail-views/index',
            ],
        },
        {
            type: 'category',
            label: 'Building a Storefront',
            customProps: {
                icon: icon.shoppingBag,
            },
            items: [
                'guides/storefront/storefront-starters/index',
                'guides/storefront/connect-api/index',
                'guides/storefront/codegen/index',
                {
                    type: 'html',
                    value: 'Storefront Tasks',
                    className: 'sidebar-section-header',
                },
                'guides/storefront/navigation-menu/index',
                'guides/storefront/listing-products/index',
                'guides/storefront/product-detail/index',
                'guides/storefront/active-order/index',
                'guides/storefront/checkout-flow/index',
                'guides/storefront/customer-accounts/index',
            ],
        },
        {
            type: 'category',
            label: 'Deployment',
            customProps: {
                icon: icon.cloudArrowUp,
            },
            items: [
                'guides/deployment/production-configuration/index',
                'guides/deployment/using-docker',
                'guides/deployment/horizontal-scaling',
                'guides/deployment/getting-data-into-production',
                'guides/deployment/server-resource-requirements',
                'guides/deployment/deploying-admin-ui',
                {
                    type: 'html',
                    value: 'Deployment Guides',
                    className: 'sidebar-section-header',
                },
                'guides/deployment/deploy-to-northflank/index',
                'guides/deployment/deploy-to-digital-ocean-app-platform/index',
                'guides/deployment/deploy-to-railway/index',
                'guides/deployment/deploy-to-render/index',
                'guides/deployment/deploy-to-google-cloud-run/index',
            ],
        },
    ],
    referenceSidebar: [
        {
            type: 'doc',
            id: 'reference/index',
            className: 'reference-index',
            customProps: {
                icon: icon.book,
            },
        },
        {
            type: 'category',
            label: 'TypeScript API',
            items: [{ type: 'autogenerated', dirName: 'reference/typescript-api' }],
            customProps: {
                viewBox: '0 0 128 128',
                icon: icon.tsLogo,
            },
        },
        {
            type: 'category',
            label: 'Core Plugins',
            link: { type: 'doc', id: 'reference/core-plugins/index' },
            customProps: {
                viewBox: '0 0 128 128',
                icon: icon.tsLogo,
            },
            items: [
                {
                    type: 'category',
                    label: 'AdminUiPlugin',
                    link: { type: 'doc', id: 'reference/core-plugins/admin-ui-plugin/index' },
                    items: [{ type: 'autogenerated', dirName: 'reference/core-plugins/admin-ui-plugin' }],
                },
                {
                    type: 'category',
                    label: 'AssetServerPlugin',
                    link: { type: 'doc', id: 'reference/core-plugins/asset-server-plugin/index' },
                    items: [{ type: 'autogenerated', dirName: 'reference/core-plugins/asset-server-plugin' }],
                },
                {
                    type: 'category',
                    label: 'ElasticsearchPlugin',
                    link: { type: 'doc', id: 'reference/core-plugins/elasticsearch-plugin/index' },
                    items: [
                        { type: 'autogenerated', dirName: 'reference/core-plugins/elasticsearch-plugin' },
                    ],
                },
                {
                    type: 'category',
                    label: 'EmailPlugin',
                    link: { type: 'doc', id: 'reference/core-plugins/email-plugin/index' },
                    items: [{ type: 'autogenerated', dirName: 'reference/core-plugins/email-plugin' }],
                },
                {
                    type: 'category',
                    label: 'HardenPlugin',
                    link: { type: 'doc', id: 'reference/core-plugins/harden-plugin/index' },
                    items: [{ type: 'autogenerated', dirName: 'reference/core-plugins/harden-plugin' }],
                },
                {
                    type: 'category',
                    label: 'JobQueuePlugin',
                    link: { type: 'doc', id: 'reference/core-plugins/job-queue-plugin/index' },
                    items: [{ type: 'autogenerated', dirName: 'reference/core-plugins/job-queue-plugin' }],
                },
                {
                    type: 'category',
                    label: 'PaymentsPlugin',
                    link: { type: 'doc', id: 'reference/core-plugins/payments-plugin/index' },
                    items: [{ type: 'autogenerated', dirName: 'reference/core-plugins/payments-plugin' }],
                },
                {
                    type: 'category',
                    label: 'SentryPlugin',
                    link: { type: 'doc', id: 'reference/core-plugins/sentry-plugin/index' },
                    items: [{ type: 'autogenerated', dirName: 'reference/core-plugins/sentry-plugin' }],
                },
                {
                    type: 'category',
                    label: 'StellatePlugin',
                    link: { type: 'doc', id: 'reference/core-plugins/stellate-plugin/index' },
                    items: [{ type: 'autogenerated', dirName: 'reference/core-plugins/stellate-plugin' }],
                },
            ],
        },
        {
            type: 'category',
            label: 'GraphQL API',
            items: [
                {
                    type: 'category',
                    label: 'Admin API',
                    items: [{ type: 'autogenerated', dirName: 'reference/graphql-api/admin' }],
                },
                {
                    type: 'category',
                    label: 'Shop API',
                    items: [{ type: 'autogenerated', dirName: 'reference/graphql-api/shop' }],
                },
            ],
            customProps: {
                viewBox: '0 0 100 100',
                icon: icon.graphqlLogo,
            },
        },
        {
            type: 'category',
            label: 'Admin UI API',
            items: [{ type: 'autogenerated', dirName: 'reference/admin-ui-api' }],
            customProps: {
                icon: icon.computer,
            },
        },
    ],
};

module.exports = sidebars;
