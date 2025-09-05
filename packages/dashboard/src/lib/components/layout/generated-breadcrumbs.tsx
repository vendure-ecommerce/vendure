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
import type { NavMenuItem, NavMenuSection } from '@/vdb/framework/nav-menu/nav-menu-extensions.js';

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
    const navMenuConfig = getNavMenuConfig();
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

    const pathMatches = (cleanPath: string, rawUrl?: string): boolean => {
        if (!rawUrl) return false;
        const strip = (p: string) => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p);
        const p = strip(cleanPath);
        const u = strip(rawUrl);
        return p === u || p.startsWith(`${u}/`);
    };

    const checkSectionItems = (
        section: NavMenuSection | NavMenuItem,
        cleanPath: string,
    ): BreadcrumbPair | undefined => {
        if (!('items' in section) || !Array.isArray(section.items)) {
            return undefined;
        }

        for (const item of section.items) {
            if (!item?.url) continue;
            if (pathMatches(cleanPath, item.url)) {
                return { label: section.title, path: item.url };
            }
        }
        return undefined;
    };

    const checkDirectSection = (
        section: NavMenuSection | NavMenuItem,
        cleanPath: string,
    ): BreadcrumbPair | undefined => {
        if ('url' in section && section.url && pathMatches(cleanPath, section.url)) {
            return { label: section.title, path: section.url };
        }
        return undefined;
    };

    const findSectionCrumb = (path: string): BreadcrumbPair | undefined => {
        const cleanPath = normalizePath(path);
        const sections: Array<NavMenuSection | NavMenuItem> = navMenuConfig?.sections ?? [];
        if (sections.length === 0) return undefined;

        for (const section of sections) {
            const result = checkSectionItems(section, cleanPath) || checkDirectSection(section, cleanPath);
            if (result) {
                return result;
            }
        }
        return undefined;
    };

    const sectionCrumb = React.useMemo(
        () => findSectionCrumb(currentPath),
        [currentPath, basePath, navMenuConfig],
    );
    const breadcrumbs: BreadcrumbPair[] = React.useMemo(() => {
        const arr = sectionCrumb ? [sectionCrumb, ...pageCrumbs] : pageCrumbs;
        return arr.filter((c, i, self) =>
            self.findIndex(x => x.path === c.path && x.label === c.label) === i,
        );
    }, [sectionCrumb, pageCrumbs]);
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
