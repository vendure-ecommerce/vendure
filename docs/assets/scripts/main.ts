// import '@webcomponents/custom-elements';

import { SearchWidget } from './search-widget';
import { initTabs } from './tabs';
import { TocHighlighter } from './toc-highlighter';

// tslint:disable-next-line
require('../styles/main.scss');

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

    const toc = document.querySelector('#TableOfContents') as HTMLDivElement;
    const tocHighlighter = new TocHighlighter(toc);
    tocHighlighter.highlight();

    const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
    const searchWidget = new SearchWidget(searchInput);
    const searchButton = document.querySelector('button.search-icon') as HTMLButtonElement;
    searchButton.addEventListener('click', () => searchWidget.toggleActive());

    initTabs();

}, false);
