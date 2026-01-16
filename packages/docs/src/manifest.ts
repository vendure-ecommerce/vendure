import type { DocsPackageManifest } from '@vendure-io/docs-provider';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const file = (relativePath: string) => join(packageRoot, relativePath);

export const manifest: DocsPackageManifest = {
    id: 'vendure',
    name: 'Vendure Documentation',
    version: '3.5.2',
    vendureVersion: 'v3',
    navigation: [
        // Learn Sidebar
        {
            title: 'Getting Started',
            slug: 'getting-started',
            children: [
                {
                    title: 'Installation',
                    slug: 'installation',
                    file: file('docs/guides/getting-started/installation/index.md'),
                },
                {
                    title: 'Introducing GraphQL',
                    slug: 'graphql-intro',
                    file: file('docs/guides/getting-started/graphql-intro/index.mdx'),
                },
                {
                    title: 'Try the API',
                    slug: 'try-the-api',
                    file: file('docs/guides/getting-started/try-the-api/index.mdx'),
                },
            ],
        },
        {
            title: 'Core Concepts',
            slug: 'core-concepts',
            children: [
                {
                    title: 'Auth',
                    slug: 'auth',
                    file: file('docs/guides/core-concepts/auth/index.md'),
                },
                {
                    title: 'Channels',
                    slug: 'channels',
                    file: file('docs/guides/core-concepts/channels/index.md'),
                },
                {
                    title: 'Collections',
                    slug: 'collections',
                    file: file('docs/guides/core-concepts/collections/index.md'),
                },
                {
                    title: 'Customers',
                    slug: 'customers',
                    file: file('docs/guides/core-concepts/customers/index.md'),
                },
                {
                    title: 'Email',
                    slug: 'email',
                    file: file('docs/guides/core-concepts/email/index.md'),
                },
                {
                    title: 'Images & Assets',
                    slug: 'images-assets',
                    file: file('docs/guides/core-concepts/images-assets/index.md'),
                },
                {
                    title: 'Money',
                    slug: 'money',
                    file: file('docs/guides/core-concepts/money/index.md'),
                },
                {
                    title: 'Orders',
                    slug: 'orders',
                    file: file('docs/guides/core-concepts/orders/index.md'),
                },
                {
                    title: 'Payment',
                    slug: 'payment',
                    file: file('docs/guides/core-concepts/payment/index.md'),
                },
                {
                    title: 'Products',
                    slug: 'products',
                    file: file('docs/guides/core-concepts/products/index.md'),
                },
                {
                    title: 'Promotions',
                    slug: 'promotions',
                    file: file('docs/guides/core-concepts/promotions/index.md'),
                },
                {
                    title: 'Shipping',
                    slug: 'shipping',
                    file: file('docs/guides/core-concepts/shipping/index.md'),
                },
                {
                    title: 'Stock Control',
                    slug: 'stock-control',
                    file: file('docs/guides/core-concepts/stock-control/index.md'),
                },
                {
                    title: 'Taxes',
                    slug: 'taxes',
                    file: file('docs/guides/core-concepts/taxes/index.md'),
                },
            ],
        },
        {
            title: 'Developer Guide',
            slug: 'developer-guide',
            children: [
                // Overview section
                {
                    title: 'Overview',
                    slug: 'overview',
                    file: file('docs/guides/developer-guide/overview/index.md'),
                },
                {
                    title: 'The API Layer',
                    slug: 'the-api-layer',
                    file: file('docs/guides/developer-guide/the-api-layer/index.md'),
                },
                {
                    title: 'The Service Layer',
                    slug: 'the-service-layer',
                    file: file('docs/guides/developer-guide/the-service-layer/index.md'),
                },
                // Fundamentals section
                {
                    title: 'CLI',
                    slug: 'cli',
                    file: file('docs/guides/developer-guide/cli/index.md'),
                },
                {
                    title: 'Configuration',
                    slug: 'configuration',
                    file: file('docs/guides/developer-guide/configuration/index.md'),
                },
                {
                    title: 'Custom Fields',
                    slug: 'custom-fields',
                    file: file('docs/guides/developer-guide/custom-fields/index.md'),
                },
                {
                    title: 'Error Handling',
                    slug: 'error-handling',
                    file: file('docs/guides/developer-guide/error-handling/index.md'),
                },
                {
                    title: 'Events',
                    slug: 'events',
                    file: file('docs/guides/developer-guide/events/index.md'),
                },
                {
                    title: 'Migrations',
                    slug: 'migrations',
                    file: file('docs/guides/developer-guide/migrations/index.md'),
                },
                {
                    title: 'Plugins',
                    slug: 'plugins',
                    file: file('docs/guides/developer-guide/plugins/index.md'),
                },
                {
                    title: 'Security',
                    slug: 'security',
                    file: file('docs/guides/developer-guide/security/index.md'),
                },
                {
                    title: 'Strategies & Configurable Operations',
                    slug: 'strategies-configurable-operations',
                    file: file('docs/guides/developer-guide/strategies-configurable-operations/index.md'),
                },
                {
                    title: 'Testing',
                    slug: 'testing',
                    file: file('docs/guides/developer-guide/testing/index.md'),
                },
                {
                    title: 'Updating',
                    slug: 'updating',
                    file: file('docs/guides/developer-guide/updating/index.md'),
                },
                {
                    title: 'Worker & Job Queue',
                    slug: 'worker-job-queue',
                    file: file('docs/guides/developer-guide/worker-job-queue/index.md'),
                },
                {
                    title: 'Settings Store',
                    slug: 'settings-store',
                    file: file('docs/guides/developer-guide/settings-store/index.md'),
                },
                // Extend section
                {
                    title: 'REST Endpoint',
                    slug: 'rest-endpoint',
                    file: file('docs/guides/developer-guide/rest-endpoint/index.md'),
                },
                {
                    title: 'Custom Permissions',
                    slug: 'custom-permissions',
                    file: file('docs/guides/developer-guide/custom-permissions/index.md'),
                },
                {
                    title: 'Database Entity',
                    slug: 'database-entity',
                    file: file('docs/guides/developer-guide/database-entity/index.md'),
                },
                {
                    title: 'Extend GraphQL API',
                    slug: 'extend-graphql-api',
                    file: file('docs/guides/developer-guide/extend-graphql-api/index.md'),
                },
                // Advanced Topics section
                {
                    title: 'Custom Strategies in Plugins',
                    slug: 'custom-strategies-in-plugins',
                    file: file('docs/guides/developer-guide/custom-strategies-in-plugins/index.md'),
                },
                {
                    title: 'Channel Aware',
                    slug: 'channel-aware',
                    file: file('docs/guides/developer-guide/channel-aware/index.md'),
                },
                {
                    title: 'Translatable',
                    slug: 'translatable',
                    file: file('docs/guides/developer-guide/translatable/index.md'),
                },
                {
                    title: 'Has Custom Fields',
                    slug: 'has-custom-fields',
                    file: file('docs/guides/developer-guide/has-custom-fields/index.md'),
                },
                {
                    title: 'Cache',
                    slug: 'cache',
                    file: file('docs/guides/developer-guide/cache/index.md'),
                },
                {
                    title: 'Dataloaders',
                    slug: 'dataloaders',
                    file: file('docs/guides/developer-guide/dataloaders/index.md'),
                },
                {
                    title: 'DB Subscribers',
                    slug: 'db-subscribers',
                    file: file('docs/guides/developer-guide/db-subscribers/index.md'),
                },
                {
                    title: 'Importing Data',
                    slug: 'importing-data',
                    file: file('docs/guides/developer-guide/importing-data/index.md'),
                },
                {
                    title: 'Logging',
                    slug: 'logging',
                    file: file('docs/guides/developer-guide/logging/index.md'),
                },
                {
                    title: 'Scheduled Tasks',
                    slug: 'scheduled-tasks',
                    file: file('docs/guides/developer-guide/scheduled-tasks/index.md'),
                },
                {
                    title: 'Stand-alone Scripts',
                    slug: 'stand-alone-scripts',
                    file: file('docs/guides/developer-guide/stand-alone-scripts/index.md'),
                },
                {
                    title: 'Translations',
                    slug: 'translations',
                    file: file('docs/guides/developer-guide/translations/index.md'),
                },
                {
                    title: 'Uploading Files',
                    slug: 'uploading-files',
                    file: file('docs/guides/developer-guide/uploading-files/index.md'),
                },
                {
                    title: 'Nest DevTools',
                    slug: 'nest-devtools',
                    file: file('docs/guides/developer-guide/nest-devtools/index.md'),
                },
            ],
        },
        {
            title: 'How-to Guides',
            slug: 'how-to',
            children: [
                {
                    title: 'CMS Integration Plugin',
                    slug: 'cms-integration-plugin',
                    file: file('docs/guides/how-to/cms-integration-plugin/index.md'),
                },
                {
                    title: 'Codegen',
                    slug: 'codegen',
                    file: file('docs/guides/how-to/codegen/index.md'),
                },
                {
                    title: 'Configurable Products',
                    slug: 'configurable-products',
                    file: file('docs/guides/how-to/configurable-products/index.md'),
                },
                {
                    title: 'Digital Products',
                    slug: 'digital-products',
                    file: file('docs/guides/how-to/digital-products/index.md'),
                },
                {
                    title: 'GitHub OAuth Authentication',
                    slug: 'github-oauth-authentication',
                    file: file('docs/guides/how-to/github-oauth-authentication/index.md'),
                },
                {
                    title: 'Google OAuth Authentication',
                    slug: 'google-oauth-authentication',
                    file: file('docs/guides/how-to/google-oauth-authentication/index.md'),
                },
                {
                    title: 'Multi-vendor Marketplaces',
                    slug: 'multi-vendor-marketplaces',
                    file: file('docs/guides/how-to/multi-vendor-marketplaces/index.md'),
                },
                {
                    title: 'Paginated List',
                    slug: 'paginated-list',
                    file: file('docs/guides/how-to/paginated-list/index.md'),
                },
                {
                    title: 'Publish Plugin',
                    slug: 'publish-plugin',
                    file: file('docs/guides/how-to/publish-plugin/index.md'),
                },
                {
                    title: 'S3 Asset Storage',
                    slug: 's3-asset-storage',
                    file: file('docs/guides/how-to/s3-asset-storage/index.md'),
                },
                {
                    title: 'Telemetry',
                    slug: 'telemetry',
                    file: file('docs/guides/how-to/telemetry/index.md'),
                },
            ],
        },
        {
            title: 'React Admin Dashboard',
            slug: 'extending-the-dashboard',
            children: [
                {
                    title: 'Getting Started',
                    slug: 'getting-started',
                    file: file('docs/guides/extending-the-dashboard/getting-started/index.md'),
                },
                {
                    title: 'Extending Overview',
                    slug: 'extending-overview',
                    file: file('docs/guides/extending-the-dashboard/extending-overview/index.md'),
                },
                {
                    title: 'Creating Pages',
                    slug: 'creating-pages',
                    file: file('docs/guides/extending-the-dashboard/creating-pages/index.md'),
                    children: [
                        {
                            title: 'List Pages',
                            slug: 'list-pages',
                            file: file('docs/guides/extending-the-dashboard/creating-pages/list-pages.md'),
                        },
                        {
                            title: 'Detail Pages',
                            slug: 'detail-pages',
                            file: file('docs/guides/extending-the-dashboard/creating-pages/detail-pages.md'),
                        },
                        {
                            title: 'Tabbed Pages',
                            slug: 'tabbed-pages',
                            file: file('docs/guides/extending-the-dashboard/creating-pages/tabbed-pages.md'),
                        },
                    ],
                },
                {
                    title: 'Customizing Pages',
                    slug: 'customizing-pages',
                    file: file('docs/guides/extending-the-dashboard/customizing-pages/index.md'),
                    children: [
                        {
                            title: 'Customizing List Pages',
                            slug: 'customizing-list-pages',
                            file: file(
                                'docs/guides/extending-the-dashboard/customizing-pages/customizing-list-pages.md',
                            ),
                        },
                        {
                            title: 'Customizing Detail Pages',
                            slug: 'customizing-detail-pages',
                            file: file(
                                'docs/guides/extending-the-dashboard/customizing-pages/customizing-detail-pages.md',
                            ),
                        },
                        {
                            title: 'Customizing Login Page',
                            slug: 'customizing-login-page',
                            file: file(
                                'docs/guides/extending-the-dashboard/customizing-pages/customizing-login-page.md',
                            ),
                        },
                        {
                            title: 'Page Blocks',
                            slug: 'page-blocks',
                            file: file(
                                'docs/guides/extending-the-dashboard/customizing-pages/page-blocks.md',
                            ),
                        },
                        {
                            title: 'Action Bar Items',
                            slug: 'action-bar-items',
                            file: file(
                                'docs/guides/extending-the-dashboard/customizing-pages/action-bar-items.md',
                            ),
                        },
                        {
                            title: 'Insights Widgets',
                            slug: 'insights-widgets',
                            file: file(
                                'docs/guides/extending-the-dashboard/customizing-pages/insights-widgets.md',
                            ),
                        },
                        {
                            title: 'History Entries',
                            slug: 'history-entries',
                            file: file(
                                'docs/guides/extending-the-dashboard/customizing-pages/history-entries.md',
                            ),
                        },
                    ],
                },
                {
                    title: 'Custom Form Elements',
                    slug: 'custom-form-components',
                    file: file('docs/guides/extending-the-dashboard/custom-form-components/index.md'),
                    children: [
                        {
                            title: 'Form Component Examples',
                            slug: 'form-component-examples',
                            file: file(
                                'docs/guides/extending-the-dashboard/custom-form-components/form-component-examples.md',
                            ),
                        },
                        {
                            title: 'Relation Selectors',
                            slug: 'relation-selectors',
                            file: file(
                                'docs/guides/extending-the-dashboard/custom-form-components/relation-selectors.md',
                            ),
                        },
                    ],
                },
                {
                    title: 'Navigation',
                    slug: 'navigation',
                    file: file('docs/guides/extending-the-dashboard/navigation/index.md'),
                },
                {
                    title: 'Alerts',
                    slug: 'alerts',
                    file: file('docs/guides/extending-the-dashboard/alerts/index.md'),
                },
                {
                    title: 'Data Fetching',
                    slug: 'data-fetching',
                    file: file('docs/guides/extending-the-dashboard/data-fetching/index.md'),
                },
                {
                    title: 'Theming',
                    slug: 'theming',
                    file: file('docs/guides/extending-the-dashboard/theming/index.md'),
                },
                {
                    title: 'Localization',
                    slug: 'localization',
                    file: file('docs/guides/extending-the-dashboard/localization/index.md'),
                },
                {
                    title: 'Deployment',
                    slug: 'deployment',
                    file: file('docs/guides/extending-the-dashboard/deployment/index.md'),
                },
                {
                    title: 'Tech Stack',
                    slug: 'tech-stack',
                    file: file('docs/guides/extending-the-dashboard/tech-stack/index.md'),
                },
                {
                    title: 'Migration',
                    slug: 'migration',
                    file: file('docs/guides/extending-the-dashboard/migration/index.md'),
                },
            ],
        },
        {
            title: 'Building a Storefront',
            slug: 'storefront',
            children: [
                {
                    title: 'Storefront Starters',
                    slug: 'storefront-starters',
                    file: file('docs/guides/storefront/storefront-starters/index.md'),
                },
                {
                    title: 'Connect API',
                    slug: 'connect-api',
                    file: file('docs/guides/storefront/connect-api/index.md'),
                },
                {
                    title: 'Codegen',
                    slug: 'codegen',
                    file: file('docs/guides/storefront/codegen/index.md'),
                },
                // Storefront Tasks
                {
                    title: 'Navigation Menu',
                    slug: 'navigation-menu',
                    file: file('docs/guides/storefront/navigation-menu/index.md'),
                },
                {
                    title: 'Listing Products',
                    slug: 'listing-products',
                    file: file('docs/guides/storefront/listing-products/index.md'),
                },
                {
                    title: 'Product Detail',
                    slug: 'product-detail',
                    file: file('docs/guides/storefront/product-detail/index.md'),
                },
                {
                    title: 'Active Order',
                    slug: 'active-order',
                    file: file('docs/guides/storefront/active-order/index.md'),
                },
                {
                    title: 'Checkout Flow',
                    slug: 'checkout-flow',
                    file: file('docs/guides/storefront/checkout-flow/index.md'),
                },
                {
                    title: 'Customer Accounts',
                    slug: 'customer-accounts',
                    file: file('docs/guides/storefront/customer-accounts/index.md'),
                },
            ],
        },
        {
            title: 'Deployment',
            slug: 'deployment',
            children: [
                {
                    title: 'Production Configuration',
                    slug: 'production-configuration',
                    file: file('docs/guides/deployment/production-configuration/index.md'),
                },
                {
                    title: 'Using Docker',
                    slug: 'using-docker',
                    file: file('docs/guides/deployment/using-docker.md'),
                },
                {
                    title: 'Horizontal Scaling',
                    slug: 'horizontal-scaling',
                    file: file('docs/guides/deployment/horizontal-scaling.md'),
                },
                {
                    title: 'Getting Data into Production',
                    slug: 'getting-data-into-production',
                    file: file('docs/guides/deployment/getting-data-into-production.md'),
                },
                {
                    title: 'Server Resource Requirements',
                    slug: 'server-resource-requirements',
                    file: file('docs/guides/deployment/server-resource-requirements.md'),
                },
                {
                    title: 'Deploying Admin UI',
                    slug: 'deploying-admin-ui',
                    file: file('docs/guides/deployment/deploying-admin-ui.md'),
                },
                // Deployment Guides
                {
                    title: 'Deploy to Northflank',
                    slug: 'deploy-to-northflank',
                    file: file('docs/guides/deployment/deploy-to-northflank/index.md'),
                },
                {
                    title: 'Deploy to Digital Ocean App Platform',
                    slug: 'deploy-to-digital-ocean-app-platform',
                    file: file('docs/guides/deployment/deploy-to-digital-ocean-app-platform/index.md'),
                },
                {
                    title: 'Deploy to Railway',
                    slug: 'deploy-to-railway',
                    file: file('docs/guides/deployment/deploy-to-railway/index.md'),
                },
                {
                    title: 'Deploy to Render',
                    slug: 'deploy-to-render',
                    file: file('docs/guides/deployment/deploy-to-render/index.md'),
                },
                {
                    title: 'Deploy to Google Cloud Run',
                    slug: 'deploy-to-google-cloud-run',
                    file: file('docs/guides/deployment/deploy-to-google-cloud-run/index.md'),
                },
            ],
        },
        // Legacy APIs
        {
            title: 'Legacy APIs',
            slug: 'legacy-apis',
            children: [
                {
                    title: 'Angular Admin UI',
                    slug: 'extending-the-admin-ui',
                    children: [
                        {
                            title: 'Getting Started',
                            slug: 'getting-started',
                            file: file('docs/guides/extending-the-admin-ui/getting-started/index.md'),
                        },
                        {
                            title: 'UI Library',
                            slug: 'ui-library',
                            file: file('docs/guides/extending-the-admin-ui/ui-library/index.md'),
                        },
                        {
                            title: 'Admin UI Theming & Branding',
                            slug: 'admin-ui-theming-branding',
                            file: file(
                                'docs/guides/extending-the-admin-ui/admin-ui-theming-branding/index.md',
                            ),
                        },
                        {
                            title: 'Adding UI Translations',
                            slug: 'adding-ui-translations',
                            file: file('docs/guides/extending-the-admin-ui/adding-ui-translations/index.md'),
                        },
                        {
                            title: 'Using Other Frameworks',
                            slug: 'using-other-frameworks',
                            file: file('docs/guides/extending-the-admin-ui/using-other-frameworks/index.mdx'),
                        },
                        // Providers
                        {
                            title: 'Nav Menu',
                            slug: 'nav-menu',
                            file: file('docs/guides/extending-the-admin-ui/nav-menu/index.md'),
                        },
                        {
                            title: 'Alerts',
                            slug: 'alerts',
                            file: file('docs/guides/extending-the-admin-ui/alerts/index.md'),
                        },
                        {
                            title: 'Add Actions to Pages',
                            slug: 'add-actions-to-pages',
                            file: file('docs/guides/extending-the-admin-ui/add-actions-to-pages/index.md'),
                        },
                        {
                            title: 'Page Tabs',
                            slug: 'page-tabs',
                            file: file('docs/guides/extending-the-admin-ui/page-tabs/index.md'),
                        },
                        {
                            title: 'Custom Form Inputs',
                            slug: 'custom-form-inputs',
                            file: file('docs/guides/extending-the-admin-ui/custom-form-inputs/index.md'),
                        },
                        {
                            title: 'Custom Data Table Components',
                            slug: 'custom-data-table-components',
                            file: file(
                                'docs/guides/extending-the-admin-ui/custom-data-table-components/index.md',
                            ),
                        },
                        {
                            title: 'Custom Detail Components',
                            slug: 'custom-detail-components',
                            file: file(
                                'docs/guides/extending-the-admin-ui/custom-detail-components/index.md',
                            ),
                        },
                        {
                            title: 'Bulk Actions',
                            slug: 'bulk-actions',
                            file: file('docs/guides/extending-the-admin-ui/bulk-actions/index.md'),
                        },
                        {
                            title: 'Dashboard Widgets',
                            slug: 'dashboard-widgets',
                            file: file('docs/guides/extending-the-admin-ui/dashboard-widgets/index.md'),
                        },
                        {
                            title: 'Custom Timeline Components',
                            slug: 'custom-timeline-components',
                            file: file(
                                'docs/guides/extending-the-admin-ui/custom-timeline-components/index.md',
                            ),
                        },
                        // Routes
                        {
                            title: 'Defining Routes',
                            slug: 'defining-routes',
                            file: file('docs/guides/extending-the-admin-ui/defining-routes/index.md'),
                        },
                        {
                            title: 'Creating List Views',
                            slug: 'creating-list-views',
                            file: file('docs/guides/extending-the-admin-ui/creating-list-views/index.md'),
                        },
                        {
                            title: 'Creating Detail Views',
                            slug: 'creating-detail-views',
                            file: file('docs/guides/extending-the-admin-ui/creating-detail-views/index.md'),
                        },
                    ],
                },
                {
                    title: 'Migrating from v1',
                    slug: 'migrating-from-v1',
                    file: file('docs/guides/developer-guide/migrating-from-v1/index.md'),
                },
            ],
        },
        // Reference Sidebar
        {
            title: 'Reference',
            slug: 'reference',
            file: file('docs/reference/index.mdx'),
            children: [
                {
                    title: 'TypeScript API',
                    slug: 'typescript-api',
                    file: file('docs/reference/typescript-api/index.md'),
                },
                {
                    title: 'Core Plugins',
                    slug: 'core-plugins',
                    file: file('docs/reference/core-plugins/index.md'),
                    children: [
                        {
                            title: 'AdminUiPlugin',
                            slug: 'admin-ui-plugin',
                            file: file('docs/reference/core-plugins/admin-ui-plugin/index.md'),
                        },
                        {
                            title: 'AssetServerPlugin',
                            slug: 'asset-server-plugin',
                            file: file('docs/reference/core-plugins/asset-server-plugin/index.md'),
                        },
                        {
                            title: 'DashboardPlugin',
                            slug: 'dashboard-plugin',
                            file: file('docs/reference/core-plugins/dashboard-plugin/index.md'),
                        },
                        {
                            title: 'ElasticsearchPlugin',
                            slug: 'elasticsearch-plugin',
                            file: file('docs/reference/core-plugins/elasticsearch-plugin/index.md'),
                        },
                        {
                            title: 'EmailPlugin',
                            slug: 'email-plugin',
                            file: file('docs/reference/core-plugins/email-plugin/index.md'),
                        },
                        {
                            title: 'GraphiQLPlugin',
                            slug: 'graphiql-plugin',
                            file: file('docs/reference/core-plugins/graphiql-plugin/index.md'),
                        },
                        {
                            title: 'HardenPlugin',
                            slug: 'harden-plugin',
                            file: file('docs/reference/core-plugins/harden-plugin/index.md'),
                        },
                        {
                            title: 'JobQueuePlugin',
                            slug: 'job-queue-plugin',
                            file: file('docs/reference/core-plugins/job-queue-plugin/index.md'),
                        },
                        {
                            title: 'PaymentsPlugin',
                            slug: 'payments-plugin',
                            file: file('docs/reference/core-plugins/payments-plugin/index.md'),
                        },
                        {
                            title: 'SentryPlugin',
                            slug: 'sentry-plugin',
                            file: file('docs/reference/core-plugins/sentry-plugin/index.md'),
                        },
                        {
                            title: 'StellatePlugin',
                            slug: 'stellate-plugin',
                            file: file('docs/reference/core-plugins/stellate-plugin/index.md'),
                        },
                        {
                            title: 'TelemetryPlugin',
                            slug: 'telemetry-plugin',
                            file: file('docs/reference/core-plugins/telemetry-plugin/index.md'),
                        },
                    ],
                },
                {
                    title: 'GraphQL API',
                    slug: 'graphql-api',
                    children: [
                        {
                            title: 'Admin API',
                            slug: 'admin',
                            file: file('docs/reference/graphql-api/admin/index.md'),
                        },
                        {
                            title: 'Shop API',
                            slug: 'shop',
                            file: file('docs/reference/graphql-api/shop/index.md'),
                        },
                    ],
                },
                {
                    title: 'Dashboard API',
                    slug: 'dashboard',
                    file: file('docs/reference/dashboard/index.md'),
                },
                {
                    title: 'Admin UI API',
                    slug: 'admin-ui-api',
                    file: file('docs/reference/admin-ui-api/index.md'),
                },
            ],
        },
        // User Guide Sidebar
        {
            title: 'User Guide',
            slug: 'user-guide',
            file: file('docs/user-guide/index.md'),
            children: [
                {
                    title: 'Catalog',
                    slug: 'catalog',
                    file: file('docs/user-guide/catalog/index.md'),
                },
                {
                    title: 'Orders',
                    slug: 'orders',
                    file: file('docs/user-guide/orders/index.md'),
                },
                {
                    title: 'Customers',
                    slug: 'customers',
                    file: file('docs/user-guide/customers/index.md'),
                },
                {
                    title: 'Promotions',
                    slug: 'promotions',
                    file: file('docs/user-guide/promotions/index.md'),
                },
                {
                    title: 'Settings',
                    slug: 'settings',
                    file: file('docs/user-guide/settings/index.md'),
                },
            ],
        },
    ],
    github: {
        repository: 'vendure-ecommerce/vendure',
        branch: 'master',
        docsPath: 'packages/docs/docs',
    },
};
