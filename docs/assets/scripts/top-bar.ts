export function initTopMenu() {
    const subMenus = document.querySelectorAll<HTMLDivElement>('.submenu');
    subMenus.forEach(initSubMenu);
}

let close: () => void;

function initSubMenu(subMenu: HTMLDivElement) {
    const trigger = subMenu.querySelector('.trigger');
    const overlay = subMenu.querySelector('.overlay');

    trigger?.addEventListener('click', (e) => {
        if (typeof close === 'function') {
            close();
        }
        overlay?.classList.add('expanded');
        e.preventDefault();
        e.stopPropagation();
        close = () => {
            overlay?.classList.remove('expanded');
            document.removeEventListener('click', close);
            document.removeEventListener('scroll', close);
        };
        document.addEventListener('click', close);
        document.addEventListener('scroll', close);
    });
}
