import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'vdr-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent {
    constructor(private route: ActivatedRoute, private router: Router) {}

    /**
     * Work-around for routerLinkActive on links which include queryParams.
     * See https://github.com/angular/angular/issues/13205
     */
    isLinkActive(route: string): boolean {
        return this.router.url.startsWith(route);
    }
}
