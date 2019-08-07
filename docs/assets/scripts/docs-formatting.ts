export function formatDocs() {

    Array.from(document.querySelectorAll('h3')).forEach(h1 => {
        const nextSibling = h1.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('member-info')) {
            h1.classList.add('member-title');
        }
    });
}
