import { useAuth } from '@/vdb/hooks/use-auth.js';
import { PropsWithChildren, useEffect } from 'react';

export function DemoAuthProvider({ children }: PropsWithChildren) {
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            login('admin', 'admin');
        }
    }, [isAuthenticated]);
    return children;
}
