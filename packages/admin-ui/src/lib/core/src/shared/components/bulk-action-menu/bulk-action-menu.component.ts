import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BulkActionRegistryService } from '../../../providers/bulk-action-registry/bulk-action-registry.service';
import { BulkAction, BulkActionLocationId } from '../../../providers/bulk-action-registry/bulk-action-types';

@Component({
    selector: 'vdr-bulk-action-menu',
    templateUrl: './bulk-action-menu.component.html',
    styleUrls: ['./bulk-action-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkActionMenuComponent<T = any> implements OnInit {
    @Input() locationId: BulkActionLocationId;
    @Input() selection: T[];
    actions: Array<BulkAction<T>>;

    constructor(
        private bulkActionRegistryService: BulkActionRegistryService,
        private injector: Injector,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.actions = this.bulkActionRegistryService.getBulkActionsForLocation(this.locationId);
    }

    actionClick(event: MouseEvent, action: BulkAction) {
        action.onClick({
            injector: this.injector,
            event,
            route: this.route,
            selection: this.selection,
        });
    }
}
