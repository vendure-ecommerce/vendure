import { createFileRoute } from '@tanstack/react-router';
import { Responsive as ResponsiveGridLayout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { DashboardBaseWidgetProps } from '@/framework/dashboard-widget/base-widget.js';
import { MetricsWidget } from '@/framework/dashboard-widget/metrics-widget/index.js';

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

function DashboardPage() {
    // This would typically come from user preferences in your backend
    const [widgets, setWidgets] = useState<WidgetInstance[]>([]);

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
        <div className="min-h-dvh w-full">
            <ResponsiveReactGridLayout
                className="h-full w-full"
                layouts={{ lg: widgets.map(w => ({ ...w.layout, i: w.id })) }}
                onLayoutChange={handleLayoutChange}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={50}
                isDraggable
                isResizable
            >
                {widgets.map(widget => {
                    const definition = widgetRegistry.get(widget.widgetId);

                    console.log({ definition });
                    if (!definition) return null;

                    const WidgetComponent = definition.component;

                    return (
                        <div key={widget.id}>
                            <WidgetComponent id={widget.id} config={widget.config} />
                        </div>
                    );
                })}
            </ResponsiveReactGridLayout>
        </div>
    );
}
