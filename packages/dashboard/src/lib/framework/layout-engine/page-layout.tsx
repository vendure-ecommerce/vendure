import { CustomFieldsForm } from '@/components/shared/custom-fields-form.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Form } from '@/components/ui/form.js';
import { useCustomFieldConfig } from '@/hooks/use-custom-field-config.js';
import { usePage } from '@/hooks/use-page.js';
import { cn } from '@/lib/utils.js';
import { NavigationConfirmation } from '@/components/shared/navigation-confirmation.js';
import { useMediaQuery } from '@uidotdev/usehooks';
import React, { ComponentProps, createContext } from 'react';
import { Control, UseFormReturn } from 'react-hook-form';

import { DashboardActionBarItem } from '../extension-api/extension-api-types.js';

import { getDashboardActionBarItems, getDashboardPageBlocks } from './layout-extensions.js';
import { LocationWrapper } from './location-wrapper.js';

export interface PageProps extends ComponentProps<'div'> {
    pageId?: string;
    entity?: any;
    form?: UseFormReturn<any>;
    submitHandler?: any;
}

export const PageContext = createContext<PageContextValue | undefined>(undefined);

export function Page({ children, pageId, entity, form, submitHandler, ...props }: PageProps) {
    const childArray = React.Children.toArray(children);

    const pageTitle = childArray.find(child => React.isValidElement(child) && child.type === PageTitle);
    const pageActionBar = childArray.find(
        child => isOfType(child, PageActionBar),
    );

    const pageContent = childArray.filter(
        child => !isOfType(child, PageTitle) && !isOfType(child, PageActionBar),
    );

    const pageHeader = (
        <div className="flex items-center justify-between">
            {pageTitle}
            {pageActionBar}
        </div>
    );

    return (
        <PageContext.Provider value={{ pageId, form, entity }}>
            <PageContent 
                pageHeader={pageHeader} 
                pageContent={pageContent} 
                form={form}
                submitHandler={submitHandler}
                className={props.className}
                {...props}
            />
        </PageContext.Provider>
    );
}

function PageContent({ pageHeader, pageContent, form, submitHandler, ...props }: {
    pageHeader: React.ReactElement;
    pageContent: React.ReactElement;
    form?: UseFormReturn<any>;
    submitHandler?: any;
    className?: string;
}) {
    return (
        <div className={cn('m-4', props.className)} {...props}>
            <LocationWrapper>
                <PageContentWithOptionalForm 
                    pageHeader={pageHeader} 
                    pageContent={pageContent} 
                    form={form}
                    submitHandler={submitHandler} 
                />
            </LocationWrapper>
        </div>
    );
}

export function PageContentWithOptionalForm({ form, pageHeader, pageContent, submitHandler }: {
    form?: UseFormReturn<any>;
    pageHeader: React.ReactElement
    pageContent: React.ReactElement;
    submitHandler?: any;
}) {
    return form ? (
        <Form {...form}>
            <NavigationConfirmation form={form} />
            <form onSubmit={submitHandler} className="space-y-4">
                {pageHeader}
                {pageContent}
            </form>
        </Form>
    ) : (
        <div className="space-y-4">
            {pageHeader}
            {pageContent}
        </div>
    );
}

export type PageLayoutProps = {
    children: React.ReactNode;
    className?: string;
};

function isPageBlock(child: unknown): child is React.ReactElement<PageBlockProps> {
    if (!child) {
        return false;
    }
    if (!React.isValidElement(child)) {
        return false;
    }
    const props = (child as React.ReactElement<PageBlockProps>).props;
    const hasColumn = 'column' in props;
    const hasBlockId = 'blockId' in props;
    return hasColumn || hasBlockId;
}

export function PageLayout({ children, className }: PageLayoutProps) {
    const page = usePage();
    const isDesktop = useMediaQuery('only screen and (min-width : 769px)');
    // Separate blocks into categories
    const childArray: React.ReactElement<PageBlockProps>[] = [];
    const extensionBlocks = getDashboardPageBlocks(page.pageId ?? '');
    React.Children.forEach(children, child => {
        if (isPageBlock(child)) {
            childArray.push(child);
        }
        // check for a React Fragment
        if (React.isValidElement(child) && child.type === React.Fragment) {
            React.Children.forEach((child as React.ReactElement<PageBlockProps>).props.children, child => {
                if (isPageBlock(child)) {
                    childArray.push(child);
                }
            });
        }
    });

    const finalChildArray: React.ReactElement<PageBlockProps>[] = [];
    for (const childBlock of childArray) {
        if (childBlock) {
            const blockId =
                childBlock.props.blockId ??
                (isOfType(childBlock, CustomFieldsPageBlock) ? 'custom-fields' : undefined);
            const extensionBlock = extensionBlocks.find(block => block.location.position.blockId === blockId);
            if (extensionBlock) {
                const ExtensionBlock = (
                    <PageBlock
                        column={extensionBlock.location.column}
                        blockId={extensionBlock.id}
                        title={extensionBlock.title}
                    >
                        {<extensionBlock.component context={page} />}
                    </PageBlock>
                );
                if (extensionBlock.location.position.order === 'before') {
                    finalChildArray.push(ExtensionBlock, childBlock);
                } else if (extensionBlock.location.position.order === 'after') {
                    finalChildArray.push(childBlock, ExtensionBlock);
                } else if (extensionBlock.location.position.order === 'replace') {
                    finalChildArray.push(ExtensionBlock);
                }
            } else {
                finalChildArray.push(childBlock);
            }
        }
    }

    const fullWidthBlocks = finalChildArray.filter(
        child => isPageBlock(child) && isOfType(child, FullWidthPageBlock),
    );
    const mainBlocks = finalChildArray.filter(child => isPageBlock(child) && child.props.column === 'main');
    const sideBlocks = finalChildArray.filter(child => isPageBlock(child) && child.props.column === 'side');

    return (
        <div className={cn('w-full space-y-4', className)}>
            {isDesktop ? (
                <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-4 md:gap-4">
                    {fullWidthBlocks.length > 0 && (
                        <div className="md:col-span-5 space-y-4">{fullWidthBlocks}</div>
                    )}
                    <div className="md:col-span-3 space-y-4">{mainBlocks}</div>
                    <div className="md:col-span-2 lg:col-span-1 space-y-4">{sideBlocks}</div>
                </div>
            ) : (
                <div className="md:hidden space-y-4">{children}</div>
            )}
        </div>
    );
}

