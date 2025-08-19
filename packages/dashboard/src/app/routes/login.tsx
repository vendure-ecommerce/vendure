import { LoginForm } from '@/vdb/components/login/login-form.js';
import { useAuth } from '@/vdb/hooks/use-auth.js';
import { useLoginExtensions } from '@/vdb/framework/extension-api/use-login-extensions.js';
import { createFileRoute, Navigate, redirect, useRouterState } from '@tanstack/react-router';
import { z } from 'zod';

const fallback = '/' as const;

export const Route = createFileRoute('/login')({
    validateSearch: z.object({
        redirect: z.string().optional().catch(''),
    }),
    beforeLoad: ({ context, search }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({ to: search.redirect || fallback });
        }
    },
    component: LoginPage,
});

function LoginPage() {
    const auth = useAuth();
    const isLoading = useRouterState({ select: s => s.isLoading });
    const navigate = Route.useNavigate();
    const search = Route.useSearch();
    const loginExtensions = useLoginExtensions();

    const onFormSubmit = (username: string, password: string) => {
        auth.login(username, password, () => {
            navigate({ to: search.redirect || fallback });
        });
    };

    if (auth.isAuthenticated) {
        return <Navigate to={search.redirect || fallback} />;
    }

    const isVerifying = isLoading || auth.status === 'verifying';

    // If overrideForm is provided, use it instead of the default LoginForm
    if (loginExtensions.overrideForm) {
        return (<loginExtensions.overrideForm.component />);
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm
                    onFormSubmit={onFormSubmit}
                    isVerifying={isVerifying}
                    loginError={auth.authenticationError}
                />
            </div>
        </div>
    );
}
