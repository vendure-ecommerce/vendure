import { AppLayout } from '@/vdb/components/layout/app-layout.js';
import { AUTHENTICATED_ROUTE_PREFIX } from '@/vdb/constants.js';
import { useAuth } from '@/vdb/hooks/use-auth.js';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute(AUTHENTICATED_ROUTE_PREFIX)({
    beforeLoad: ({ context, location }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    loader: () => ({
        breadcrumb: 'Insights',
    }),
    component: AuthLayout,
});

function AuthLayout() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        navigate({
            to: '/login',
        });
        return <></>;
    }

    return <AppLayout />;
}
