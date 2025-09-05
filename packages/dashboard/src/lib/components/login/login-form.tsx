import { Button } from '@/vdb/components/ui/button.js';
import { Card, CardContent } from '@/vdb/components/ui/card.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Trans } from '@/vdb/lib/trans.js';
import { cn } from '@/vdb/lib/utils.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { uiConfig } from 'virtual:vendure-ui-config';
import { z } from 'zod';
import { useLoginExtensions } from '../../framework/extension-api/use-login-extensions.js';
import { LogoMark } from '../shared/logo-mark.js';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form.js';
import { Separator } from '../ui/separator.js';

export interface LoginFormProps extends React.ComponentProps<'div'> {
    loginError?: string;
    isVerifying?: boolean;
    onFormSubmit?: (username: string, password: string) => void;
}

export type RemoteLoginImage = {
    urls: { regular: string };
    location: { name: string };
    user: { name: string; links: { html: string } };
};

const formSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

export function LoginForm({ className, onFormSubmit, isVerifying, loginError, ...props }: LoginFormProps) {
    const [remoteLoginImage, setRemoteLoginImage] = React.useState<RemoteLoginImage | null>(null);
    const loginExtensions = useLoginExtensions();

    React.useEffect(() => {
        if (!uiConfig.loginImageUrl) {
            fetch('https://login-image.vendure.io')
                .then(res => res.json())
                .then(data => setRemoteLoginImage(data));
        }
    }, []);

    React.useEffect(() => {
        if (loginError && !isVerifying) {
            toast.error(loginError);
        }
    }, [loginError, isVerifying]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    return (
        <div className={cn('flex flex-col gap-6 bg-sidebar', className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form
                            className="p-6 md:p-8 flex flex-col items-stretch justify-center"
                            onSubmit={form.handleSubmit(data => onFormSubmit?.(data.username, data.password))}
                        >
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-start  space-y-4">
                                    {loginExtensions.logo ? (
                                        <>
                                            <loginExtensions.logo.component />
                                            {loginExtensions.beforeForm && (
                                                <>
                                                    <loginExtensions.beforeForm.component />
                                                    <Separator className="w-full" />
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {!uiConfig.hideVendureBranding && (
                                                <LogoMark className="text-vendure-brand h-6 w-auto" />
                                            )}
                                            <div>
                                                <h1 className="text-2xl font-medium">
                                                    <Trans>Welcome back!</Trans>
                                                </h1>
                                                <p className="text-muted-foreground text-balance">
                                                    Login to your Vendure store
                                                </p>
                                            </div>
                                            {loginExtensions.beforeForm && (
                                                <>
                                                    <Separator className="w-full" />
                                                    <div className="w-full">
                                                        <loginExtensions.beforeForm.component />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="email" asChild>
                                                <Trans>Username</Trans>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Username or email address" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center">
                                                <FormLabel htmlFor="password" asChild>
                                                    <Trans>Password</Trans>
                                                </FormLabel>
                                                <a
                                                    tabIndex={-1}
                                                    href="#"
                                                    className="ml-auto text-sm underline-offset-2 hover:underline"
                                                >
                                                    Forgot your password?
                                                </a>
                                            </div>
                                            <FormControl>
                                                <Input {...field} type="password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isVerifying}>
                                    {isVerifying && (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            Please wait
                                        </>
                                    )}
                                    {!isVerifying && <span>Login</span>}
                                </Button>
                            </div>
                            {loginExtensions.afterForm && (
                                <>
                                    <Separator className="w-full my-4" />

                                    <loginExtensions.afterForm.component />
                                </>
                            )}
                        </form>
                    </Form>
                    {loginExtensions.loginImage ? (
                        <loginExtensions.loginImage.component />
                    ) : (
                        <div className="bg-muted relative hidden md:block lg:min-h-[500px]">
                            {remoteLoginImage && (
                                <>
                                    <img
                                        src={remoteLoginImage.urls.regular}
                                        alt="Image"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div className="absolute h-full w-full top-0 left-0 flex items-end justify-start bg-gradient-to-b from-transparent to-black/80 p-4 ">
                                        <div>
                                            <p className="text-lg font-medium text-white">
                                                {remoteLoginImage.location.name}
                                            </p>
                                            <p className="text-sm text-white/80">
                                                By
                                                <a
                                                    className="mx-1 underline"
                                                    href={remoteLoginImage.user.links.html}
                                                    target="_blank"
                                                >
                                                    {remoteLoginImage.user.name}
                                                </a>
                                                on Unsplash
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                            {uiConfig.loginImageUrl && (
                                <img
                                    src={uiConfig.loginImageUrl}
                                    alt="Login image"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
