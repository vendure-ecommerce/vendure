import { Component, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { DataService } from '../../data/providers/data.service';

import { IfPermissionsDirective } from './if-permissions.directive';

describe('vdrIfPermissions directive', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [TestComponent, IfPermissionsDirective],
            providers: [{ provide: DataService, useClass: MockDataService }],
        }).createComponent(TestComponent);
        fixture.detectChanges(); // initial binding
    });

    it('has permission', () => {
        fixture.componentInstance.permissionToTest = 'ValidPermission';
        fixture.detectChanges();

        const thenEl = fixture.nativeElement.querySelector('.then');
        expect(thenEl).not.toBeNull();
        const elseEl = fixture.nativeElement.querySelector('.else');
        expect(elseEl).toBeNull();
    });

    it('does not have permission', () => {
        fixture.componentInstance.permissionToTest = 'InvalidPermission';
        fixture.detectChanges();

        const thenEl = fixture.nativeElement.querySelector('.then');
        expect(thenEl).toBeNull();
        const elseEl = fixture.nativeElement.querySelector('.else');
        expect(elseEl).not.toBeNull();
    });
});

@Component({
    template: `
        <div *vdrIfPermissions="permissionToTest; else noPerms">
            <span class="then"></span>
        </div>
        <ng-template #noPerms><span class="else"></span></ng-template>
    `,
})
export class TestComponent {
    @Input() permissionToTest = '';
}

class MockDataService {
    client = {
        userStatus() {
            return {
                mapStream: (mapFn: any) =>
                    of(
                        mapFn({
                            userStatus: {
                                permissions: ['ValidPermission'],
                            },
                        }),
                    ),
            };
        },
    };
}
