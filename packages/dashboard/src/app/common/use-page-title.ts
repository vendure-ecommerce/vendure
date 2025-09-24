import { useMatches } from '@tanstack/react-router';
import React, { isValidElement, ReactElement, useEffect, useState } from 'react';

const DEFAULT_TITLE = 'Vendure';

/**
 * @description
 * Derives the meta title of the page based on the current route's breadcrumb
 * data from the route loader.
 */
export function usePageTitle() {
    const matches = useMatches();
    const [pageTitle, setPageTitle] = useState<string>(DEFAULT_TITLE);

    useEffect(() => {
        const lastMatch = matches.at(-1);
        const breadcrumb = (lastMatch?.loaderData as any)?.breadcrumb;
        let breadcrumbTitle = '';
        if (typeof breadcrumb === 'function') {
            breadcrumbTitle = renderNodeAsString(breadcrumb());
        }
        if (Array.isArray(breadcrumb) && breadcrumb.length > 0) {
            breadcrumbTitle = breadcrumb.at(-1);
        }
        setPageTitle([breadcrumbTitle, DEFAULT_TITLE].filter(x => !!x).join(' • '));
    }, [matches]);

    return pageTitle;
}

const renderNodeAsString = function (reactNode: React.ReactNode): string {
    let string = '';
    if (typeof reactNode === 'string') {
        string = reactNode;
    } else if (typeof reactNode === 'number') {
        string = reactNode.toString();
    } else if (Array.isArray(reactNode)) {
        reactNode.forEach(function (child) {
            string += renderNodeAsString(child);
        });
    } else if (isValidElement(reactNode)) {
        string += renderNodeAsString((reactNode as ReactElement<any>).props.children);
    }
    return string;
};
