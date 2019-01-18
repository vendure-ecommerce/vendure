
document.addEventListener('DOMContentLoaded', () => {
    const topBar = document.querySelector('.top-bar');
    if (topBar) {
        window.addEventListener('scroll', (e) => {
            if (window.scrollY === 0) {
                topBar.classList.remove('floating');
            } else {
                topBar.classList.add('floating');
            }
        });
    }

    highlightToc();
}, false);

/**
 * Highlight the current section in the table of contents when scrolling.
 */
function highlightToc() {
    const toc = document.querySelector('#TableOfContents') as HTMLElement;
    const article = document.querySelector('article');
    if (toc && article) {
        const headers: HTMLHeadingElement[] = Array.from(article.querySelectorAll('h1[id],h2[id],h3[id]'));

        window.addEventListener('scroll', (e) => {
            highlightCurrentSection(headers);
        });
        highlightCurrentSection(headers);
    }

    function highlightCurrentSection(headers: HTMLElement[]) {
        const locationHash = location.hash;
        Array.from(toc.querySelectorAll('.active')).forEach(el => el.classList.remove('active'));

        // tslint:disable:prefer-for-of
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const nextHeader = headers[i + 1];
            const id = header.getAttribute('id') as string;
            if (!nextHeader || (nextHeader && (window.scrollY + window.innerHeight - 200) < nextHeader.offsetTop)) {
                highlightItem(id);
                return;
            }

            const isCurrentTarget = `#${id}` === locationHash;
            const currentTargetOffset = isCurrentTarget ? 90 : 0;
            if ((header.offsetTop + currentTargetOffset) >= window.scrollY) {
                highlightItem(id);
                return;
            }
        }
    }

    function highlightItem(id: string) {
        const tocItem = toc.querySelector(`[href="#${id}"]`);
        if (tocItem) {
            tocItem.classList.add('active');
        }
    }
}
