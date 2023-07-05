import { AlpineContext, AlpineEvent } from "../alpine.types";

export function popover(open = false, focus = false) {
    let restoreEl: HTMLDivElement | undefined = undefined;

    return {
        open,
        onEscape() {
            this.open = false;
            restoreEl?.focus();
        },
        onClosePopoverGroup(e: AlpineEvent) {
            e.detail.contains(this.$el) && (this.open = false);
        },

        toggle(e: AlpineEvent) {
            this.open = !this.open;
            this.open ? restoreEl = e.currentTarget as HTMLDivElement : restoreEl?.focus()
        },
    } as AlpineContext;
}
