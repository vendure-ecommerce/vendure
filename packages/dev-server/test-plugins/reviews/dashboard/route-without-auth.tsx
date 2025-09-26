import { DashboardRouteDefinition } from '@/vdb/framework/extension-api/types';

export const routeWithoutAuth: DashboardRouteDefinition = {
    component: () => {
        return <div>Hello from without auth!</div>;
    },
    path: '/without-auth',
    authenticated: false,
};
