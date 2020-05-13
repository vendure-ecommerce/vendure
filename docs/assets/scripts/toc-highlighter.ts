/**
 * Highlights the current section in the table of contents when scrolling.
 */
export class TocHighlighter {
    constructor(private tocElement: HTMLElement) {}

    highlight() {
        const article = document.querySelector('article');
        if (this.tocElement && article) {
            const headers: HTMLHeadingElement[] = Array.from(
                article.querySelectorAll('h1[id],h2[id],h3[id],h4[id]'),
            );

            window.addEventListener('scroll', (e) => {
                this.highlightCurrentSection(headers);
            });
            this.highlightCurrentSection(headers);
        }
    }

    private highlightCurrentSection(headers: HTMLElement[]) {
        const locationHash = location.hash;
        Array.from(this.tocElement.querySelectorAll('.active')).forEach((el) =>
            el.classList.remove('active'),
        );

        // tslint:disable:prefer-for-of
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const nextHeader = headers[i + 1];
            const id = header.getAttribute('id') as string;
            if (
                !nextHeader ||
                (nextHeader && window.scrollY + window.innerHeight - 200 < nextHeader.offsetTop)
            ) {
                this.highlightItem(id);
                return;
            }

            const isCurrentTarget = `#${id}` === locationHash;
            const currentTargetOffset = isCurrentTarget ? 90 : 0;
            if (header.offsetTop + currentTargetOffset >= window.scrollY) {
                this.highlightItem(id);
                return;
            }
        }
    }

    private highlightItem(id: string) {
        const tocItem = this.tocElement.querySelector(`[href="#${id}"]`) as HTMLAnchorElement;
        if (tocItem) {
            tocItem.classList.add('active');

            // ensure the highlighted item is scrolled into view in the TOC menu
            const padding = 12;
            const tocHeight = this.tocElement.offsetHeight;
            const tocScrollTop = this.tocElement.scrollTop;
            const outOfRangeTop = tocItem?.offsetTop < tocScrollTop + padding;
            const outofRangeBottom = tocHeight + tocScrollTop < tocItem.offsetTop + padding;
            if (outOfRangeTop) {
                // console.log('¬TOP');
                this.tocElement.scrollTo({ top: tocItem.offsetTop - tocItem.offsetHeight - padding });
            }
            if (outofRangeBottom) {
                // console.log('$BOTTOm');
                const delta = tocItem.offsetTop - (tocHeight + tocScrollTop);
                this.tocElement.scrollTo({ top: tocScrollTop + delta + tocItem.offsetHeight + padding });
            }
        }
    }
}
