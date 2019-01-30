import '@webcomponents/custom-elements';

import { initIcons } from './icons';
import { TocHighlighter } from './toc-highlighter';

// tslint:disable-next-line
require('../styles/main.scss');

initIcons();

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
    const toc = document.querySelector('#TableOfContents');
    if (toc) {
        const tocHighlighter = new TocHighlighter(toc);
        tocHighlighter.highlight();
    }
}, false);
