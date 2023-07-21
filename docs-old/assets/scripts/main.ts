import { formatDocs } from './docs-formatting';
// import { initGraphQlPlaygroundWidgets } from './graphql-playground-widget';
import { initNavMenu } from './nav-menu';
import { SearchWidget } from './search-widget';
import { initTabs } from './tabs';
import { TocHighlighter } from './toc-highlighter';
import 'alpinejs';
import { popover } from './alpine-components/popover';
import { scrollSpy } from './alpine-components/scroll-spy';

window.Components = {};
window.Components.popover = popover;
window.Components.scrollSpy = scrollSpy;

// tslint:disable-next-line
require('../styles/main.scss');

document.addEventListener(
    'DOMContentLoaded',
    async () => {
        const toc = document.querySelector('#TableOfContents') as HTMLDivElement;
        const tocHighlighter = new TocHighlighter(toc);
        tocHighlighter.highlight();

        const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
        const autocompleteWrapper = document.querySelector('#autocomplete-wrapper') as HTMLDivElement;
        const searchTrigger = document.querySelector('#searchInputTrigger') as HTMLInputElement;
        const searchOverlay = document.querySelector('#searchOverlay') as HTMLDivElement;
        if (searchTrigger) {
            const searchWidget = new SearchWidget(
                searchInput,
                autocompleteWrapper,
                searchOverlay,
                searchTrigger,
            );
        }
        initTabs();
        initNavMenu();
        formatDocs();
    },
    false,
);
