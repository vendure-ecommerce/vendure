import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL } from '../../../app.config';
import { AuthService } from '../../../core/providers/auth/auth.service';

@Component({
    selector: 'vdr-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

    username = '';
    password = '';
    lastError = '';

    constructor(private authService: AuthService,
                private router: Router) { }

    logIn(): void {
        this.authService.logIn(this.username, this.password)
            .subscribe(
                () => this.router.navigate(['/']),
                (err: HttpErrorResponse) => {
                    switch (err.status) {
                        case 401:
                            this.lastError = 'Invalid username or password';
                            break;
                        case 0:
                            this.lastError = `Could not connect to the Vendure server at ${API_URL}`;
                            break;
                        default:
                            this.lastError = err.message;
                    }
                });
    }

}
