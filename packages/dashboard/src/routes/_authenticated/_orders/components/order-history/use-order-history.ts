import { api } from '@/graphql/api.js';
import { graphql } from '@/graphql/graphql.js';
import { useLingui } from '@lingui/react/macro';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { orderHistoryDocument } from '../../orders.graphql.js';

// Simplified mutation definitions - adjust based on your actual schema
const addOrderNoteDocument = graphql(`
    mutation AddOrderNote($orderId: ID!, $note: String!, $isPublic: Boolean!) {
        addNoteToOrder(input: { id: $orderId, note: $note, isPublic: $isPublic }) {
            id
            history(options: { take: 1, sort: { createdAt: DESC } }) {
                items {
                    id
                    createdAt
                    type
                    isPublic
                    data
                }
            }
        }
    }
`);

const updateOrderNoteDocument = graphql(`
    mutation UpdateOrderNote($noteId: ID!, $note: String!, $isPublic: Boolean!) {
        updateOrderNote(input: { noteId: $noteId, note: $note, isPublic: $isPublic }) {
            id
        }
    }
`);

const deleteOrderNoteDocument = graphql(`
    mutation DeleteOrderNote($noteId: ID!) {
        deleteOrderNote(id: $noteId) {
            result
            message
        }
    }
`);

export function useOrderHistory(orderId: string) {
    const [isLoading, setIsLoading] = useState(false);
    const { i18n } = useLingui();

    // Fetch order history
    const {
        data,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useQuery({
        queryFn: () =>
            api.query(orderHistoryDocument, {
                id: orderId,
                options: {
                    sort: { createdAt: 'DESC' },
                },
            }),
        queryKey: ['OrderHistory', orderId],
    });

    // Add note mutation
    const { mutate: addNoteMutation } = useMutation({
        mutationFn: api.mutate(addOrderNoteDocument),
        onSuccess: () => {
            toast.success(i18n.t('Note added successfully'));
            void refetch();
        },
        onError: () => {
            toast.error(i18n.t('Failed to add note'));
        },
    });

    const addNote = (note: string, isPrivate: boolean) => {
        setIsLoading(true);
        addNoteMutation({
            orderId,
            note,
            isPublic: !isPrivate, // isPrivate in UI is the opposite of isPublic in API
        });
    };

    // Update note mutation
    const { mutate: updateNoteMutation } = useMutation({
        mutationFn: api.mutate(updateOrderNoteDocument),
        onSuccess: () => {
            toast.success(i18n.t('Note updated successfully'));
            void refetch();
        },
        onError: () => {
            toast.error(i18n.t('Failed to update note'));
        },
    });
    const updateNote = (noteId: string, note: string, isPrivate: boolean) => {
        setIsLoading(true);

        updateNoteMutation({
            noteId,
            note,
            isPublic: !isPrivate, // isPrivate in UI is the opposite of isPublic in API
        });
    };

    // Delete note mutation
    const { mutate: deleteNoteMutation } = useMutation({
        mutationFn: api.mutate(deleteOrderNoteDocument),
        onSuccess: () => {
            toast.success(i18n.t('Note deleted successfully'));
            void refetch();
        },
        onError: () => {
            toast.error(i18n.t('Failed to delete note'));
        },
    });
    const deleteNote = (noteId: string) => {
        setIsLoading(true);
        deleteNoteMutation({
            noteId,
        });
    };

    return {
        historyEntries: data?.order?.history?.items || [],
        order: data?.order,
        loading: isLoadingQuery || isLoading,
        error,
        addNote,
        updateNote,
        deleteNote,
        refetch,
    };
}
