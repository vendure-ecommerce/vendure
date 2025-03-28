import { DashboardBaseWidgetProps } from './base-widget.js';

export type DashboardWidgetInstance = {
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

export type DashboardWidgetDefinition = {
    id: string;
    name: string;
    component: React.ComponentType<DashboardBaseWidgetProps>;
    defaultSize: { w: number; h: number; x?: number; y?: number };
    minSize?: { w: number; h: number };
    maxSize?: { w: number; h: number };
};
