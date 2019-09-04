import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'plugin-test-component',
    template: `
        <p>Test component works!!</p>
    `,
})
export class TestComponent {}

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'test',
                component: TestComponent,
            },
        ]),
    ],
    declarations: [TestComponent],
})
export class TestModule {}
