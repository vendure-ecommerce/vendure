export function stripHtmlTags(input: string): string {
    return input ? input.replace(/<\/?[a-zA-Z][^>\s]*[^>]*>/g, '') : '';
}
