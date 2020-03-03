import { Component } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Type } from '@vendure/common/lib/shared-types';

import { CurrencyNamePipe } from '../../pipes/currency-name.pipe';
import { AffixedInputComponent } from '../affixed-input/affixed-input.component';

import { CurrencyInputComponent } from './currency-input.component';

describe('CurrencyInputComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [
                TestControlValueAccessorComponent,
                TestSimpleComponent,
                CurrencyInputComponent,
                AffixedInputComponent,
                CurrencyNamePipe,
            ],
        }).compileComponents();
    }));

    it('should display the price as decimal with a simple binding', fakeAsync(() => {
        const fixture = createAndRunChangeDetection(TestSimpleComponent);
        const nativeInput = getNativeInput(fixture);
        expect(nativeInput.value).toBe('1.23');
    }));

    it('should display the price as decimal', fakeAsync(() => {
        const fixture = createAndRunChangeDetection(TestControlValueAccessorComponent);
        const nativeInput = getNativeInput(fixture);
        expect(nativeInput.value).toBe('1.23');
    }));

    it('should display 2 decimal places for multiples of 10', fakeAsync(() => {
        const fixture = createAndRunChangeDetection(TestControlValueAccessorComponent, 120);
        const nativeInput = getNativeInput(fixture);
        expect(nativeInput.value).toBe('1.20');
    }));

    it('should discard decimal places from input value', fakeAsync(() => {
        const fixture = createAndRunChangeDetection(TestControlValueAccessorComponent, 123.5);

        const nativeInput = getNativeInput(fixture);
        expect(nativeInput.value).toBe('1.23');
    }));

    it('should correctly round decimal value ', fakeAsync(() => {
        const fixture = createAndRunChangeDetection(TestControlValueAccessorComponent);
        const nativeInput = fixture.debugElement.query(By.css('input[type="number"]'));
        nativeInput.triggerEventHandler('input', { target: { value: 1.13 } });
        tick();
        fixture.detectChanges();
        expect(fixture.componentInstance.price).toBe(113);
    }));

    it('should update model with integer values for values of more than 2 decimal places', fakeAsync(() => {
        const fixture = createAndRunChangeDetection(TestControlValueAccessorComponent);
        const nativeInput = fixture.debugElement.query(By.css('input[type="number"]'));
        nativeInput.triggerEventHandler('input', { target: { value: 1.567 } });
        tick();
        fixture.detectChanges();
        expect(fixture.componentInstance.price).toBe(157);
    }));

    function createAndRunChangeDetection<T extends TestControlValueAccessorComponent | TestSimpleComponent>(
        component: Type<T>,
        priceValue = 123,
    ): ComponentFixture<T> {
        const fixture = TestBed.createComponent(component);
        fixture.componentInstance.price = priceValue;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        return fixture;
    }

    function getNativeInput(_fixture: ComponentFixture<TestControlValueAccessorComponent>): HTMLInputElement {
        return _fixture.debugElement.query(By.css('input[type="number"]')).nativeElement;
    }
});

@Component({
    selector: 'vdr-test-component',
    template: `
        <vdr-currency-input [(ngModel)]="price"></vdr-currency-input>
    `,
})
class TestControlValueAccessorComponent {
    price = 123;
}

@Component({
    selector: 'vdr-test-component',
    template: `
        <vdr-currency-input [value]="price"></vdr-currency-input>
    `,
})
class TestSimpleComponent {
    price = 123;
}
