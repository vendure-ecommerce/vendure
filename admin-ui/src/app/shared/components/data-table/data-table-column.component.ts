import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'vdr-dt-column',
    template: `<ng-template><ng-content></ng-content></ng-template>`,
})
export class DataTableColumnComponent {
    @ViewChild(TemplateRef) template: TemplateRef<any>;
}
