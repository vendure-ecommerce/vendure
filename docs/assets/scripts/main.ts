
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
}, false);
