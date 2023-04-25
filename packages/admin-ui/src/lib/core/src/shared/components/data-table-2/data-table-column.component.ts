import { Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'vdr-dt2-column',
    template: ``,
    exportAs: 'row',
})
export class DataTable2ColumnComponent<T> implements OnInit {
    /**
     * When set to true, this column will expand to use available width
     */
    @Input() expand = false;
    @Input() heading: string;
    @Input() align: 'left' | 'right' | 'center' = 'left';
    @Input() optional = true;
    @Input() hiddenByDefault = false;
    #visible = true;
    #onColumnChangeFns: Array<() => void> = [];
    get visible() {
        return this.#visible;
    }
    @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;
    item: T;

    ngOnInit() {
        this.#visible = this.hiddenByDefault ? false : true;
    }

    setVisibility(isVisible: boolean) {
        this.#visible = isVisible;
        this.#onColumnChangeFns.forEach(fn => fn());
    }

    onColumnChange(callback: () => void) {
        this.#onColumnChangeFns.push(callback);
    }
}
