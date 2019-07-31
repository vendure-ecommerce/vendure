import { ChangeDetectionStrategy, Component, Input, OnInit, Optional, SkipSelf } from '@angular/core';

/**
 * This component displays a plain JavaScript object as an expandable tree.
 */
@Component({
    selector: 'vdr-object-tree',
    templateUrl: './object-tree.component.html',
    styleUrls: ['./object-tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectTreeComponent implements OnInit {
    @Input() value: { [key: string]: any };
    @Input() isArrayItem = false;
    depth: number;
    expanded: boolean;
    valueIsArray: boolean;
    entries: Array<{ key: string; value: any }>;
    constructor(@Optional() @SkipSelf() parent: ObjectTreeComponent) {
        if (parent) {
            this.depth = parent.depth + 1;
        } else {
            this.depth = 0;
        }
    }

    ngOnInit() {
        this.entries = Object.entries(this.value).map(([key, value]) => ({ key, value }));
        this.expanded = this.depth === 0 || this.isArrayItem;
        this.valueIsArray = Object.keys(this.value).every(v => Number.isInteger(+v));
    }

    isObject(value: any): boolean {
        return typeof value === 'object' && value !== null;
    }
}
