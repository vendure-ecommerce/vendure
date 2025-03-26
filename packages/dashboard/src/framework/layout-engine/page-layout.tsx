import { CustomFieldsForm } from '@/components/shared/custom-fields-form.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Form } from '@/components/ui/form.js';
import { useCustomFieldConfig } from '@/hooks/use-custom-field-config.js';
import { cn } from '@/lib/utils.js';
import React, { ComponentProps, PropsWithChildren } from 'react';
import { Control, UseFormReturn } from 'react-hook-form';
import { useMediaQuery } from '@uidotdev/usehooks';

export type PageBlockProps = {
    children: React.ReactNode;
    /** Which column this block should appear in */
    column: 'main' | 'side';
    title?: React.ReactNode | string;
    description?: React.ReactNode | string;
    className?: string;
    borderless?: boolean;
};

export type PageLayoutProps = {
    children: React.ReactNode;
    className?: string;
};

function isPageBlock(child: unknown): child is React.ReactElement<PageBlockProps> {
    return React.isValidElement(child) && 'column' in (child as React.ReactElement<PageBlockProps>).props;
}

export function PageLayout({ children, className }: PageLayoutProps) {
    const isDesktop = useMediaQuery('only screen and (min-width : 769px)');
    // Separate blocks into categories
    const childArray: React.ReactElement<PageBlockProps>[] = [];
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
    const mainBlocks = childArray.filter(child => isPageBlock(child) && child.props.column === 'main');
    const sideBlocks = childArray.filter(child => isPageBlock(child) && child.props.column === 'side');

    return (
        <div className={cn('w-full space-y-4', className)}>
            {isDesktop ? (
                <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-4 md:gap-4">
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

export function Page({ children, ...props }: PropsWithChildren<ComponentProps<'div'>>) {
    return (
        <div className={cn('m-4', props.className)} {...props}>
            {children}
        </div>
    );
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
    return <div className="flex justify-end gap-2">{children}</div>;
}

export function PageBlock({ children, title, description, borderless }: PageBlockProps) {
    return (
        <Card className={cn('w-full')}>
            {title || description ? (
                <CardHeader>
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            ) : null}
            <CardContent className={cn(!title ? 'pt-6' : '', borderless && 'p-0')}>{children}</CardContent>
        </Card>
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
        <PageBlock column={column}>
            <CustomFieldsForm entityType={entityType} control={control} />
        </PageBlock>
    );
}
