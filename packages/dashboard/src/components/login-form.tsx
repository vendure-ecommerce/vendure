import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
import { Trans } from '@lingui/react/macro';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import * as React from 'react';

export interface LoginFormProps extends React.ComponentProps<'div'> {
    loginError?: string;
    isVerifying?: boolean;
    onFormSubmit?: (username: string, password: string) => void;
}

export function LoginForm({ className, onFormSubmit, isVerifying, loginError, ...props }: LoginFormProps) {
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const fieldValue = data.get('username');
        if (!fieldValue) return;
        const username = fieldValue.toString();
        const password = data.get('password')?.toString() || '';
        onFormSubmit?.(username, password);
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">
                                    <Trans>Welcome back!</Trans>
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your Acme Inc account
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">
                                    <Trans>User</Trans>
                                </Label>
                                <Input
                                    name="username"
                                    id="username"
                                    type="username"
                                    placeholder="Username or email address"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">
                                        <Trans>Password</Trans>
                                    </Label>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input name="password" id="password" type="password" required />
                            </div>
                            {loginError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{loginError}</AlertDescription>
                                </Alert>
                            )}
                            {isVerifying ? (
                                <Button disabled>
                                    <Loader2 className="animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            )}
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{' '}
                                <a href="#" className="underline underline-offset-4">
                                    Sign up
                                </a>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholder.svg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
