import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Permission } from 'shared/generated-types';

/**
 * A table showing and allowing the setting of all possible CRUD permissions.
 */
@Component({
    selector: 'vdr-permission-grid',
    templateUrl: './permission-grid.component.html',
    styleUrls: ['./permission-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class PermissionGridComponent {
    @Input() permissions: { [K in Permission]: boolean } = {} as any;
    @Input() readonly = false;
    @Output() permissionChange = new EventEmitter<{ permission: string; value: boolean }>();

    setPermission(permission: string, value: boolean) {
        this.permissionChange.emit({ permission, value });
    }
}
