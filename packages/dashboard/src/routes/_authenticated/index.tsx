import { Button } from '@/components/ui/button.js';
import { DashboardBaseWidgetProps } from '@/framework/dashboard-widget/base-widget.js';
import { LatestOrdersWidget } from '@/framework/dashboard-widget/latest-orders-widget/index.js';
import { MetricsWidget } from '@/framework/dashboard-widget/metrics-widget/index.js';
import { OrdersSummaryWidget } from '@/framework/dashboard-widget/orders-summary/index.js';
import { Page, PageActionBar, PageActionBarRight, PageTitle } from '@/framework/layout-engine/page-layout.js';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Responsive as ResponsiveGridLayout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Widget registry type definitions
export type WidgetDefinition = {
    id: string;
    name: string;
    component: React.ComponentType<DashboardBaseWidgetProps>;
    defaultSize: { w: number; h: number; x: number; y: number };
    minSize?: { w: number; h: number };
    maxSize?: { w: number; h: number };
};

// Widget instance in the dashboard
type WidgetInstance = {
    id: string;
    widgetId: string;
    layout: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    config?: Record<string, unknown>;
};

// Widget registry for plugin system
const widgetRegistry = new Map<string, WidgetDefinition>();

// Helper to register new widgets
export function registerWidget(widget: WidgetDefinition) {
    widgetRegistry.set(widget.id, widget);
}

export const Route = createFileRoute('/_authenticated/')({
    component: DashboardPage,
});

registerWidget({
    id: 'metrics-widget',
    name: 'Metrics Widget',
    component: MetricsWidget,
    defaultSize: { w: 12, h: 6, x: 0, y: 0 },
});

registerWidget({
    id: 'latest-orders-widget',
    name: 'Latest Orders Widget',
    component: LatestOrdersWidget,
    defaultSize: { w: 6, h: 7, x: 0, y: 0 },
});

registerWidget({
    id: 'orders-summary-widget',
    name: 'Orders Summary Widget',
    component: OrdersSummaryWidget,
    defaultSize: { w: 6, h: 3, x: 6, y: 0 },
});

function DashboardPage() {
    const [widgets, setWidgets] = useState<WidgetInstance[]>([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const initialWidgets = Array.from(widgetRegistry.entries()).map(([id, widget]) => ({
            id,
            widgetId: id,
            layout: widget.defaultSize,
        }));

        setWidgets(initialWidgets);
    }, []);

    const handleLayoutChange = (layout: ReactGridLayout.Layout[]) => {
        console.log({ layout });
        setWidgets(prev =>
            prev.map((widget, i) => ({
                ...widget,
                layout: layout[i],
            })),
        );
    };

    const ResponsiveReactGridLayout = useMemo(() => WidthProvider(ResponsiveGridLayout), []);

    return (
        <Page className="min-h-dvh w-full">
            <PageTitle>Dashboard</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <Button variant="outline" onClick={() => setEditMode(prev => !prev)}>
                        Edit Mode
                        {editMode ? (
                            <span className="text-xs text-destructive">ON</span>
                        ) : (
                            <span className="text-xs text-muted-foreground">OFF</span>
                        )}
                    </Button>
                </PageActionBarRight>
            </PageActionBar>
            <ResponsiveReactGridLayout
                className="h-full w-full"
                layouts={{ lg: widgets.map(w => ({ ...w.layout, i: w.id })) }}
                onLayoutChange={handleLayoutChange}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={100}
                isDraggable={editMode}
                isResizable={editMode}
                autoSize={true}
            >
                {widgets.map(widget => {
                    const definition = widgetRegistry.get(widget.widgetId);
                    if (!definition) return null;
                    const WidgetComponent = definition.component;

                    return (
                        <div key={widget.id}>
                            <WidgetComponent id={widget.id} config={widget.config} />
                        </div>
                    );
                })}
            </ResponsiveReactGridLayout>
        </Page>
    );
}
