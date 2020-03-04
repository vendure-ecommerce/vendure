import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'vdr-entity-info',
    templateUrl: './entity-info.component.html',
    styleUrls: ['./entity-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityInfoComponent {
    @Input() small = false;
    @Input() entity: { id: string; createdAt?: string; updatedAt?: string };
}
