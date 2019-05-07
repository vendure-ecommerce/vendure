import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import {
    Administrator,
    CreateAdministratorInput,
    LanguageCode,
    Permission,
    Role,
    UpdateAdministratorInput,
} from '../../../common/generated-types';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';

@Component({
    selector: 'vdr-admin-detail',
    templateUrl: './admin-detail.component.html',
    styleUrls: ['./admin-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDetailComponent extends BaseDetailComponent<Administrator> implements OnInit, OnDestroy {
    administrator$: Observable<Administrator>;
    allRoles$: Observable<Role.Fragment[]>;
    selectedRoles: Role.Fragment[] = [];
    detailForm: FormGroup;
    selectedRolePermissions: { [K in Permission]: boolean } = {} as any;

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService);
        this.detailForm = this.formBuilder.group({
            emailAddress: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            password: [''],
            roles: [[]],
        });
    }

    ngOnInit() {
        this.init();
        this.administrator$ = this.entity$;
        this.allRoles$ = this.dataService.administrator.getRoles(99999).mapStream(item => item.roles.items);
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    rolesChanged(roles: Role[]) {
        this.buildPermissionsMap();
    }

    create() {
        const formValue = this.detailForm.value;
        const administrator: CreateAdministratorInput = {
            emailAddress: formValue.emailAddress,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            password: formValue.password,
            roleIds: formValue.roles.map(role => role.id),
        };
        this.dataService.administrator.createAdministrator(administrator).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), {
                    entity: 'Administrator',
                });
                this.detailForm.markAsPristine();
                this.changeDetector.markForCheck();
                this.router.navigate(['../', data.createAdministrator.id], { relativeTo: this.route });
            },
            err => {
                this.notificationService.error(_('common.notify-create-error'), {
                    entity: 'Administrator',
                });
            },
        );
    }

    save() {
        this.administrator$
            .pipe(
                take(1),
                mergeMap(({ id }) => {
                    const formValue = this.detailForm.value;
                    const administrator: UpdateAdministratorInput = {
                        id,
                        emailAddress: formValue.emailAddress,
                        firstName: formValue.firstName,
                        lastName: formValue.lastName,
                        password: formValue.password,
                        roleIds: formValue.roles.map(role => role.id),
                    };
                    return this.dataService.administrator.updateAdministrator(administrator);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Administrator',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Administrator',
                    });
                },
            );
    }

    protected setFormValues(administrator: Administrator, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            emailAddress: administrator.emailAddress,
            firstName: administrator.firstName,
            lastName: administrator.lastName,
            roles: administrator.user.roles,
        });
        const passwordControl = this.detailForm.get('password');
        if (passwordControl) {
            if (!administrator.id) {
                passwordControl.setValidators([Validators.required]);
            } else {
                passwordControl.setValidators([]);
            }
        }
        this.buildPermissionsMap();
    }

    private buildPermissionsMap() {
        const permissionsControl = this.detailForm.get('roles');
        if (permissionsControl) {
            const permissions = permissionsControl.value.reduce(
                (output, role: Role) => [...output, ...role.permissions],
                [],
            );
            this.selectedRolePermissions = {} as any;
            for (const permission of Object.keys(Permission)) {
                this.selectedRolePermissions[permission] = permissions.includes(permission);
            }
        }
    }
}
