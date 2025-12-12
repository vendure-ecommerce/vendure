import { CustomFieldsForm } from '@/vdb/components/shared/custom-fields-form.js';
import { NavigationConfirmation } from '@/vdb/components/shared/navigation-confirmation.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/vdb/components/ui/card.js';
import { Form } from '@/vdb/components/ui/form.js';
import { useCustomFieldConfig } from '@/vdb/hooks/use-custom-field-config.js';
import { usePage } from '@/vdb/hooks/use-page.js';
import { cn } from '@/vdb/lib/utils.js';
import { useCopyToClipboard, useMediaQuery } from '@uidotdev/usehooks';
import { CheckIcon, CopyIcon, EllipsisVerticalIcon, InfoIcon } from 'lucide-react';
import React, { ComponentProps, useMemo, useState } from 'react';
import { Control, UseFormReturn } from 'react-hook-form';

import { ActionBarItemPosition, DashboardActionBarItem } from '../extension-api/types/layout.js';
import { ActionBarItem, ActionBarItemProps, ActionBarItemWrapper } from './action-bar-item-wrapper.js';

import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { PageBlockContext } from '@/vdb/framework/layout-engine/page-block-provider.js';
import { PageContext, PageContextValue } from '@/vdb/framework/layout-engine/page-provider.js';
import { Trans } from '@lingui/react/macro';
import { getDashboardActionBarItems, getDashboardPageBlocks } from './layout-extensions.js';
import { LocationWrapper } from './location-wrapper.js';

/**
 * @description
 * The props used to configure the {@link Page} component.
 *
 * @docsCategory page-layout
 * @docsPage Page
 * @since 3.3.0
 */
export interface PageProps extends ComponentProps<'div'> {
    /**
     * @description
     * A string identifier for the page, e.g. "product-list", "review-detail", etc.
     */
    pageId?: string;

    entity?: any;
    form?: UseFormReturn<any>;
    submitHandler?: any;
}

/**
 * @description
 * This component should be used to wrap _all_ pages in the dashboard. It provides
 * a consistent layout as well as a context for the slot-based PageBlock system.
 *
 * The typical hierarchy of a page is as follows:
 * - `Page`
 *  - {@link PageTitle}
 *  - {@link PageActionBar}
 *  - {@link PageLayout}
 *
 * @example
 * ```tsx
 * import { Page, PageTitle, PageActionBar, PageLayout, PageBlock, Button } from '\@vendure/dashboard';
 *
 * const pageId = 'my-page';
 *
 * export function MyPage() {
 *  return (
 *    <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
 *      <PageTitle>My Page</PageTitle>
 *      <PageActionBar>
 *        <PageActionBarRight>
 *          <Button>Save</Button>
 *        </PageActionBarRight>
 *      </PageActionBar>
 *      <PageLayout>
 *        <PageBlock column="main" blockId="my-block">
 *          <div>My Block</div>
 *        </PageBlock>
 *      </PageLayout>
 *    </Page>
 *  )
 * }
 * ```
 *
 * @docsCategory page-layout
 * @docsPage Page
 * @docsWeight 0
 * @since 3.3.0
 */
export function Page({ children, pageId, entity, form, submitHandler, ...props }: Readonly<PageProps>) {
    const childArray = React.Children.toArray(children);

    const pageTitle = childArray.find(child => isOfType(child, PageTitle));
    const pageActionBar = childArray.find(child => isOfType(child, PageActionBar));

    const pageContent = childArray.filter(
        child => !isOfType(child, PageTitle) && !isOfType(child, PageActionBar),
    );

    const pageHeader = (
        <div className="flex items-center justify-between">
            {pageTitle ?? <div />}
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
                {...props}
            />
        </PageContext.Provider>
    );
}

