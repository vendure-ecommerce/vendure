import { CustomFieldsForm } from '@/components/shared/custom-fields-form.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Form } from '@/components/ui/form.js';
import { useCustomFieldConfig } from '@/hooks/use-custom-field-config.js';
import { usePage } from '@/hooks/use-page.js';
import { cn } from '@/lib/utils.js';
import { useMediaQuery } from '@uidotdev/usehooks';
import React, { ComponentProps, createContext, useState } from 'react';
import { Control, UseFormReturn } from 'react-hook-form';
import { DashboardActionBarItem } from '../extension-api/extension-api-types.js';
import { getDashboardActionBarItems, getDashboardPageBlocks } from './register.js';
import { LocationWrapper } from './location-wrapper.js';

export interface PageProps extends ComponentProps<'div'> {
    pageId?: string;
    entity?: any;
}

export const PageProvider = createContext<PageContext | undefined>(undefined);

export function Page({ children, pageId, entity, ...props }: PageProps) {
    const [form, setForm] = useState<UseFormReturn<any> | undefined>(undefined);
    return (
        <PageProvider value={{ pageId, form, setForm, entity }}>
            <LocationWrapper>
                <div className={cn('m-4', props.className)} {...props}>
                    {children}
                </div>
            </LocationWrapper>
        </PageProvider>
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
                (childBlock.type === CustomFieldsPageBlock ? 'custom-fields' : undefined);
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

    const fullWidthBlocks = finalChildArray.filter(child => isPageBlock(child) && child.type === FullWidthPageBlock);
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

export function PageDetailForm({
    children,
    form,
    submitHandler,
}: {
    children: React.ReactNode;
    form: UseFormReturn<any>;
    submitHandler: any;
}) {
    const page = usePage();
    if (!page.form && form) {
        page.setForm(form);
    }
    return (
        <Form {...form}>
            <form onSubmit={submitHandler} className="space-y-8">
                {children}
            </form>
        </Form>
    );
}

export function DetailFormGrid({ children }: { children: React.ReactNode }) {
    return <div className="md:grid md:grid-cols-2 gap-4 items-start mb-4">{children}</div>;
}

export interface PageContext {
    pageId?: string;
    entity?: any;
    form?: UseFormReturn<any>;
    setForm: (form: UseFormReturn<any>) => void;
}

export function PageTitle({ children }: { children: React.ReactNode }) {
    return <h1 className="text-2xl font-semibold mb-4">{children}</h1>;
}

export function PageActionBar({ children }: { children: React.ReactNode }) {
    let childArray = React.Children.toArray(children);
    // For some reason, sometimes the `children` prop is passed as this component itself, so we need to unwrap it
    // This is a bit of a hack, but it works
    if (childArray.length === 1 && (childArray[0] as React.ReactElement).type === PageActionBar) {
        childArray = React.Children.toArray((childArray[0] as any)?.props?.children);
    }
    const leftContent = childArray.filter(
        child => React.isValidElement(child) && (child.type as any)?.name === 'PageActionBarLeft',
    );
    const rightContent = childArray.filter(
        child => React.isValidElement(child) && (child.type as any)?.name === 'PageActionBarRight',
    );
    return (
        <div className="flex justify-between gap-2">
            <div className="flex justify-start gap-2">{leftContent}</div>
            <div className="flex justify-end gap-2">{rightContent}</div>
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

function PageActionBarItem({ item, page }: { item: DashboardActionBarItem; page: PageContext }) {
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

export function PageBlock({ children, title, description, borderless, className, blockId }: PageBlockProps) {
    return (
        <LocationWrapper blockId={blockId}>
            <Card className={cn('w-full', className)}>
                {title || description ? (
                    <CardHeader>
                        {title && <CardTitle>{title}</CardTitle>}
                        {description && <CardDescription>{description}</CardDescription>}
                    </CardHeader>
                ) : null}
                <CardContent className={cn(!title ? 'pt-6' : '', borderless && 'p-0')}>
                    {children}
                </CardContent>
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
