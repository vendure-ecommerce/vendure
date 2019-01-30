/**
 * Highlights the current section in the table of contents when scrolling.
 */
export class TocHighlighter {

    constructor(private tocElement: Element) {}

    highlight() {
        const article = document.querySelector('article');
        if (this.tocElement && article) {
            const headers: HTMLHeadingElement[] = Array.from(article.querySelectorAll('h1[id],h2[id],h3[id]'));

            window.addEventListener('scroll', (e) => {
                this.highlightCurrentSection(headers);
            });
            this.highlightCurrentSection(headers);
        }

    }

    private highlightCurrentSection(headers: HTMLElement[]) {
        const locationHash = location.hash;
        Array.from(this.tocElement.querySelectorAll('.active')).forEach(el => el.classList.remove('active'));

        // tslint:disable:prefer-for-of
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const nextHeader = headers[i + 1];
            const id = header.getAttribute('id') as string;
            if (!nextHeader || (nextHeader && (window.scrollY + window.innerHeight - 200) < nextHeader.offsetTop)) {
                this.highlightItem(id);
                return;
            }

            const isCurrentTarget = `#${id}` === locationHash;
            const currentTargetOffset = isCurrentTarget ? 90 : 0;
            if ((header.offsetTop + currentTargetOffset) >= window.scrollY) {
                this.highlightItem(id);
                return;
            }
        }
    }

    private highlightItem(id: string) {
        const tocItem = this.tocElement.querySelector(`[href="#${id}"]`);
        if (tocItem) {
            tocItem.classList.add('active');
        }
    }
}
