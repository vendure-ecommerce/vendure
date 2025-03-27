import {
    DashboardActionBarItem,
    DashboardPageBlockDefinition,
} from '../extension-api/extension-api-types.js';

const dashboardActionBarItemRegistry = new Map<string, DashboardActionBarItem[]>();
const dashboardPageBlockRegistry = new Map<string, DashboardPageBlockDefinition[]>();

export function registerDashboardActionBarItem(item: DashboardActionBarItem) {
    const items = dashboardActionBarItemRegistry.get(item.locationId) ?? [];
    items.push(item);
    dashboardActionBarItemRegistry.set(item.locationId, items);
}

export function getDashboardActionBarItemRegistry() {
    return dashboardActionBarItemRegistry;
}

export function getDashboardActionBarItems(locationId: string) {
    return dashboardActionBarItemRegistry.get(locationId) ?? [];
}

export function registerDashboardPageBlock(block: DashboardPageBlockDefinition) {
    const blocks = dashboardPageBlockRegistry.get(block.location.pageId) ?? [];
    blocks.push(block);
    dashboardPageBlockRegistry.set(block.location.pageId, blocks);
}

export function getDashboardPageBlocks(pageId: string) {
    return dashboardPageBlockRegistry.get(pageId) ?? [];
}
