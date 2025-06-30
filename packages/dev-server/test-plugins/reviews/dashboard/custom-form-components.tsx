import { CustomFormComponentInputProps, Textarea } from '@vendure/dashboard';

export function TextareaCustomField({ field }: CustomFormComponentInputProps) {
    return <Textarea {...field} rows={4} />;
}
