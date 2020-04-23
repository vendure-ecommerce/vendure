import { formatDocs } from './docs-formatting';
import { initGraphQlPlaygroundWidgets } from './graphql-playground-widget';
import { initNavMenu } from './nav-menu';
import { SearchWidget } from './search-widget';
import { initTabs } from './tabs';
import { TocHighlighter } from './toc-highlighter';
import { initTopMenu } from './top-bar';

// tslint:disable-next-line
require('../styles/main.scss');

document.addEventListener(
    'DOMContentLoaded',
    () => {
        const topBar = document.querySelector('.top-bar');
        if (topBar) {
            const setTopBarClass = () => {
                if (window.scrollY === 0) {
                    topBar.classList.remove('floating');
                } else {
                    topBar.classList.add('floating');
                }
            };
            window.addEventListener('scroll', setTopBarClass);
            setTopBarClass();
        }

        const toc = document.querySelector('#TableOfContents') as HTMLDivElement;
        const tocHighlighter = new TocHighlighter(toc);
        tocHighlighter.highlight();

        const searchInput = document.querySelector('#searchInput');
        if (searchInput) {
            const searchWidget = new SearchWidget(searchInput as HTMLInputElement);
            const searchButton = document.querySelector('button.search-icon') as HTMLButtonElement;
            searchButton.addEventListener('click', () => searchWidget.toggleActive());
        }
        initTabs();
        initNavMenu();
        initGraphQlPlaygroundWidgets();
        formatDocs();
        initTopMenu();
    },
    false,
);
