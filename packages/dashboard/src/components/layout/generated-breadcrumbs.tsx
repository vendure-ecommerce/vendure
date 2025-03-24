import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.js';
import { Link, useRouterState } from '@tanstack/react-router';
import * as React from 'react';
import { Fragment } from 'react';

export interface BreadcrumbItem {
    label: string | React.ReactNode;
    path: string;
}

export type BreadcrumbShorthand = string;

export type PageBreadcrumb = BreadcrumbItem | BreadcrumbShorthand;

export function GeneratedBreadcrumbs() {
    const matches = useRouterState({ select: s => s.matches });
    const breadcrumbs: BreadcrumbItem[] = matches
        .filter(match => match.loaderData?.breadcrumb)
        .map(({ pathname, loaderData }) => {
            if (typeof loaderData.breadcrumb === 'string') {
                return {
                    label: loaderData.breadcrumb,
                    path: pathname,
                };
            }
            if (Array.isArray(loaderData.breadcrumb)) {
                return loaderData.breadcrumb.map((breadcrumb: PageBreadcrumb) => {
                    if (typeof breadcrumb === 'string') {
                        return {
                            label: breadcrumb,
                            path: pathname,
                        };
                    } else if (React.isValidElement(breadcrumb)) {
                        return {
                            label: breadcrumb,
                            path: pathname,
                        };
                    } else {
                        return {
                            label: breadcrumb.label,
                            path: breadcrumb.path,
                        };
                    }
                });
            }
            if (typeof loaderData.breadcrumb === 'function') {
                return {
                    label: loaderData.breadcrumb(),
                    path: pathname,
                };
            }
            if (React.isValidElement(loaderData.breadcrumb)) {
                return {
                    label: loaderData.breadcrumb,
                    path: pathname,
                };
            }
        })
        .flat();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map(({ label, path }, index, arr) => (
                    <Fragment key={index}>
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
