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

    const rawCrumbs: BreadcrumbPair[] = React.useMemo(() => {
        return matches
            .filter(match => match.loaderData?.breadcrumb)
            .flatMap(({ pathname, loaderData }) => {
                if (typeof loaderData.breadcrumb === 'string') {
                    return [{ label: loaderData.breadcrumb, path: pathname }];
                }
                if (Array.isArray(loaderData.breadcrumb)) {
                    return loaderData.breadcrumb.map((breadcrumb: PageBreadcrumb) => {
                        if (typeof breadcrumb === 'string') {
                            return { label: breadcrumb, path: pathname };
                        } else if (React.isValidElement(breadcrumb)) {
                            return { label: breadcrumb, path: pathname };
                        } else {
                            return { label: breadcrumb.label, path: breadcrumb.path };
                        }
                    });
                }
                if (typeof loaderData.breadcrumb === 'function') {
                    return [{ label: loaderData.breadcrumb(), path: pathname }];
                }
                if (React.isValidElement(loaderData.breadcrumb)) {
                    return [{ label: loaderData.breadcrumb, path: pathname }];
                }
                return [];
            });
    }, [matches]);

    const isBaseRoute = (p: string) => p === basePath || p === `${basePath}/`;
    const pageCrumbs: BreadcrumbPair[] = rawCrumbs.filter(c => !isBaseRoute(c.path));

    const findSectionCrumb = (path: string): BreadcrumbPair | undefined => {
        const normalizedPath = basePath && path.startsWith(basePath) ? path.slice(basePath.length) : path;
        const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
        for (const section of navMenuConfig.sections as Array<NavMenuSection | NavMenuItem>) {
            if ('items' in section && Array.isArray(section.items)) {
                for (const item of section.items as NavMenuItem[]) {
                    if (cleanPath === item.url || cleanPath.startsWith(item.url + '/')) {
                        return { label: section.title, path: item.url };
                    }
                }
            } else if ('url' in section && section.url) {
                if (cleanPath === section.url || cleanPath.startsWith(section.url + '/')) {
                    return { label: section.title, path: section.url };
                }
            }
        }
        return undefined;
    };

    const sectionCrumb = React.useMemo(() => findSectionCrumb(currentPath), [currentPath, navMenuConfig, basePath]);
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
