type TabGroup = HTMLDivElement[];

const TAB_CLASS = 'tab';
const TAB_CONTROL_CLASS = 'tab-control';
const TAB_CONTROL_WRAPPER_CLASS = 'tab-controls';
const CONTAINER_CLASS = 'tab-container';
const ACTIVE_CLASS = 'active';

export function initTabs() {
    const tabs = document.querySelectorAll<HTMLDivElement>(`.${TAB_CLASS}`);
    const tabGroups = groupTabs(Array.from(tabs));
    const containers = tabGroups.map(g => wrapTabGroup(g));
    containers.forEach(container => {
        container.addEventListener('click', e => {
            const target = e.target as HTMLElement;
            if (target.classList.contains(TAB_CONTROL_CLASS)) {
                const tabId = target.dataset.id;
                // deactivate all sibling tabs & controls
                const tabsInGroup = Array.from(container.querySelectorAll(`.${TAB_CLASS}`));
                const controlsInGroup = Array.from(container.querySelectorAll(`.${TAB_CONTROL_CLASS}`));
                [...tabsInGroup, ...controlsInGroup].forEach(tab => tab.classList.remove(ACTIVE_CLASS));
                // activate the newly selected tab & control
                target.classList.add(ACTIVE_CLASS);
                tabsInGroup.filter(t => t.id === tabId).forEach(tab => tab.classList.add(ACTIVE_CLASS));
            }
        });
    });
}

/**
 * Groups sibling tabs together.
 */
function groupTabs(tabs: HTMLDivElement[]): TabGroup[] {
    const tabGroups: TabGroup[] = [];
    const remainingTabs = tabs.slice();
    let next: HTMLDivElement | undefined;
    do {
        next = remainingTabs.shift();
        if (next) {
            const group: TabGroup = [next];
            let nextSibling = next.nextElementSibling;
            while (nextSibling === remainingTabs[0]) {
                if (nextSibling) {
                    next = remainingTabs.shift();
                    // tslint:disable-next-line:no-non-null-assertion
                    group.push(next!);
                }
                // tslint:disable-next-line:no-non-null-assertion
                nextSibling = next!.nextElementSibling;
            }
            tabGroups.push(group);
        }
    } while (next);
    return tabGroups;
}

/**
 * Wrap the tabs of the group in a container div and add the tab controls
 */
function wrapTabGroup(tabGroup: TabGroup): HTMLDivElement {
    const tabControls = tabGroup.map(({ title }, i) => {
        return `<button class="${TAB_CONTROL_CLASS} ${i === 0 ? ACTIVE_CLASS : ''}" data-id="${toId(title)}">${title}</button>`;
    }).join('');
    const wrapper = document.createElement('div');
    wrapper.classList.add(CONTAINER_CLASS);
    wrapper.innerHTML = `<div class="${TAB_CONTROL_WRAPPER_CLASS}">${tabControls}</div>`;

    const parent = tabGroup[0].parentElement;
    if (parent) {
        parent.insertBefore(wrapper, tabGroup[0]);
    }
    tabGroup.forEach((tab, i) => {
        tab.id = toId(tab.title);
        if (i === 0) {
            tab.classList.add(ACTIVE_CLASS);
        }
        wrapper.appendChild(tab);
    });
    return wrapper;
}

/**
 * Generate a normalized ID based on the title
 */
function toId(title: string): string {
    return 'tab-' + title.toLowerCase().replace(/[^a-zA-Z]/g, '-');
}
