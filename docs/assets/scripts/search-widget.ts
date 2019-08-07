import fuzzy, { FilterResult } from 'fuzzy';

type Section = 'guides' | 'config' | 'gql';
interface IndexItem {
    section: Section;
    title: string;
    parent: string;
    headings: string[];
    url: string;
}

interface DenormalizedItem {
    section: Section;
    title: string;
    parent: string;
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

    private readonly MAX_RESULTS = 7;
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
                        this.results = [];
                    }
                    break;
                case KeyCode.ESCAPE:
                    this.results = [];
                    this.inputElement.blur();
                    break;
            }
            this.render();
        });

        this.wrapperDiv.addEventListener('click', () => {
            this.results = [];
            this.render();
        });
    }

    toggleActive() {
        this.wrapperDiv.classList.toggle('focus');
        if (this.wrapperDiv.classList.contains('focus')) {
            this.inputElement.focus();
        }
    }

    /**
     * Groups the results by section and renders as a list
     */
    private render() {
        const sections: Section[] = ['guides', 'gql', 'config'];
        let html = '';
        let i = 0;
        for (const sec of sections) {
            const matches = this.results.filter(r => r.original.section === sec);
            if (matches.length) {
                const sectionName = sec === 'guides' ? 'Guides' : sec === 'gql' ? 'GraphQL API' : 'Configuration';
                html += `<li class="section">${sectionName}</li>`;
            }
            html += matches.map((result) => {
                const { section, title, parent, heading, url } = result.original;
                const anchor = heading !== title ? '#' + this.headingToAnchor(heading) : '';
                const inner = `<div class="title"><span class="parent">${parent}</span> › ${title}</div><div class="heading">${result.string}</div>`;
                const selected = i === this.selectedIndex ? 'selected' : '';
                i++;
                return `<li class="${selected}"><a href="${url + anchor}">${inner}</a></li>`;
            }).join('\n');
        }

        this.listElement.innerHTML = html;
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
        const results = fuzzy.filter(
            term,
            items,
            {
                pre: '<span class="hl">',
                post: '</span>',
                extract(input: DenormalizedItem): string {
                    return input.heading;
                },
            },
        );

        if (this.MAX_RESULTS < results.length) {
            // limit the maximum number of results from a particular
            // section to prevent other possibly relevant results getting
            // buried.
            const guides = results.filter(r => r.original.section === 'guides');
            const gql = results.filter(r => r.original.section === 'gql');
            const config = results.filter(r => r.original.section === 'config');
            let pool = [guides, gql, config].filter(p => p.length);
            const balancedResults = [];
            for (let i = 0; i < this.MAX_RESULTS; i ++) {
                const next = pool[i % pool.length].shift();
                if (next) {
                    balancedResults.push(next);
                }
                pool = [guides, gql, config].filter(p => p.length);
            }
            return balancedResults;
        }
        return results;
    }

    private getSearchIndex(): Promise<DenormalizedItem[]> {
        if (!this.searchIndex) {
            // tslint:disable:no-eval
            this.searchIndex = fetch('/searchindex/index.html')
                .then(res => res.text())
                .then(res => eval(res))
                .then((items: IndexItem[]) => {
                    const denormalized: DenormalizedItem[] = [];
                    for (const { section, title, parent, headings, url } of items) {
                        denormalized.push({
                            section,
                            title,
                            parent,
                            heading: title,
                            url,
                        });
                        if (headings.length) {
                            for (const heading of headings) {
                                if (heading !== title) {
                                    denormalized.push({
                                        section,
                                        title,
                                        parent,
                                        heading,
                                        url,
                                    });
                                }
                            }
                        }
                    }
                    return denormalized;
                });
        }
        return this.searchIndex;
    }

    private headingToAnchor(heading: string): string {
        return heading.toLowerCase()
            .replace(/\s/g, '-')
            .replace(/[:]/g, '');
    }
}
