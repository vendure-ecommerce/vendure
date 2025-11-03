import Link from '@docusaurus/Link';
import Playground from '@site/src/components/Playground';
import Layout from '@theme/Layout';
import React from 'react';

import styles from './index.module.css';

// Simple SVG icons for the cards
const PlayIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="5,3 19,12 5,21"/>
    </svg>
);

const CodeIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="16,18 22,12 16,6"/>
        <polyline points="8,6 2,12 8,18"/>
    </svg>
);

const StarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
);

const ToolsIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* eslint-disable-next-line max-len */}
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
);

const ProductIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
);

const CheckoutIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 12l2 2 4-4"/>
        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
        <path d="M12 3v6"/>
        <path d="M12 15v6"/>
    </svg>
);

const UsersIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const PaymentIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
);

const SettingsIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="3"/>
        {/* eslint-disable-next-line max-len */}
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 -1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
);

const PluginIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <rect x="7" y="7" width="3" height="9"/>
        <rect x="14" y="7" width="3" height="5"/>
    </svg>
);

export default function Home(): JSX.Element {
    return (
        <Layout
            title={`Vendure documentation`}
            description="Developer docs for Vendure: the open-source headless commerce platform"
        >
            <div className={styles.heroBanner}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 541 120"
                    style={{ color: '#17C1FF', marginTop: '2rem' }}
                    height="75"
                    width="auto"
                >
                    <path
                        fill="currentColor"
                        // eslint-disable-next-line max-len
                        d="M69.88 40.575a3.046 3.046 0 0 0-2.496-1.276H56.84c-1.283 0-2.463.828-2.879 2.035L35.995 93.226 17.752 41.3a3.033 3.033 0 0 0-2.879-2.036H4.017c-1.005 0-1.907.483-2.497 1.277a3.113 3.113 0 0 0-.381 2.76l25.873 71.248c.417 1.208 1.561 2.001 2.844 2.001h11.48c1.284 0 2.428-.793 2.845-2.001l26.012-71.248a2.912 2.912 0 0 0-.382-2.76l.07.034ZM144.935 80.357c.104-1.139.174-2.691.174-4.727 0-7.176-1.63-13.767-4.821-19.632-3.191-5.865-7.7-10.592-13.319-14.008-5.653-3.416-12.069-5.176-19.006-5.176-7.353 0-14.047 1.795-19.873 5.314-5.827 3.52-10.405 8.487-13.666 14.733C71.2 63.035 69.57 70.11 69.57 77.873s1.665 14.836 4.925 21.046c3.295 6.245 7.942 11.214 13.804 14.733 5.861 3.519 12.624 5.313 20.081 5.313 8.012 0 15.087-1.621 21.053-4.864 5.931-3.244 10.786-7.764 14.428-13.422a3.058 3.058 0 0 0-.867-4.14l-8.254-5.486c-.694-.449-1.527-.621-2.359-.449a3.063 3.063 0 0 0-1.942 1.38 23.708 23.708 0 0 1-8.602 8.454c-3.537 2.001-8.15 3.036-13.734 3.036-6.659 0-11.758-2.174-15.573-6.694-3.33-3.933-5.376-8.453-6.174-13.766h55.563c1.561 0 2.879-1.173 3.017-2.726v.069ZM87.431 68.522c1.248-4.209 3.364-7.763 6.347-10.764 3.676-3.658 8.289-5.452 14.15-5.452 5.862 0 10.718 1.553 14.151 4.727 2.81 2.622 4.821 6.487 5.931 11.455H87.396l.035.034ZM218.013 50.27c-2.809-4.416-6.625-7.832-11.341-10.109-4.613-2.208-9.746-3.347-15.157-3.347-5.861 0-11.099 1.415-15.607 4.175a28.33 28.33 0 0 0-5.064 4.003v-2.726a3.049 3.049 0 0 0-3.052-3.036h-10.405c-1.665 0-3.052 1.345-3.052 3.036v71.248a3.048 3.048 0 0 0 3.052 3.036h10.405c1.664 0 3.052-1.345 3.052-3.036V77.873c0-8.04 1.665-14.491 4.959-19.115 3.087-4.347 7.7-6.486 14.047-6.486 10.891 0 15.954 5.762 15.954 18.148v43.094a3.049 3.049 0 0 0 3.053 3.036h10.405c1.664 0 3.052-1.345 3.052-3.036V65.866c0-5.935-1.422-11.18-4.197-15.596h-.104ZM306.108 0h-10.405c-1.664 0-3.052 1.346-3.052 3.036v42.06a33.223 33.223 0 0 0-6.486-4.452c-4.751-2.518-10.058-3.76-15.711-3.76-7.353 0-14.047 1.794-19.874 5.313-5.826 3.52-10.404 8.453-13.665 14.663-3.225 6.142-4.855 13.18-4.855 20.978 0 7.798 1.664 15.009 4.925 21.185 3.295 6.245 7.942 11.213 13.804 14.733 5.861 3.519 12.555 5.313 19.942 5.313 5.584 0 10.822-1.277 15.504-3.795 2.289-1.242 4.439-2.692 6.382-4.417v2.726a3.048 3.048 0 0 0 3.052 3.036h10.405c1.664 0 3.052-1.345 3.052-3.036V3.036A3.049 3.049 0 0 0 306.074 0h.034Zm-13.457 77.907c0 5.003-.971 9.523-2.913 13.456-1.908 3.9-4.474 6.832-7.873 8.971-3.364 2.139-7.11 3.174-11.446 3.174-4.335 0-7.907-1.035-11.202-3.174-3.33-2.14-5.897-5.106-7.804-9.005-1.942-3.933-2.913-8.488-2.913-13.594 0-5.107.971-9.489 2.913-13.353 1.907-3.864 4.474-6.762 7.804-8.936 3.295-2.14 6.971-3.174 11.202-3.174 4.232 0 8.082 1.035 11.446 3.174 3.329 2.105 5.965 5.14 7.873 8.97 1.942 3.934 2.913 8.454 2.913 13.457v.034ZM388.308 39.264h-10.405c-1.665 0-3.052 1.346-3.052 3.036v35.607c0 8.04-1.665 14.491-4.96 19.115-3.087 4.347-7.7 6.486-14.047 6.486-10.89 0-15.954-5.762-15.954-18.148V42.266a3.049 3.049 0 0 0-3.052-3.036h-10.405c-1.665 0-3.052 1.345-3.052 3.036v47.648c0 5.935 1.422 11.179 4.196 15.595 2.81 4.417 6.625 7.833 11.342 10.11 4.647 2.208 9.746 3.346 15.156 3.346 5.862 0 11.099-1.414 15.608-4.174a28.289 28.289 0 0 0 5.098-4.003v2.726a3.049 3.049 0 0 0 3.052 3.036h10.405c1.665 0 3.052-1.345 3.052-3.036V42.3a3.048 3.048 0 0 0-3.052-3.036h.07ZM450.737 38.056a26.516 26.516 0 0 0-7.942-1.207c-5.931 0-11.307 1.656-16.058 4.968-2.047 1.415-3.954 3.106-5.723 5.072v-4.554a3.049 3.049 0 0 0-3.052-3.036h-10.405c-1.665 0-3.052 1.345-3.052 3.036v71.248a3.048 3.048 0 0 0 3.052 3.036h10.405c1.665 0 3.052-1.345 3.052-3.036V79.494c0-5.796 1.04-10.834 3.121-15.043 2.047-4.106 4.752-7.245 8.047-9.385 3.295-2.139 6.763-3.174 10.578-3.174 2.116 0 3.989.414 5.723 1.242.936.449 2.046.38 2.913-.172s1.422-1.518 1.422-2.554v-9.453a3.005 3.005 0 0 0-2.115-2.864l.034-.035ZM525.827 80.357c.104-1.139.173-2.657.173-4.727 0-7.176-1.63-13.801-4.786-19.632-3.191-5.865-7.7-10.592-13.319-14.008-5.653-3.416-12.069-5.141-19.006-5.141-7.353 0-14.047 1.794-19.873 5.313-5.827 3.52-10.405 8.488-13.666 14.733-3.225 6.176-4.855 13.25-4.855 21.012 0 7.763 1.664 14.836 4.925 21.047 3.295 6.245 7.942 11.213 13.838 14.733 5.862 3.519 12.625 5.313 20.082 5.313 8.012 0 15.087-1.622 21.053-4.865 5.93-3.243 10.786-7.763 14.428-13.421a3.06 3.06 0 0 0-.867-4.14l-8.255-5.487a3.139 3.139 0 0 0-2.358-.448c-.798.172-1.492.69-1.943 1.38a23.52 23.52 0 0 1-8.636 8.453c-3.537 2.001-8.15 3.036-13.734 3.036-6.659 0-11.758-2.173-15.573-6.693-3.33-3.934-5.376-8.453-6.174-13.767h55.563c1.561 0 2.879-1.173 3.017-2.726l-.034.035Zm-57.505-11.835c1.248-4.209 3.364-7.763 6.347-10.764 3.676-3.658 8.289-5.452 14.151-5.452 5.861 0 10.717 1.553 14.15 4.727 2.81 2.622 4.821 6.487 5.931 11.455h-40.614l.035.034Z"
                    ></path>
                    <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M530 39c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
                    ></path>
                    <path
                        fill="currentColor"
                        // eslint-disable-next-line max-len
                        d="M529.39 28.096c.621 0 1.073-.124 1.344-.361.272-.226.419-.61.419-1.153 0-.531-.147-.904-.419-1.141-.271-.226-.723-.34-1.344-.34h-1.266v2.995h1.266Zm-1.266 2.068v4.407h-3.005V22.92h4.587c1.537 0 2.656.26 3.367.78.724.508 1.074 1.322 1.074 2.44 0 .769-.181 1.401-.554 1.899-.373.485-.926.858-1.683 1.084.418.102.779.317 1.107.644.328.328.655.825.983 1.503l1.638 3.3h-3.197l-1.424-2.893c-.283-.576-.576-.983-.87-1.187-.294-.214-.689-.327-1.175-.327h-.848Z"
                    ></path>
                </svg>
                <h1 className={styles.tagline}>Developer Documentation</h1>
                <div className={styles.description}>
                    Vendure is the headless commerce platform for companies with complex commerce
                    requirements. Its modular architecture gives you complete control to build exactly what
                    you need—without compromise—whether scaling B2C, managing B2B workflows, or orchestrating
                    multi-channel experiences.
                </div>
            </div>
            <main>
                <div className={styles.docLayout}>
                <div className={styles.docContainer}>
                    <div className={styles.mainCards}>
                        <Link to="/guides/getting-started/installation/" className={styles.mainCard}>
                            <div className={styles.cardIcon}>
                                <PlayIcon />
                            </div>
                            <h3 className={styles.cardTitle}>Get Started</h3>
                            <p className={styles.cardDescription}>
                                Follow our installation guide and create your first Vendure project.
                            </p>
                        </Link>

                        <Link to="/guides/developer-guide/overview/" className={styles.mainCard}>
                            <div className={styles.cardIcon}>
                                <StarIcon />
                            </div>
                            <h3 className={styles.cardTitle}>Learn Vendure</h3>
                            <p className={styles.cardDescription}>
                                Understand Vendure's core concepts and architecture principles.
                            </p>
                        </Link>

                        <Link to="/reference/" className={styles.mainCard}>
                            <div className={styles.cardIcon}>
                                <CodeIcon />
                            </div>
                            <h3 className={styles.cardTitle}>API Reference</h3>
                            <p className={styles.cardDescription}>
                                Explore comprehensive GraphQL API documentation and examples.
                            </p>
                        </Link>
                    </div>

                    <section className={styles.conceptsSection}>
                        <h2 className={styles.sectionTitle}>Core Concepts</h2>
                        <div className={styles.conceptsGrid}>
                            <Link to="/guides/developer-guide/custom-fields/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <SettingsIcon />
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Custom Fields
                                    </h3>
                                    <p className={styles.conceptDescription}>Adding custom data to any Vendure entity.</p>
                                </div>
                            </Link>

                            <Link to="/guides/developer-guide/plugins/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <PluginIcon />
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Plugins
                                    </h3>
                                    <p className={styles.conceptDescription}>The core of Vendure's extensibility.</p>
                                </div>
                            </Link>

                            <Link to="/guides/core-concepts/products/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <ProductIcon />
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Products
                                    </h3>
                                    <p className={styles.conceptDescription}>Configure catalog.</p>
                                </div>
                            </Link>

                            <Link to="/guides/core-concepts/customers/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <UsersIcon />
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Customers
                                    </h3>
                                    <p className={styles.conceptDescription}>Multi customer configuration.</p>
                                </div>
                            </Link>

                            <Link to="/guides/core-concepts/payment/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <PaymentIcon />
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Payments
                                    </h3>
                                    <p className={styles.conceptDescription}>Payment integrations and API.</p>
                                </div>
                            </Link>

                            <Link to="/guides/core-concepts/orders/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <CheckoutIcon />
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Orders
                                    </h3>
                                    <p className={styles.conceptDescription}>Business logic of checkout.</p>
                                </div>
                            </Link>
                        </div>
                    </section>

                    <section className={styles.recipesSection}>
                        <h2 className={styles.sectionTitle}>How-To Guides</h2>
                        <div className={styles.conceptsGrid}>
                            <Link to="/guides/how-to/publish-plugin/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10"/>
                                        <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/>
                                    </svg>
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Publish Plugin
                                    </h3>
                                    <p className={styles.conceptDescription}>
                                        Learn how to publish your custom plugin to npm.
                                    </p>
                                </div>
                            </Link>

                            <Link to="/guides/how-to/digital-products/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                                    </svg>
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Digital Products
                                    </h3>
                                    <p className={styles.conceptDescription}>
                                        Sell licenses, services, and other non-physical goods.
                                    </p>
                                </div>
                            </Link>

                            <Link to="/guides/how-to/configurable-products/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M1 3h15l-1 9H4L1 3z"/>
                                        <path d="M16 8h8"/>
                                        <circle cx="6" cy="20" r="1"/>
                                        <circle cx="17" cy="20" r="1"/>
                                    </svg>
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Configurable Products
                                    </h3>
                                    <p className={styles.conceptDescription}>
                                        Create products with multiple variants and options.
                                    </p>
                                </div>
                            </Link>

                            <Link to="/guides/how-to/paginated-list/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                        <polyline points="9,22 9,12 15,12 15,22"/>
                                    </svg>
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Paginated Lists
                                    </h3>
                                    <p className={styles.conceptDescription}>
                                        Implement efficient pagination for large datasets.
                                    </p>
                                </div>
                            </Link>

                            <Link to="/guides/how-to/codegen/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                        <rect x="7" y="7" width="3" height="9"/>
                                        <rect x="14" y="7" width="3" height="5"/>
                                    </svg>
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Code Generation
                                    </h3>
                                    <p className={styles.conceptDescription}>
                                        Generate TypeScript types from your GraphQL schema.
                                    </p>
                                </div>
                            </Link>

                            <Link to="/guides/how-to/multi-vendor-marketplaces/" className={styles.conceptItem}>
                                <div className={styles.conceptIcon}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="9" cy="21" r="1"/>
                                        <circle cx="20" cy="21" r="1"/>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                    </svg>
                                </div>
                                <div className={styles.conceptContent}>
                                    <h3 className={styles.conceptTitle}>
                                        Multi-vendor Marketplaces
                                    </h3>
                                    <p className={styles.conceptDescription}>
                                        Create a marketplace platform where multiple sellers can sell their products.
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </section>
                </div>

                <div style={{ padding: '2rem 0' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Try the API</h2>
                    <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
                        Explore Vendure's GraphQL API with this interactive playground.
                    </p>
                    <Playground
                        api={'shop'}
                        minHeight="800px"
                        server={'readonlydemo'}
                        document={`
query GetProducts {
    products {
        totalItems
        items {
            id
            name
            slug
            featuredAsset {
                id
                preview
            }
        }
    }
}`}
                    ></Playground>
                </div>
            </div>
            </main>
        </Layout>
    );
}
