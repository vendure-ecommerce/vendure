import { ChangeDetectionStrategy, Component, Input, isDevMode, OnInit } from '@angular/core';
import { DataService } from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';

import { UIExtensionLocationId } from '../../../common/ui-extension-types';

@Component({
    selector: 'vdr-ui-extension-point',
    templateUrl: './ui-extension-point.component.html',
    styleUrls: ['./ui-extension-point.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiExtensionPointComponent implements OnInit {
    @Input() locationId: UIExtensionLocationId | string;
    @Input() topPx: number;
    @Input() leftPx: number;
    @Input() api: 'actionBar' | 'navMenu';
    display$: Observable<boolean>;
    readonly isDevMode = isDevMode();
    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.display$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.displayUiExtensionPoints);
    }
}