export function DetailFormGrid({ children }: { children: React.ReactNode }) {
    return <div className="md:grid md:grid-cols-2 gap-4 items-start mb-4">{children}</div>;
}

export interface PageContextValue {
    pageId?: string;
    entity?: any;
    form?: UseFormReturn<any>;
}

export function PageTitle({ children }: { children: React.ReactNode }) {
    return <h1 className="text-2xl font-semibold">{children}</h1>;
}

export function PageActionBar({ children }: { children: React.ReactNode }) {
    let childArray = React.Children.toArray(children);

    const leftContent = childArray.filter(
        child => isOfType(child, PageActionBarLeft),
    );
    const rightContent = childArray.filter(
        child => isOfType(child, PageActionBarRight),
    );

    return (
        <div className={cn('flex gap-2', leftContent.length > 0 ? 'justify-between' : 'justify-end')}>
            {leftContent.length > 0 && <div className="flex justify-start gap-2">{leftContent}</div>}
            {rightContent.length > 0 && <div className="flex justify-end gap-2">{rightContent}</div>}
        </div>
    );
}

export function PageActionBarLeft({ children }: { children: React.ReactNode }) {
    return <div className="flex justify-start gap-2">{children}</div>;
}

export function PageActionBarRight({ children }: { children: React.ReactNode }) {
    const page = usePage();
    const actionBarItems = page.pageId ? getDashboardActionBarItems(page.pageId) : [];
    return (
        <div className="flex justify-end gap-2">
            {actionBarItems.map((item, index) => (
                <PageActionBarItem key={index} item={item} page={page} />
            ))}
            {children}
        </div>
    );
}

function PageActionBarItem({ item, page }: { item: DashboardActionBarItem; page: PageContextValue }) {
    return (
        <PermissionGuard requires={item.requiresPermission ?? []}>
            <item.component context={page} />
        </PermissionGuard>
    );
}

export type PageBlockProps = {
    children?: React.ReactNode;
    /** Which column this block should appear in */
    column: 'main' | 'side';
    blockId?: string;
    title?: React.ReactNode | string;
    description?: React.ReactNode | string;
    className?: string;
};

export function PageBlock({ children, title, description, className, blockId }: PageBlockProps) {
    return (
        <LocationWrapper blockId={blockId}>
            <Card className={cn('w-full', className)}>
                {title || description ? (
                    <CardHeader>
                        {title && <CardTitle>{title}</CardTitle>}
                        {description && <CardDescription>{description}</CardDescription>}
                    </CardHeader>
                ) : null}
                <CardContent className={cn(!title ? 'pt-6' : '')}>{children}</CardContent>
            </Card>
        </LocationWrapper>
    );
}

export function FullWidthPageBlock({
                                       children,
                                       className,
                                       blockId,
                                   }: Pick<PageBlockProps, 'children' | 'className' | 'blockId'>) {
    return (
        <LocationWrapper blockId={blockId}>
            <div className={cn('w-full', className)}>{children}</div>
        </LocationWrapper>
    );
}

export function CustomFieldsPageBlock({
                                          column,
                                          entityType,
                                          control,
                                      }: {
    column: 'main' | 'side';
    entityType: string;
    control: Control<any, any>;
}) {
    const customFieldConfig = useCustomFieldConfig(entityType);
    if (!customFieldConfig || customFieldConfig.length === 0) {
        return null;
    }
    return (
        <PageBlock column={column} blockId="custom-fields">
            <CustomFieldsForm entityType={entityType} control={control} />
        </PageBlock>
    );
}

/**
 * @description
 * This compares the type of a React component to a given type.
 * It is safer than a simple `el === Component` check, as it also works in the context of
 * the Vite build where the component is not the same reference.
 */
export function isOfType(el: unknown, type: React.FunctionComponent<any>): boolean {
    if (React.isValidElement(el)) {
        const elTypeName = typeof el.type === 'string' ? el.type : (el.type as React.FunctionComponent).name;
        return elTypeName === type.name;
    }
    return false;
}
