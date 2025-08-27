import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/vdb/components/ui/breadcrumb.js';
import { Link, useRouter, useRouterState } from '@tanstack/react-router';
import * as React from 'react';
import { Fragment } from 'react';
import { getNavMenuConfig } from '@/vdb/framework/nav-menu/nav-menu-extensions.js';
import type {
    NavMenuConfig,
    NavMenuItem,
    NavMenuSection,
} from '@/vdb/framework/nav-menu/nav-menu-extensions.js';

export interface BreadcrumbPair {
    label: string | React.ReactElement;
    path: string;
}

export type BreadcrumbShorthand = string | React.ReactElement;

export type PageBreadcrumb = BreadcrumbPair | BreadcrumbShorthand;

export function GeneratedBreadcrumbs() {
    const matches = useRouterState({ select: s => s.matches });
    const currentPath = useRouterState({ select: s => s.location.pathname });
    const router = useRouter();
    const navMenuConfig = getNavMenuConfig() as NavMenuConfig;
    const basePath = router.basepath || '';

    const normalizeBreadcrumb = (breadcrumb: any, pathname: string): BreadcrumbPair[] => {
        if (typeof breadcrumb === 'string') {
            return [{ label: breadcrumb, path: pathname }];
        }
        if (React.isValidElement(breadcrumb)) {
            return [{ label: breadcrumb, path: pathname }];
        }
        if (typeof breadcrumb === 'function') {
            return [{ label: breadcrumb(), path: pathname }];
        }
        if (Array.isArray(breadcrumb)) {
            return breadcrumb.map((crumb: PageBreadcrumb) => {
                if (typeof crumb === 'string' || React.isValidElement(crumb)) {
                    return { label: crumb, path: pathname };
                }
                return { label: crumb.label, path: crumb.path };
            });
        }
        return [];
    };

    const rawCrumbs: BreadcrumbPair[] = React.useMemo(() => {
        return matches
            .filter(match => match.loaderData?.breadcrumb)
            .flatMap(({ pathname, loaderData }) => 
                normalizeBreadcrumb(loaderData.breadcrumb, pathname)
            );
    }, [matches]);

    const isBaseRoute = (p: string) => p === basePath || p === `${basePath}/`;
    const pageCrumbs: BreadcrumbPair[] = rawCrumbs.filter(c => !isBaseRoute(c.path));

    const normalizePath = (path: string): string => {
        const normalizedPath = basePath && path.startsWith(basePath) ? path.slice(basePath.length) : path;
        return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    };

    const pathMatches = (cleanPath: string, url: string): boolean => {
        return cleanPath === url || cleanPath.startsWith(url + '/');
    };

    const checkSectionItems = (section: NavMenuSection, cleanPath: string): BreadcrumbPair | undefined => {
        if (!('items' in section) || !Array.isArray(section.items)) {
            return undefined;
        }
        
        for (const item of section.items as NavMenuItem[]) {
            if (pathMatches(cleanPath, item.url)) {
                return { label: section.title, path: item.url };
            }
        }
        return undefined;
    };

    const checkDirectSection = (section: NavMenuItem, cleanPath: string): BreadcrumbPair | undefined => {
        if ('url' in section && section.url && pathMatches(cleanPath, section.url)) {
            return { label: section.title, path: section.url };
        }
        return undefined;
    };

    const findSectionCrumb = (path: string): BreadcrumbPair | undefined => {
        const cleanPath = normalizePath(path);
        
        for (const section of navMenuConfig.sections as Array<NavMenuSection | NavMenuItem>) {
            const result = checkSectionItems(section as NavMenuSection, cleanPath) || 
                          checkDirectSection(section as NavMenuItem, cleanPath);
            if (result) {
                return result;
            }
        }
        return undefined;
    };

    const sectionCrumb = React.useMemo(() => findSectionCrumb(currentPath), [currentPath, basePath]);
    const breadcrumbs: BreadcrumbPair[] = React.useMemo(
        () => (sectionCrumb ? [sectionCrumb, ...pageCrumbs] : pageCrumbs),
        [sectionCrumb, pageCrumbs],
    );
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map(({ label, path }, index, arr) => (
                    <Fragment key={`${path}-${index}`}>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink asChild>
                                <Link to={path}>{label}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {index < arr.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
