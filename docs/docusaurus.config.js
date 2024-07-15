// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/nightOwlLight');
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Vendure Docs',
    favicon: 'img/logo.webp',

    // Set the production url of your site here
    url: 'https://docs.vendure.io',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'vendure-ecommerce', // Usually your GitHub org/user name.
    projectName: 'vendure', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            '@docusaurus/preset-classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    routeBasePath: '/',
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/vendure-ecommerce/vendure/blob/master/docs/',
                    showLastUpdateTime: true,
                    admonitions: {
                        keywords: ['cli'],
                        extendDefaults: true,
                    },
                    exclude: [
                        'user-guide/**/*'
                    ]
                },
                blog: false,
                theme: {
                    customCss: [
                        require.resolve('./src/css/custom.css'),
                        require.resolve('./src/css/layout.css'),
                        require.resolve('./src/css/overrides.css'),
                        require.resolve('./src/css/code-blocks.css'),
                    ],
                },
            }),
        ],
    ],
    themes: ['docusaurus-theme-search-typesense'],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            colorMode: {
                defaultMode: 'dark',
                disableSwitch: false,
                respectPrefersColorScheme: true,
            },
            // Replace with your project's social card
            image: 'img/docusaurus-social-card.jpg',
            navbar: {
                title: '',
                logo: {
                    alt: 'Vendure logo',
                    src: 'img/logo.webp',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'learnSidebar',
                        position: 'left',
                        label: 'Learn',
                    },
                    {
                        type: 'docSidebar',
                        sidebarId: 'referenceSidebar',
                        position: 'left',
                        label: 'Reference',
                    },
                    {
                        href: 'https://vendure.io',
                        label: 'vendure.io',
                        position: 'right',
                    },
                    {
                        href: 'https://github.com/vendure-ecommerce/vendure',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            docs: {
                sidebar: {
                    autoCollapseCategories: true,
                },
            },
            footer: {
                links: [
                    {
                        title: 'Resources',
                        items: [
                            {
                                label: 'vendure.io',
                                href: 'https://www.vendure.io',
                            },
                            {
                                label: 'GitHub',
                                href: 'https://github.com/vendure-ecommerce/vendure',
                            },
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Discord',
                                href: 'https://vendure.io/community/',
                            },
                            {
                                label: 'Twitter',
                                href: 'https://twitter.com/vendure_io',
                            },
                            {
                                label: 'YouTube',
                                href: 'https://www.youtube.com/@vendure_io',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Vendure GmbH.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                additionalLanguages: ['docker', 'bash'],
            },
            typesense: {
                // Replace this with the name of your index/collection.
                // It should match the "index_name" entry in the scraper's "config.json" file.
                typesenseCollectionName: 'vendure-docs',

                typesenseServerConfig: {
                    nodes: [
                        {
                            host: 'gly437ru8znh5oaep-1.a1.typesense.net',
                            port: 443,
                            protocol: 'https',
                        },
                        {
                            host: 'gly437ru8znh5oaep-2.a1.typesense.net',
                            port: 443,
                            protocol: 'https',
                        },
                        {
                            host: 'gly437ru8znh5oaep-3.a1.typesense.net',
                            port: 443,
                            protocol: 'https',
                        },
                    ],
                    apiKey: 'gm6HqoeTBT7W1zcGPiUHDWhasQlPMzI7',
                },

                // Optional: Typesense search parameters: https://typesense.org/docs/0.24.0/api/search.html#search-parameters
                typesenseSearchParameters: {},

                // Optional
                contextualSearch: true,
            },
        }),
};

module.exports = config;
