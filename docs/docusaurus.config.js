// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/nightOwlLight');
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Vendure Docs',
    tagline: 'Dinosaurs are cool',
    favicon: 'img/favicon.ico',

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
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    routeBasePath: '/',
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],
    themes: ['docusaurus-theme-search-typesense'],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
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
                        href: 'https://github.com/facebook/docusaurus',
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
                style: 'dark',
                links: [
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
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Vendure GmbH. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
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
