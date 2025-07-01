import {
    CustomFormComponentInputProps,
    DataDisplayComponentProps,
    DataInputComponentProps,
    Textarea,
} from '@vendure/dashboard';

export function TextareaCustomField({ field }: CustomFormComponentInputProps) {
    return <Textarea {...field} rows={4} />;
}

export function ResponseDisplay({ value }: DataDisplayComponentProps) {
    return <div>{value}</div>;
}

export function BodyInputComponent(props: DataInputComponentProps) {
    return <Textarea {...props} rows={4} />;
}
