export function stripHtmlTags(input: string): string {
    if (!input) return '';
    const div = document.createElement('div');
    div.innerHTML = input;
    return div.textContent || '';
}
