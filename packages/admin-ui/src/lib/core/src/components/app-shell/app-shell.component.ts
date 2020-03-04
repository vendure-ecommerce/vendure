import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../data/providers/data.service';
import { AuthService } from '../../providers/auth/auth.service';

@Component({
    selector: 'vdr-app-shell',
    templateUrl: './app-shell.component.html',
    styleUrls: ['./app-shell.component.scss'],
})
export class AppShellComponent implements OnInit {
    userName$: Observable<string>;

    constructor(private authService: AuthService, private dataService: DataService, private router: Router) {}

    ngOnInit() {
        this.userName$ = this.dataService.client
            .userStatus()
            .single$.pipe(map(data => data.userStatus.username));
    }

    logOut() {
        this.authService.logOut().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}
