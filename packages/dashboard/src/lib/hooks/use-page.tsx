import { useContext } from 'react';
import { PageContext } from '../framework/layout-engine/page-provider.js';

export function usePage() {
    const page = useContext(PageContext);
    if (!page) {
        throw new Error('PageProvider not found');
    }
    return page;
}
