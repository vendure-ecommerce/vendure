import type React from 'react';

/**
 * @description
 * Defines a custom logo component for the login page.
 *
 * @docsCategory extensions
 * @docsPage Login
 * @since 3.4.0
 */
export interface LoginLogoExtension {
    /**
     * @description
     * A React component that will replace the default Vendure logo.
     */
    component: React.ComponentType;
}

/**
 * @description
 * Defines content to display before the login form.
 *
 * @docsCategory extensions
 * @docsPage Login
 * @since 3.4.0
 */
export interface LoginBeforeFormExtension {
    /**
     * @description
     * A React component that will be rendered before the login form.
     */
    component: React.ComponentType;
}

/**
 * @description
 * Defines content to display after the login form.
 *
 * @docsCategory extensions
 * @docsPage Login
 * @since 3.4.0
 */
export interface LoginAfterFormExtension {
    /**
     * @description
     * A React component that will be rendered after the login form.
     */
    component: React.ComponentType;
}

/**
 * @description
 * Defines a custom login image component that replaces the default image panel.
 *
 * @docsCategory extensions
 * @docsPage Login
 * @since 3.4.0
 */
export interface LoginImageExtension {
    /**
     * @description
     * A React component that will replace the default login image panel.
     */
    component: React.ComponentType;
}

/**
 * @description
 * Defines all available login page extensions.
 *
 * @docsCategory extensions
 * @docsPage Login
 * @since 3.4.0
 */
export interface DashboardLoginExtensions {
    /**
     * @description
     * Custom logo component to replace the default Vendure logo.
     */
    logo?: LoginLogoExtension;
    /**
     * @description
     * Component to render before the login form.
     */
    beforeForm?: LoginBeforeFormExtension;
    /**
     * @description
     * Component to render after the login form.
     */
    afterForm?: LoginAfterFormExtension;
    /**
     * @description
     * Custom login image component to replace the default image panel.
     */
    loginImage?: LoginImageExtension;
}
