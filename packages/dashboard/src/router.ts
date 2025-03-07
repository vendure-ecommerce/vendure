import { routeTree } from '@/routeTree.gen.js';
import { createRouter } from '@tanstack/react-router';

export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        auth: undefined!, // This will be set after we wrap the app in an AuthProvider
    },
});

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
