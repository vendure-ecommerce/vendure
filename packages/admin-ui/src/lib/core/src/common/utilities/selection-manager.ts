export interface SelectionManagerOptions<T> {
    multiSelect: boolean;
    itemsAreEqual: (a: T, b: T) => boolean;
    additiveMode: boolean;
}

/**
 * @description
 * A helper class used to manage selection of list items. Supports multiple selection via
 * cmd/ctrl/shift key.
 */
export class SelectionManager<T> {
    constructor(private options: SelectionManagerOptions<T>) {}

    get selection(): T[] {
        return this._selection;
    }

    private _selection: T[] = [];
    private items: T[] = [];

    setMultiSelect(isMultiSelect: boolean) {
        this.options.multiSelect = isMultiSelect;
    }

    setCurrentItems(items: T[]) {
        this.items = items;
    }

    toggleSelection(item: T, event?: MouseEvent) {
        const { multiSelect, itemsAreEqual, additiveMode } = this.options;
        const index = this._selection.findIndex(a => itemsAreEqual(a, item));
        if (multiSelect && event?.shiftKey && 1 <= this._selection.length) {
            const lastSelection = this._selection[this._selection.length - 1];
            const lastSelectionIndex = this.items.findIndex(a => itemsAreEqual(a, lastSelection));
            const currentIndex = this.items.findIndex(a => itemsAreEqual(a, item));
            const start = currentIndex < lastSelectionIndex ? currentIndex : lastSelectionIndex;
            const end = currentIndex > lastSelectionIndex ? currentIndex + 1 : lastSelectionIndex;
            this._selection.push(
                ...this.items.slice(start, end).filter(a => !this._selection.find(s => itemsAreEqual(a, s))),
            );
        } else if (index === -1) {
            if (multiSelect && (event?.ctrlKey || event?.shiftKey || additiveMode)) {
                this._selection.push(item);
            } else {
                this._selection = [item];
            }
        } else {
            if (multiSelect && event?.ctrlKey) {
                this._selection.splice(index, 1);
            } else if (1 < this._selection.length && !additiveMode) {
                this._selection = [item];
            } else {
                this._selection.splice(index, 1);
            }
        }
        // Make the selection mutable
        this._selection = this._selection.map(x => ({ ...x }));
    }

    selectMultiple(items: T[]) {
        this._selection = items;
    }

    isSelected(item: T): boolean {
        return !!this._selection.find(a => this.options.itemsAreEqual(a, item));
    }

    lastSelected(): T {
        return this._selection[this._selection.length - 1];
    }
}
