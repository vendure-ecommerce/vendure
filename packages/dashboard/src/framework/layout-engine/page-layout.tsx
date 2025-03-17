import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.js";
import { cn } from '@/lib/utils.js';
import React from 'react';

export type PageBlockProps = {
    children: React.ReactNode;
    /** Which column this block should appear in */
    column: 'main' | 'side';
    title?: string;
    description?: string;
    className?: string;
};

export type PageLayoutProps = {
    children: React.ReactNode;
    className?: string;
};

function isPageBlock(child: unknown): child is React.ReactElement<PageBlockProps> {
    return React.isValidElement(child) && 'column' in (child as React.ReactElement<PageBlockProps>).props;
}

export function PageLayout({ children, className }: PageLayoutProps) {
    // Separate blocks into categories
    const childArray = React.Children.toArray(children);
    const mainBlocks = childArray.filter(child => 
        isPageBlock(child) && child.props.column === 'main'
    );
    const sideBlocks = childArray.filter(child => 
        isPageBlock(child) && child.props.column === 'side'
    );

    return (
        <div className={cn('w-full space-y-4', className)}>
            {/* Mobile: Natural DOM order */}
            <div className="md:hidden space-y-4">
                {children}
            </div>

            {/* Desktop: Two-column layout */}
            <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-4 md:gap-4">
                <div className="md:col-span-3 space-y-4">
                    {mainBlocks}
                </div>
                <div className="md:col-span-2 lg:col-span-1 space-y-4">
                    {sideBlocks}
                </div>
            </div>
        </div>
    );
}

export function Page({ children }: { children: React.ReactNode }) {
    return (
        <div className="m-4">
            {children}
        </div>
    );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="text-2xl font-bold mb-4">{children}</h1>
    );
}

export function PageActionBar({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-between">
            {children}
        </div>
    );
}

export function PageBlock({ children, title, description }: PageBlockProps) {
    return (
        <Card className="w-full">
            {title || description ? (
                <CardHeader>
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            ) : null}
            <CardContent className={!title ? 'pt-6' : ''}>{children}</CardContent>
        </Card>
    );
} 
