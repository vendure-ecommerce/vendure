import { getListQueryDocuments } from '@/vdb/framework/data-table/data-table-extensions.js';
import { extendDocument } from '@/vdb/framework/document-extension/extend-document.js';
import { useLingui } from '@/vdb/lib/trans.js';
import { DocumentNode } from 'graphql';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';

import { usePageBlock } from './use-page-block.js';
import { usePage } from './use-page.js';

export function useExtendedListQuery<T extends DocumentNode>(listQuery: T) {
    const { pageId } = usePage();
    const { blockId } = usePageBlock();
    const { i18n } = useLingui();
    const listQueryExtensions = pageId && blockId ? getListQueryDocuments(pageId, blockId) : [];
    const hasShownError = useRef(false);

    const extendedListQuery = useMemo(() => {
        let result: T = listQuery;
        let error: Error | null = null;

        try {
            result = listQueryExtensions.reduce(
                (acc, extension) => extendDocument(acc, extension),
                listQuery,
            ) as T;
        } catch (err) {
            error = err instanceof Error ? err : new Error(String(err));
            // Continue with the original query instead of the extended one
            result = listQuery;
        }

        // Store error for useEffect to handle
        if (error && !hasShownError.current) {
            hasShownError.current = true;

            // Provide a helpful error message based on the error type
            let errorMessage = i18n.t('Failed to extend query document');
            if (error.message.includes('Extension query must have at least one top-level field')) {
                errorMessage = i18n.t('Query extension is invalid: must have at least one top-level field');
            } else if (error.message.includes('The query extension must extend the')) {
                errorMessage = i18n.t('Query extension mismatch: ') + error.message;
            } else if (error.message.includes('Syntax Error')) {
                errorMessage = i18n.t('Query extension contains invalid GraphQL syntax');
            } else {
                errorMessage = i18n.t('Query extension error: ') + error.message;
            }

            // Log the error and continue with the original query
            // eslint-disable-next-line no-console
            console.warn(`${errorMessage}. Continuing with original query.`, {
                pageId,
                blockId,
                extensionsCount: listQueryExtensions.length,
                error: error.message,
            });

            // Show a user-friendly toast notification
            toast.error(i18n.t('Query extension error'), {
                description: errorMessage + '. ' + i18n.t('The page will continue with the default query.'),
            });
        }

        return result;
    }, [listQuery, listQueryExtensions, pageId, blockId]);

    // Reset error flag when dependencies change
    useEffect(() => {
        hasShownError.current = false;
    }, [listQuery, listQueryExtensions, pageId, blockId]);

    return extendedListQuery;
}
