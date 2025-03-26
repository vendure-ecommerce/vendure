import {
    DashboardRouteDefinition,
    FormFieldWrapper,
    PageBlock,
    PageLayout,
    PageTitle,
    Page,
    PageDetailForm,
    PageActionBar,
    PageActionBarRight,
    PermissionGuard,
    Button,
    DetailFormGrid,
    useDetailPage,
    CustomFieldsPageBlock,
    Switch,
    Input,
} from '@vendure/dashboard';
import { Trans } from '@lingui/react/macro';

import gql from 'graphql-tag';

const reviewDetailDocument = gql`
    query GetReviewDetail($id: ID!) {
        productReview(id: $id) {
            id
            createdAt
            updatedAt
            product {
                id
                name
            }
            productVariant {
                id
                name
                sku
            }
            summary
            body
            rating
            authorName
            authorLocation
            upvotes
            downvotes
            state
            response
            responseCreatedAt
        }
    }
`;

const updateReviewDocument = gql`
    mutation UpdateReview($input: UpdateProductReviewInput!) {
        updateProductReview(input: $input) {
            id
        }
    }
`;


export const reviewDetail: DashboardRouteDefinition = {
    id: 'review-detail',
    title: 'Product Reviews',
    navMenuItem: {
        sectionId: 'catalog',
        id: 'reviews',
        url: '/reviews',
        title: 'Product Reviews',
    },
    path: '/reviews/$id',
    component: route => {
        const params = route.useParams();

        const { form, submitHandler, entity, isPending } = useDetailPage({
            queryDocument: reviewDetailDocument,
            updateDocument: updateReviewDocument,
            params: { id: params.id },
            setValuesForUpdate: entity => {
                return {
                    id: entity.id,
                    summary: entity.summary,
                    body: entity.body,
                    rating: entity.rating,
                    authorName: entity.authorName,
                    authorLocation: entity.authorLocation,
                    upvotes: entity.upvotes,
                    downvotes: entity.downvotes,
                };
            },
        });

        return (
            <Page>
                <PageTitle>
                    {!entity ? <Trans>New tax category</Trans> : (entity.name)}
                </PageTitle>
                <PageDetailForm form={form} submitHandler={submitHandler}>
                    <PageActionBar>
                        <PageActionBarRight>
                            <PermissionGuard requires={['UpdateTaxCategory']}>
                                <Button
                                    type="submit"
                                    disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                                >
                                    <Trans>Update</Trans>
                                </Button>
                            </PermissionGuard>
                        </PageActionBarRight>
                    </PageActionBar>
                    <PageLayout>
                        <PageBlock column="main">
                            <DetailFormGrid>
                                <FormFieldWrapper
                                    control={form.control}
                                    name="summary"
                                    label={<Trans>Summary</Trans>}
                                    render={({ field }) => <Input {...field} />}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="body"
                                    label={<Trans>Is default tax category</Trans>}
                                    render={({ field }) => <Input {...field} />}
                                />
                            </DetailFormGrid>
                        </PageBlock>
                        <CustomFieldsPageBlock
                            column="main"
                            entityType="TaxCategory"
                            control={form.control}
                        />
                    </PageLayout>
                </PageDetailForm>
            </Page>
        );
    },
};
