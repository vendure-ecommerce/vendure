import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavMenuSection } from '../../providers/nav-builder/nav-builder-types';
import { BaseNavComponent } from '../base-nav/base-nav.component';

@Component({
    selector: 'vdr-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent extends BaseNavComponent implements OnInit {
    mainMenuConfig$: Observable<NavMenuSection[]>;

    override ngOnInit(): void {
        super.ngOnInit();

        this.mainMenuConfig$ = this.navBuilderService.menuConfig$.pipe(
            map(sections => sections.filter(s => s.displayMode === 'regular' || !s.displayMode)),
        );
    }
}
