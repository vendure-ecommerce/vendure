export function initNavMenu() {
    const sections = document.querySelectorAll('nav li.section');
    sections.forEach(makeExpandable);
}

function makeExpandable(section: Element) {
    const icon = section.querySelector('.section-icon');
    const sublist = section.querySelector('ul');

    if (icon && sublist) {
        icon.addEventListener('click', () => {
            icon.classList.toggle('expanded');
            sublist.classList.toggle('expanded');
        });
    }
}
