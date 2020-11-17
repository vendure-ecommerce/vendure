import { Injectable } from '@angular/core';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';

import { DashboardWidgetConfig } from './dashboard-widget-types';

/**
 * Registers a component to be used as a dashboard widget.
 */
@Injectable({
    providedIn: 'root',
})
export class DashboardWidgetService {
    private registry = new Map<string, DashboardWidgetConfig>();
    private layout: ReadonlyArray<string> = [];

    registerWidget(id: string, config: DashboardWidgetConfig) {
        if (this.registry.has(id)) {
            throw new Error(`A dashboard widget with the id "${id}" already exists`);
        }

        this.registry.set(id, config);
    }

    setDefaultLayout(ids: string[] | ReadonlyArray<string>) {
        this.layout = ids;
    }

    getDefaultLayout(): ReadonlyArray<string> {
        return this.layout;
    }

    getWidgets(): DashboardWidgetConfig[] {
        return this.layout
            .map(id => {
                const config = this.registry.get(id);
                if (!config) {
                    // tslint:disable-next-line:no-console
                    console.error(
                        `No dashboard widget was found with the id "${id}"\nAvailable ids: ${[
                            ...this.registry.keys(),
                        ]
                            .map(_id => `"${_id}"`)
                            .join(', ')}`,
                    );
                }
                return config;
            })
            .filter(notNullOrUndefined);
    }
}
