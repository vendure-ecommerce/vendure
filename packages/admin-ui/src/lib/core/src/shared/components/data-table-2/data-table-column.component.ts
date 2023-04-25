import { Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'vdr-dt2-column',
    template: ``,
    exportAs: 'row',
})
export class DataTable2ColumnComponent<T> {
    /**
     * When set to true, this column will expand to use available width
     */
    @Input() expand = false;
    @Input() heading: string;
    @Input() align: 'left' | 'right' | 'center' = 'left';
    @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;
    item: T;
}
