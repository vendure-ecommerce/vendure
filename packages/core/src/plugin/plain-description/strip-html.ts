export function stripHtmlTags(input: string): string {
    return input ? input.replace(/<[^>]*>/g, '') : '';
}
