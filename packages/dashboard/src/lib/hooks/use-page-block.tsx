import { useContext } from 'react';
import { PageBlockContext } from '../framework/layout-engine/page-block-provider.js';

export function usePageBlock() {
    const pageBlock = useContext(PageBlockContext);
    if (!pageBlock) {
        throw new Error('PageBlockProvider not found');
    }
    return pageBlock;
}
