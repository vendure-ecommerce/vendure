import fuzzy, { FilterResult } from 'fuzzy';
import { RecentSearchRecorder } from './recent-search-recorder';

type Section = 'developer-guide' | 'user-guide' | 'config' | 'gql';

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
    private recentSearchRecorder: RecentSearchRecorder;

    constructor(private inputElement: HTMLInputElement,
                private autoCompleteWrapperElement: HTMLDivElement,
                private overlayElement: HTMLDivElement,
                private triggerElement: HTMLInputElement) {
        this.attachAutocomplete();
        this.recentSearchRecorder = new RecentSearchRecorder();
        this.recentSearchRecorder.init();

        inputElement.addEventListener('input', (e) => {
            this.handleInput(e as KeyboardEvent);
        });

        inputElement.addEventListener('keydown', (e: KeyboardEvent) => {
            const listItemCount = this.inputElement.value === '' ? this.recentSearchRecorder.list.length : this.results.length;
            switch (e.keyCode) {
                case KeyCode.UP:
                    this.selectedIndex = this.selectedIndex === 0 ? listItemCount - 1 : this.selectedIndex - 1;
                    e.preventDefault();
                    break;
                case KeyCode.DOWN:
                    this.selectedIndex = this.selectedIndex === (listItemCount - 1) ? 0 : this.selectedIndex + 1;
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
            setTimeout(() => {
                Array.from(this.listElement.querySelectorAll('.result')).forEach(titleEl => {
                    titleEl.addEventListener('click', this.recordClickToHistory)
                });
            });
        });

        this.wrapperDiv.addEventListener('click', (e) => {
            this.results = [];
            this.render();
        });

        const openModal = () => {
            this.overlayElement.click();
            setTimeout(() => {
                this.inputElement.value = this.triggerElement.value;
                this.triggerElement.value = '';
                this.inputElement.focus();
            }, 50);
            this.render();
        }

        this.triggerElement.addEventListener('click', openModal);
        this.triggerElement.addEventListener('keypress', openModal);
        window.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 'k') {
                openModal();
                e.preventDefault();
            }
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

        const sections: Section[] = ['developer-guide', 'user-guide', 'gql', 'config'];
        let html = '';
        let i = 0;
        if (this.inputElement.value === '' && this.recentSearchRecorder.list.length) {
            html += `<li class="section recent">Recent</li>`;
            html += this.recentSearchRecorder.list.map(({parent, page, title, url}) => {
                const inner = `<div class="title"><span class="parent">${parent}</span> › ${page}</div><div class="heading">${title}</div>`;
                const selected = i === this.selectedIndex ? 'selected' : '';
                i++;
                return `<li class="${selected} result recent"><a href="${url}">${inner}</a></li>`;
            }).join('\n');
        } else {
            for (const sec of sections) {
                const matches = this.results.filter(r => r.original.section === sec);
                if (matches.length) {
                    const sectionName = this.getSectionName(sec);
                    html += `<li class="section ${sec}">${sectionName}</li>`;
                }
                html += matches.map((result) => {
                    const {section, title, parent, heading, url} = result.original;
                    const anchor = heading !== title ? '#' + this.headingToAnchor(heading) : '';
                    const inner = `<div class="title"><span class="parent">${parent}</span> › <span class="page">${title}</span></div><div class="heading">${result.string}</div>`;
                    const selected = i === this.selectedIndex ? 'selected' : '';
                    i++;
                    return `<li class="${selected} result ${sec}"><a href="${url + anchor}">${inner}</a></li>`;
                }).join('\n');
            }
        }

        this.listElement.innerHTML = html;
    }

    private recordClickToHistory = (e: Event) => {
        const title = (e.currentTarget as HTMLDivElement).querySelector('.heading')?.textContent;
        const parent = (e.currentTarget as HTMLDivElement).querySelector('.parent')?.textContent;
        const page = (e.currentTarget as HTMLDivElement).querySelector('.page')?.textContent;
        const url = (e.currentTarget as HTMLDivElement).querySelector('a')?.href;
        if (title && url && parent && page) {
            this.recentSearchRecorder.record({
                parent,
                page,
                title,
                url,
            });
        }
    }

    private getSectionName(sec: Section): string {
        switch (sec) {
            case 'developer-guide':
                return 'Developer Guide';
            case 'config':
                return 'TypeScript API';
            case 'gql':
                return 'GraphQL API';
            case 'user-guide':
                return 'Administrator Guide';
        }
    }

    private attachAutocomplete() {
        this.autocompleteDiv = document.createElement('div');
        this.autocompleteDiv.classList.add('autocomplete');
        this.listElement = document.createElement('ul');
        this.autocompleteDiv.appendChild(this.listElement);
        this.wrapperDiv = this.autoCompleteWrapperElement;
        this.wrapperDiv.classList.add('autocomplete-wrapper');

        const parent = this.inputElement.parentElement;
        if (parent) {
            // parent.insertBefore(this.wrapperDiv, this.inputElement);
            // this.wrapperDiv.appendChild(this.inputElement);
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
            const devGuides = results.filter(r => r.original.section === 'developer-guide');
            const adminGuides = results.filter(r => r.original.section === 'user-guide');
            const gql = results.filter(r => r.original.section === 'gql');
            const config = results.filter(r => r.original.section === 'config');
            let pool = [devGuides, adminGuides, gql, config].filter(p => p.length);
            const balancedResults = [];
            for (let i = 0; i < this.MAX_RESULTS; i++) {
                const next = pool[i % pool.length].shift();
                if (next) {
                    balancedResults.push(next);
                }
                pool = [devGuides, adminGuides, gql, config].filter(p => p.length);
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
                    for (const {section, title, parent, headings, url} of items) {
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
