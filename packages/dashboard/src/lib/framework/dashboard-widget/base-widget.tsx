import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/vdb/components/ui/card.js';
import { DashboardBaseWidgetProps } from '@/vdb/framework/extension-api/types/index.js';
import { cn } from '@/vdb/lib/utils.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type WidgetDimensions = {
    width: number;
    height: number;
};

export const WidgetContentContext = createContext<WidgetDimensions>({ width: 0, height: 0 });

export const useWidgetDimensions = () => {
    const { t } = useLingui();
    const context = useContext(WidgetContentContext);
    if (!context) {
        throw new Error(t`useWidgetDimensions must be used within a DashboardBaseWidget`);
    }
    return context;
};

/**
 * @description
 * A wrapper component that should be used for any custom Insights page widgets.
 * This ensures that your custom widget has all the basic functionality needed to be
 * correctly rendered on the Insights page.
 *
 * @docsCategory extensions-api
 * @docsPage widgets
 * @since 3.3.0
 */
export function DashboardBaseWidget({
    id,
    config,
    children,
    title,
    description,
    actions,
}: DashboardBaseWidgetProps) {
    const headerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState<WidgetDimensions>({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (wrapperRef.current && contentRef.current) {
                const contentStyles = window.getComputedStyle(contentRef.current);
                const paddingTop = parseFloat(contentStyles.paddingTop);
                const paddingBottom = parseFloat(contentStyles.paddingBottom);
                const paddingLeft = parseFloat(contentStyles.paddingLeft);
                const paddingRight = parseFloat(contentStyles.paddingRight);

                const headerHeight = headerRef.current?.offsetHeight ?? 0;

                setDimensions({
                    width: wrapperRef.current.offsetWidth - paddingLeft - paddingRight,
                    height: wrapperRef.current.offsetHeight - paddingTop - paddingBottom - headerHeight,
                });
            }
        };

        updateDimensions();
        const observer = new ResizeObserver(updateDimensions);
        if (wrapperRef.current) {
            observer.observe(wrapperRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <Card
            ref={wrapperRef}
            key={`dashboard-widget-${id}`}
            className={cn('h-full w-full flex flex-col rounded-md', !title && 'pt-6')}
        >
            {title && (
                <CardHeader
                    ref={headerRef}
                    className={cn(
                        'flex flex-col lg:flex-row  items-start lg:items-center',
                        actions ? 'justify-between' : 'justify-start',
                    )}
                >
                    <div>
                        <CardTitle>
                            <Trans>{title}</Trans>
                        </CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </CardHeader>
            )}
            <CardContent ref={contentRef} className="grow">
                <WidgetContentContext.Provider value={dimensions}>{children}</WidgetContentContext.Provider>
            </CardContent>
        </Card>
    );
}
