import { useAuth } from '@/vdb/hooks/use-auth.js';
import { PropsWithChildren, useEffect } from 'react';

export function DemoAuthProvider({ children }: PropsWithChildren) {
    const { login } = useAuth();

    useEffect(() => {
        login('admin', 'admin');
    }, []);
    return children;
}
