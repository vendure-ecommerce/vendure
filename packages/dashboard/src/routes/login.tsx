import { useAuth } from '@/auth.js';
import { LoginForm } from '@/components/login-form';
import * as React from 'react';
import { createFileRoute, redirect, useRouter, useRouterState } from '@tanstack/react-router';
import { z } from 'zod';

const fallback = '/dashboard' as const;

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

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function LoginPage() {
    const auth = useAuth();
    const router = useRouter();
    const isLoading = useRouterState({ select: s => s.isLoading });
    const navigate = Route.useNavigate();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const search = Route.useSearch();

    const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true);
        try {
            evt.preventDefault();
            const data = new FormData(evt.currentTarget);
            const fieldValue = data.get('email');
            if (!fieldValue) return;
            const username = fieldValue.toString();
            await auth.login(username);

            await router.invalidate();

            // This is just a hack being used to wait for the auth state to update
            // in a real app, you'd want to use a more robust solution
            await sleep(1);

            await navigate({ to: search.redirect || fallback });
        } catch (error) {
            console.error('Error logging in: ', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoggingIn = isLoading || isSubmitting;
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm onFormSubmit={onFormSubmit} />
            </div>
        </div>
    );
}
