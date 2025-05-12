import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';
import { Input } from '@/components/ui/input.js';
import { useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans } from '@/lib/trans.js';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AnyRoute, useNavigate } from '@tanstack/react-router';
import { ResultOf, VariablesOf } from 'gql.tada';
import { DateTimeInput } from '@/components/data-input/datetime-input.js';
import { Button } from '@/components/ui/button.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import { NEW_ENTITY_PATH } from '@/constants.js';
import { toast } from 'sonner';
import { getOperationVariablesFields } from '../document-introspection/get-document-structure.js';

import {
    DetailFormGrid,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageLayout,
    PageTitle,
} from '../layout-engine/page-layout.js';
import { DetailEntityPath } from './page-types.js';

/**
 * @description
 * **Status: Developer Preview**
 *
 * @docsCategory components
 * @docsPage DetailPage
 * @since 3.3.0
 */
export interface DetailPageProps<
    T extends TypedDocumentNode<any, any>,
    C extends TypedDocumentNode<any, any>,
    U extends TypedDocumentNode<any, any>,
    EntityField extends keyof ResultOf<T> = DetailEntityPath<T>,
> {
    /**
     * @description
     * A unique identifier for the page.
     */
    pageId: string;
    /**
     * @description
     * The Tanstack Router route used to navigate to this page.
     */
    route: AnyRoute;
    /**
     * @description
     * The title of the page.
     */
    title: (entity: ResultOf<T>[EntityField]) => string;
    /**
     * @description
     * The query document used to fetch the entity.
     */
    queryDocument: T;
    /**
     * @description
     * The mutation document used to create the entity.
     */
    createDocument?: C;
    /**
     * @description
     * The mutation document used to update the entity.
     */
    updateDocument: U;
    /**
     * @description
     * A function that sets the values for the update input type based on the entity.
     */
    setValuesForUpdate: (entity: ResultOf<T>[EntityField]) => VariablesOf<U>['input'];
}

/**
 * @description
 * **Status: Developer Preview**
 *
 * Auto-generates a detail page with a form based on the provided query and mutation documents.
 *
 * For more control over the layout, you would use the more low-level {@link Page} component.
 *
 * @docsCategory components
 * @docsPage DetailPage
 * @docsWeight 0
 * @since 3.3.0
 */
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
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const navigate = useNavigate();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage<any, any, any>({
        queryDocument,
        updateDocument,
        createDocument,
        params: { id: params.id },
        setValuesForUpdate,
        onSuccess: async (data) => {
            toast.success('Updated successfully');
            resetForm();
            const id = (data as any).id;
            if (creatingNewEntity && id) {
                await navigate({ to: `../$id`, params: { id } });
            }
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
            <PageTitle>{title(entity)}</PageTitle>
            <PageActionBar>
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
                                                return <Checkbox value={field.value} onCheckedChange={field.onChange} />;
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
