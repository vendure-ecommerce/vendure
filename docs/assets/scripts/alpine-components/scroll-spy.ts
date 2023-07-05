import { AlpineContext, AlpineEvent } from "../alpine.types";

export function scrollSpy() {
    return {
        isScrolledToTop: true,
        scrollY: 0,
        onScroll() {
            this.scrollY = window.scrollY;
            this.isScrolledToTop = this.scrollY === 0;
        },
    } as AlpineContext;
}

