import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';
import { Input } from '@/components/ui/input.js';
import { useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans } from '@/lib/trans.js';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AnyRoute } from '@tanstack/react-router';
import { ResultOf, VariablesOf } from 'gql.tada';

import { DateTimeInput } from '@/components/data-input/datetime-input.js';
import { Button } from '@/components/ui/button.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import { toast } from 'sonner';
import { getOperationVariablesFields } from '../document-introspection/get-document-structure.js';
import {
    DetailFormGrid,
    Page,
    PageActionBar,
    PageActionBarLeft,
    PageActionBarRight,
    PageBlock,
    PageLayout,
    PageTitle,
} from '../layout-engine/page-layout.js';
import { DetailEntityPath } from './page-types.js';

export interface DetailPageProps<
    T extends TypedDocumentNode<any, any>,
    C extends TypedDocumentNode<any, any>,
    U extends TypedDocumentNode<any, any>,
    EntityField extends keyof ResultOf<T> = DetailEntityPath<T>,
> {
    pageId: string;
    route: AnyRoute;
    title: (entity: ResultOf<T>[EntityField]) => string;
    queryDocument: T;
    createDocument?: C;
    updateDocument: U;
    setValuesForUpdate: (entity: ResultOf<T>[EntityField]) => VariablesOf<U>['input'];
}

export function DetailPage<
    T extends TypedDocumentNode<any, any>,
    C extends TypedDocumentNode<any, any>,
    U extends TypedDocumentNode<any, any>,
>({
    pageId,
    route,
    queryDocument,
    createDocument,
    updateDocument,
    setValuesForUpdate,
    title,
}: DetailPageProps<T, C, U>) {
    const params = route.useParams();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage<any, any, any>({
        queryDocument,
        updateDocument,
        createDocument,
        params: { id: params.id },
        setValuesForUpdate,
        onSuccess: () => {
            toast.success('Updated successfully');
            resetForm();
        },
        onError: error => {
            toast.error('Failed to update', {
                description: error instanceof Error ? error.message : 'Unknown error',
            });
        },
    });

    const updateFields = getOperationVariablesFields(updateDocument, 'input');

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler}>
            <PageActionBar>
                <PageActionBarLeft>
                    <PageTitle>{title(entity)}</PageTitle>
                </PageActionBarLeft>
                <PageActionBarRight>
                    <Button
                        type="submit"
                        disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                    >
                        <Trans>Update</Trans>
                    </Button>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="main" blockId="main-form">
                    <DetailFormGrid>
                        {updateFields.map(fieldInfo => {
                            if (fieldInfo.name === 'id' && fieldInfo.type === 'ID') {
                                return null;
                            }
                            return (
                                <FormFieldWrapper
                                    key={fieldInfo.name}
                                    control={form.control}
                                    name={fieldInfo.name as never}
                                    label={fieldInfo.name}
                                    render={({ field }) => {
                                        switch (fieldInfo.type) {
                                            case 'Int':
                                            case 'Float':
                                                return (
                                                    <Input
                                                        type="number"
                                                        value={field.value}
                                                        onChange={e => field.onChange(e.target.valueAsNumber)}
                                                    />
                                                );
                                            case 'DateTime':
                                                return <DateTimeInput {...field} />;
                                            case 'Boolean':
                                                return <Checkbox {...field} />;
                                            case 'String':
                                            default:
                                                return <Input {...field} />;
                                        }
                                    }}
                                />
                            );
                        })}
                    </DetailFormGrid>
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
