import {
    CustomFormComponentInputProps,
    DataDisplayComponentProps,
    DataInputComponentProps,
    FormControl,
    MultiRelationInput,
    RelationSelectorConfig,
    ResultOf,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SingleRelationInput,
    Textarea,
} from '@vendure/dashboard';
import { graphql } from '../../../graphql/graphql';

export function TextareaCustomField({ field }: CustomFormComponentInputProps) {
    return <Textarea {...field} rows={4} />;
}

export function ResponseDisplay({ value }: DataDisplayComponentProps) {
    return <div className="font-mono">{value}</div>;
}

export function BodyInputComponent(props: DataInputComponentProps) {
    return <Textarea {...props} rows={4} />;
}

const reviewFragment = graphql(`
    fragment Review on ProductReview {
        id
        summary
    }
`);

const reviewListQuery = graphql(
    `
        query GetReviewList($options: ProductReviewListOptions) {
            productReviews(options: $options) {
                items {
                    ...Review
                }
                totalItems
            }
        }
    `,
    [reviewFragment],
);

export function ReviewSingleSelect(props: CustomFormComponentInputProps) {
    const config: RelationSelectorConfig<ResultOf<typeof reviewFragment>> = {
        listQuery: reviewListQuery,
        labelKey: 'summary',
        idKey: 'id',
    };

    return (
        <SingleRelationInput
            value={props.field.value}
            onChange={props.field.onChange}
            config={config}
        ></SingleRelationInput>
    );
}

export function ReviewMultiSelect(props: CustomFormComponentInputProps) {
    const config: RelationSelectorConfig<ResultOf<typeof reviewFragment>> = {
        listQuery: reviewListQuery,
        labelKey: 'summary',
        idKey: 'id',
    };

    return (
        <MultiRelationInput
            value={props.field.value}
            onChange={props.field.onChange}
            config={config}
        ></MultiRelationInput>
    );
}

export function ReviewStateSelect(props: DataInputComponentProps) {
    return (
        <Select value={props.value} onValueChange={props.onChange} key={props.value}>
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="Select state..."></SelectValue>
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
        </Select>
    );
}