function PageContent({
    pageHeader,
    pageContent,
    form,
    submitHandler,
    ...props
}: {
    pageHeader: React.ReactNode;
    pageContent: React.ReactNode;
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

export function PageContentWithOptionalForm({
    form,
    pageHeader,
    pageContent,
    submitHandler,
}: {
    form?: UseFormReturn<any>;
    pageHeader: React.ReactNode;
    pageContent: React.ReactNode;
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

/**
 * @description
 * **Status: Developer Preview**
 *
 * @docsCategory page-layout
 * @docsPage PageLayout
 * @since 3.3.0
 */
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

/**
 * @description *
 * This component governs the layout of the contents of a {@link Page} component.
 * It should contain all the {@link PageBlock} components that are to be displayed on the page.
 *
 * @docsCategory page-layout
 * @docsPage PageLayout
 * @docsWeight 0
 * @since 3.3.0
 */
export function PageLayout({ children, className }: Readonly<PageLayoutProps>) {
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

            // Get all extension blocks with the same position blockId
            const matchingExtensionBlocks = extensionBlocks.filter(
                block => block.location.position.blockId === blockId,
            );

            // sort the blocks to make sure we have the correct order
            const arrangedExtensionBlocks = matchingExtensionBlocks.sort((a, b) => {
                const orderPriority = { before: 1, replace: 2, after: 3 };
                return orderPriority[a.location.position.order] - orderPriority[b.location.position.order];
            });

            const replacementBlockExists = arrangedExtensionBlocks.some(
                block => block.location.position.order === 'replace',
            );

            let childBlockInserted = false;
            if (matchingExtensionBlocks.length > 0) {
                for (const extensionBlock of arrangedExtensionBlocks) {
                    let extensionBlockShouldRender = true;
                    if (typeof extensionBlock?.shouldRender === 'function') {
                        extensionBlockShouldRender = extensionBlock.shouldRender(page);
                    }

                    // Insert child block before the first non-"before" block
                    if (
                        !childBlockInserted &&
                        !replacementBlockExists &&
                        extensionBlock.location.position.order !== 'before'
                    ) {
                        finalChildArray.push(childBlock);
                        childBlockInserted = true;
                    }

                    const isFullWidth = extensionBlock.location.column === 'full';
                    const BlockComponent = isFullWidth ? FullWidthPageBlock : PageBlock;

                    const ExtensionBlock =
                        extensionBlock.component && extensionBlockShouldRender ? (
                            <BlockComponent
                                key={extensionBlock.id}
                                column={extensionBlock.location.column}
                                blockId={extensionBlock.id}
                                title={extensionBlock.title}
                            >
                                {<extensionBlock.component context={page} />}
                            </BlockComponent>
                        ) : undefined;

                    if (extensionBlockShouldRender && ExtensionBlock) {
                        finalChildArray.push(ExtensionBlock);
                    }
                }

                // If all blocks were "before", insert child block at the end
                if (!childBlockInserted && !replacementBlockExists) {
                    finalChildArray.push(childBlock);
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
        <div className={cn('w-full space-y-4', className, '@container/layout')}>
            {isDesktop ? (
                <div className="grid grid-cols-1 gap-4 @3xl/layout:grid-cols-4">
                    {fullWidthBlocks.length > 0 && (
                        <div className="@md/layout:col-span-5 space-y-4">{fullWidthBlocks}</div>
                    )}
                    <div className="@3xl/layout:col-span-3 space-y-4">{mainBlocks}</div>
                    <div className="@3xl/layout:col-span-1 space-y-4">{sideBlocks}</div>
                </div>
            ) : (
                <div className="space-y-4">{finalChildArray}</div>
            )}
        </div>
    );
}

export function DetailFormGrid({ children }: Readonly<{ children: React.ReactNode }>) {
    return <div className="grid @md:grid-cols-2 gap-6 items-start mb-6">{children}</div>;
}

/**
 * @description
 * A component for displaying the title of a page. This should be used inside the {@link Page} component.
 *
 * @docsCategory page-layout
 * @docsPage PageTitle
 * @since 3.3.0
 */
export function PageTitle({ children }: Readonly<{ children: React.ReactNode }>) {
    return <h1 className="text-2xl font-semibold">{children}</h1>;
}

/**
 * @description *
 * A component for displaying the main actions for a page. This should be used inside the {@link Page} component.
 * It should be used in conjunction with the {@link PageActionBarLeft} and {@link PageActionBarRight} components
 * as direct children.
 *
 * @docsCategory page-layout
 * @docsPage PageActionBar
 * @docsWeight 0
 * @since 3.3.0
 */
export function PageActionBar({ children }: Readonly<{ children: React.ReactNode }>) {
    let childArray = React.Children.toArray(children);

    const leftContent = childArray.filter(child => isOfType(child, PageActionBarLeft));
    const rightContent = childArray.filter(child => isOfType(child, PageActionBarRight));

    return (
        <div className={cn('flex gap-2', leftContent.length > 0 ? 'justify-between' : 'justify-end')}>
            {leftContent.length > 0 && <div className="flex justify-start gap-2">{leftContent}</div>}
            {rightContent.length > 0 && <div className="flex justify-end gap-2">{rightContent}</div>}
        </div>
    );
}

/**
 * @description
 * The PageActionBarLeft component should be used to display the left content of the action bar.
 *
 * @docsCategory page-layout
 * @docsPage PageActionBar
 * @since 3.3.0
 */
export function PageActionBarLeft({ children }: Readonly<{ children: React.ReactNode }>) {
    return <div className="flex justify-start gap-2">{children}</div>;
}

type InlineDropdownItem = Omit<DashboardActionBarItem, 'type' | 'pageId'>;

/**
 * Checks if a React child is an ActionBarItem component.
 */
function isActionBarItem(child: unknown): child is React.ReactElement<ActionBarItemProps> {
    return React.isValidElement(child) && isOfType(child, ActionBarItem);
}

/**
 * Represents a merged action bar item that can be either inline (ActionBarItem child) or from an extension.
 * Used internally for sorting and rendering.
 */
type MergedActionBarItem =
    | { type: 'inline'; element: React.ReactElement<ActionBarItemProps> }
    | { type: 'extension'; item: DashboardActionBarItem };

/**
 * Merges inline ActionBarItem children with extension items, applying position-based ordering.
 * Uses the same priority sorting as page blocks: before=1, replace=2, after=3.
 */
function mergeAndSortActionBarItems(
    inlineElements: React.ReactElement<ActionBarItemProps>[],
    extensionItems: DashboardActionBarItem[],
): MergedActionBarItem[] {
    const result: MergedActionBarItem[] = [];

    // First, add extension items WITHOUT a position (they go first, preserving current behavior)
    const unpositionedExtensions = extensionItems.filter(ext => !ext.position);
    for (const ext of unpositionedExtensions) {
        result.push({ type: 'extension', item: ext });
    }

    // Process each inline element and find extension items targeting it
    for (const inlineElement of inlineElements) {
        const itemId = inlineElement.props.itemId;
        const matchingExtensions = extensionItems.filter(ext => ext.position?.itemId === itemId);

        // Sort by order priority: before=1, replace=2, after=3
        const sortedExtensions = matchingExtensions.sort((a, b) => {
            const orderPriority: Record<ActionBarItemPosition['order'], number> = {
                before: 1,
                replace: 2,
                after: 3,
            };
            return orderPriority[a.position!.order] - orderPriority[b.position!.order];
        });

        const hasReplacement = sortedExtensions.some(ext => ext.position?.order === 'replace');

        let inlineInserted = false;
        for (const ext of sortedExtensions) {
            // Insert inline element before the first non-"before" extension (if not replaced)
            if (!inlineInserted && !hasReplacement && ext.position?.order !== 'before') {
                result.push({ type: 'inline', element: inlineElement });
                inlineInserted = true;
            }
            result.push({ type: 'extension', item: ext });
        }

        // If all extensions were "before" or there were no extensions, add inline at the end
        if (!inlineInserted && !hasReplacement) {
            result.push({ type: 'inline', element: inlineElement });
        }
    }

    return result;
}

function EntityInfoDropdown({ entity }: Readonly<{ entity: any }>) {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [, copy] = useCopyToClipboard();

    const handleCopy = async (text: string, field: string) => {
        await copy(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (!entity || !entity.id) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <InfoIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                    <Trans>Entity Information</Trans>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-3 py-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">ID</span>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-mono">{entity.id}</span>
                            <button
                                onClick={() => handleCopy(entity.id, 'id')}
                                className="p-1 hover:bg-muted rounded-sm transition-colors"
                            >
                                {copiedField === 'id' ? (
                                    <CheckIcon className="h-3 w-3 text-green-500" />
                                ) : (
                                    <CopyIcon className="h-3 w-3" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                {entity.createdAt && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="px-3 py-2">
                            <div className="text-sm">
                                <div className="font-medium text-muted-foreground">
                                    <Trans>Created</Trans>
                                </div>
                                <div className="text-xs">{formatDate(entity.createdAt)}</div>
                            </div>
                        </div>
                    </>
                )}
                {entity.updatedAt && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="px-3 py-2">
                            <div className="text-sm">
                                <div className="font-medium text-muted-foreground">
                                    <Trans>Updated</Trans>
                                </div>
                                <div className="text-xs">{formatDate(entity.updatedAt)}</div>
                            </div>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * @description
 * The PageActionBarRight component should be used to display the right content of the action bar.
 *
 * Children should be {@link ActionBarItem} components, each with a unique `itemId`. This allows
 * extensions to position their items relative to yours using `position.itemId` with
 * `'before'`, `'after'`, or `'replace'`.
 *
 * @example
 * ```tsx
 * <PageActionBarRight>
 *     <ActionBarItem itemId="save-button" requiresPermission={['UpdateProduct']}>
 *         <Button type="submit">Update</Button>
 *     </ActionBarItem>
 * </PageActionBarRight>
 * ```
 *
 * @docsCategory page-layout
 * @docsPage PageActionBar
 * @since 3.3.0
 */
export function PageActionBarRight({
    children,
    dropdownMenuItems,
}: Readonly<{
    /**
     * @description
     * ActionBarItem components that will be rendered in the action bar.
     * Each item should have a unique `itemId` for extension targeting.
     */
    children?: React.ReactNode;
    dropdownMenuItems?: InlineDropdownItem[];
}>) {
    const page = usePage();
    const actionBarItems = page.pageId ? getDashboardActionBarItems(page.pageId) : [];

    // Extract ActionBarItem children
    const actionBarItemChildren: React.ReactElement<ActionBarItemProps>[] = [];
    React.Children.forEach(children, child => {
        if (isActionBarItem(child)) {
            actionBarItemChildren.push(child);
        }
    });

    // Separate button items from dropdown items
    const extensionButtonItems = actionBarItems.filter(item => item.type !== 'dropdown');
    const actionBarDropdownItems = [
        ...(dropdownMenuItems ?? []).map(item => ({
            ...item,
            pageId: page.pageId ?? '',
            type: 'dropdown' as const,
        })),
        ...actionBarItems.filter(item => item.type === 'dropdown'),
    ];

    // Merge and sort inline items with extension items
    const mergedItems = mergeAndSortActionBarItems(actionBarItemChildren, extensionButtonItems);

    return (
        <div className="flex justify-end gap-2">
            {mergedItems.map((mergedItem, index) => {
                if (mergedItem.type === 'inline') {
                    // Render the ActionBarItem element directly (it handles its own dev-mode wrapper)
                    return React.cloneElement(mergedItem.element, {
                        key: `inline-${mergedItem.element.props.itemId}`,
                    });
                } else {
                    const extItem = mergedItem.item;
                    const itemId = extItem.id ?? `extension-${extItem.component.name || index}`;
                    return (
                        <ActionBarItemWrapper
                            key={`ext-${extItem.id ?? extItem.pageId}-${index}`}
                            itemId={itemId}
                        >
                            <PageActionBarItem item={extItem} page={page} />
                        </ActionBarItemWrapper>
                    );
                }
            })}
            {actionBarDropdownItems.length > 0 && (
                <PageActionBarDropdown items={actionBarDropdownItems} page={page} />
            )}
            <EntityInfoDropdown entity={page.entity} />
        </div>
    );
}

function PageActionBarItem({
    item,
    page,
}: Readonly<{ item: DashboardActionBarItem; page: PageContextValue }>) {
    return (
        <PermissionGuard requires={item.requiresPermission ?? []}>
            <item.component context={page} />
        </PermissionGuard>
    );
}

function PageActionBarDropdown({
    items,
    page,
}: Readonly<{ items: DashboardActionBarItem[]; page: PageContextValue }>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <EllipsisVerticalIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {items.map((item, index) => (
                    <PermissionGuard key={item.pageId + index} requires={item.requiresPermission ?? []}>
                        <item.component context={page} />
                    </PermissionGuard>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * @description
 * Props used to configure the {@link PageBlock} component.
 *
 * @docsCategory page-layout
 * @docsPage PageBlock
 * @since 3.3.0
 */
export type PageBlockProps = {
    /**
     * @description
     * The content of the block.
     */
    children?: React.ReactNode;
    /**
     * @description
     * Which column this block should appear in
     */
    column: 'main' | 'side';
    /**
     * @description
     * The ID of the block, e.g. "gift-cards" or "related-products".
     */
    blockId?: string;
    /**
     * @description
     * The title of the block, e.g. "Gift Cards" or "Related Products".
     */
    title?: React.ReactNode | string;
    /**
     * @description
     * An optional description of the block.
     */
    description?: React.ReactNode | string;
    /**
     * @description
     * An optional set of CSS classes to apply to the block.
     */
    className?: string;
};

/**
 * @description *
 * A component for displaying a block of content on a page. This should be used inside the {@link PageLayout} component.
 * It should be provided with a `column` prop to determine which column it should appear in, and a `blockId` prop
 * to identify the block.
 *
 * @example
 * ```tsx
 * <PageBlock column="main" blockId="my-block">
 *  <div>My Block</div>
 * </PageBlock>
 * ```
 *
 * @docsCategory page-layout
 * @docsPage PageBlock
 * @docsWeight 0
 * @since 3.3.0
 */
export function PageBlock({
    children,
    title,
    description,
    className,
    blockId,
    column,
}: Readonly<PageBlockProps>) {
    const contextValue = useMemo(
        () => ({
            blockId,
            title,
            description,
            column,
        }),
        [blockId, title, description, column],
    );
    return (
        <PageBlockContext.Provider value={contextValue}>
            <LocationWrapper>
                <Card className={cn('@container  w-full', className, 'animate-in fade-in duration-300')}>
                    {title || description ? (
                        <CardHeader>
                            {title && <CardTitle>{title}</CardTitle>}
                            {description && <CardDescription>{description}</CardDescription>}
                        </CardHeader>
                    ) : null}
                    <CardContent className={cn(!title ? 'pt-6' : '', 'overflow-auto')}>
                        {children}
                    </CardContent>
                </Card>
            </LocationWrapper>
        </PageBlockContext.Provider>
    );
}

/**
 * @description
 * **Status: Developer Preview**
 *
 * A component for displaying a block of content on a page that takes up the full width of the page.
 * This should be used inside the {@link PageLayout} component.
 *
 * @docsCategory components
 * @docsPage PageBlock
 * @since 3.3.0
 */
export function FullWidthPageBlock({
    children,
    className,
    blockId,
}: Readonly<Pick<PageBlockProps, 'children' | 'className' | 'blockId'>>) {
    const contextValue = useMemo(() => ({ blockId, column: 'main' as const }), [blockId]);
    return (
        <PageBlockContext.Provider value={contextValue}>
            <LocationWrapper>
                <div className={cn('w-full', className, 'animate-in fade-in duration-300')}>{children}</div>
            </LocationWrapper>
        </PageBlockContext.Provider>
    );
}

/**
 * @description *
 * A component for displaying an auto-generated form for custom fields on a page.
 * This is a special form of {@link PageBlock} that automatically generates
 * a form corresponding to the custom fields for the given entity type.
 *
 * @example
 * ```tsx
 * <CustomFieldsPageBlock column="main" entityType="Product" control={form.control} />
 * ```
 *
 * @docsCategory page-layout
 * @docsPage PageBlock
 * @since 3.3.0
 */
export function CustomFieldsPageBlock({
    column,
    entityType,
    control,
}: Readonly<{
    column: 'main' | 'side';
    entityType: string;
    control: Control<any, any>;
}>) {
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

// Re-export ActionBarItem for convenience alongside other page layout components
export { ActionBarItem } from './action-bar-item-wrapper.js';
export type { ActionBarItemProps } from './action-bar-item-wrapper.js';
