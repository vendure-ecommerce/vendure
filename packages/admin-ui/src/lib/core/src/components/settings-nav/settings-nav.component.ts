import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavMenuSection } from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseNavComponent } from '../base-nav/base-nav.component';

@Component({
    selector: 'vdr-settings-nav',
    templateUrl: './settings-nav.component.html',
    styleUrls: ['./settings-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsNavComponent extends BaseNavComponent implements OnInit {
    settingsMenuConfig$: Observable<NavMenuSection[]>;

    override ngOnInit(): void {
        super.ngOnInit();

        this.settingsMenuConfig$ = this.navBuilderService.menuConfig$.pipe(
            map(sections => sections.filter(s => s.displayMode === 'settings')),
        );
    }
}
