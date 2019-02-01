import fuzzy, { FilterResult } from 'fuzzy';

interface IndexItem {
    title: string;
    headings: string[];
    url: string;
}

interface DenormalizedItem {
    title: string;
    heading: string;
    url: string;
}

const KeyCode = {
    UP: 38,
    DOWN: 40,
    ENTER: 13,
    ESCAPE: 27,
};

/**
 * This class implements the auto-suggest search box for searching the docs.
 */
export class SearchWidget {

    private readonly MAX_RESULTS = 8;
    private searchIndex: Promise<DenormalizedItem[]> | undefined;
    private results: Array<FilterResult<DenormalizedItem>> = [];
    private selectedIndex = -1;
    private autocompleteDiv: HTMLDivElement;
    private wrapperDiv: HTMLDivElement;
    private listElement: HTMLUListElement;

    constructor(private inputElement: HTMLInputElement) {
        this.attachAutocomplete();

        inputElement.addEventListener('input', (e) => {
            this.handleInput(e as KeyboardEvent);
        });

        inputElement.addEventListener('keydown', (e: KeyboardEvent) => {
            switch (e.keyCode) {
                case KeyCode.UP:
                    this.selectedIndex = this.selectedIndex === 0 ? this.results.length - 1 : this.selectedIndex - 1;
                    e.preventDefault();
                    break;
                case KeyCode.DOWN:
                    this.selectedIndex = this.selectedIndex === (this.results.length - 1) ? 0 : this.selectedIndex + 1;
                    e.preventDefault();
                    break;
                case KeyCode.ENTER:
                    const selected = this.autocompleteDiv.querySelector('li.selected a') as HTMLAnchorElement;
                    if (selected) {
                        selected.click();
                        return;
                    }
                    break;
                case KeyCode.ESCAPE:
                    this.results = [];
                    this.inputElement.blur();
                    break;
            }
            this.render();
        });
    }

    toggleActive() {
        this.wrapperDiv.classList.toggle('focus');
        if (this.wrapperDiv.classList.contains('focus')) {
            this.inputElement.focus();
        }
    }

    private render() {
        const listItems = this.results
            .map((result, i) => {
                const { title, heading, url } = result.original;
                const anchor = heading !== title ? '#' + heading.toLowerCase().replace(/\s/g, '-') : '';
                const inner = `<div class="title">${title}</div><div class="heading">${result.string}</div>`;
                return `<li class="${i === this.selectedIndex ? 'selected' : ''}"><a href="${url + anchor}">${inner}</a></li>`;
            });
        this.listElement.innerHTML = listItems.join('\n');
    }

    private attachAutocomplete() {
        this.autocompleteDiv = document.createElement('div');
        this.autocompleteDiv.classList.add('autocomplete');
        this.listElement = document.createElement('ul');
        this.autocompleteDiv.appendChild(this.listElement);
        this.wrapperDiv = document.createElement('div');
        this.wrapperDiv.classList.add('autocomplete-wrapper');

        const parent = this.inputElement.parentElement;
        if (parent) {
            parent.insertBefore(this.wrapperDiv, this.inputElement);
            this.wrapperDiv.appendChild(this.inputElement);
            this.wrapperDiv.appendChild(this.autocompleteDiv);
        }
    }

    private async handleInput(e: KeyboardEvent) {
        const term = (e.target as HTMLInputElement).value.trim();
        this.results = term ? await this.getResults(term) : [];
        this.selectedIndex = 0;
        this.render();
    }

    private async getResults(term: string) {
        const items = await this.getSearchIndex();
        return fuzzy.filter(
            term,
            items,
            {
                pre: '<span class="hl">',
                post: '</span>',
                extract(input: DenormalizedItem): string {
                    return input.heading;
                },
            },
        ).slice(0, this.MAX_RESULTS);
    }

    private getSearchIndex(): Promise<DenormalizedItem[]> {
        if (!this.searchIndex) {
            // tslint:disable:no-eval
            this.searchIndex = fetch('/searchindex/index.html')
                .then(res => res.text())
                .then(res => eval(res))
                .then((items: IndexItem[]) => {
                    const denormalized: DenormalizedItem[] = [];
                    for (const { title, headings, url } of items) {
                        denormalized.push({
                            title,
                            heading: title,
                            url,
                        });
                        if (headings.length) {
                            for (const heading of headings) {
                                denormalized.push({
                                    title,
                                    heading,
                                    url,
                                });
                            }
                        }
                    }
                    return denormalized;
                });
        }
        return this.searchIndex;
    }
}
