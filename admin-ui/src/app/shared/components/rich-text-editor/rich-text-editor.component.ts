import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Trix {
    editor: any;
}

/**
 * A rich text (HTML) editor based on Trix (https://github.com/basecamp/trix)
 */
@Component({
    selector: 'vdr-rich-text-editor',
    templateUrl: './rich-text-editor.component.html',
    styleUrls: ['./rich-text-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: RichTextEditorComponent,
            multi: true,
        },
    ],
})
export class RichTextEditorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
    @Input() label: string;

    id = Math.random()
        .toString(36)
        .substr(3);
    onChange: (val: any) => void;
    onTouch: () => void;
    disabled = false;
    private initialized = false;

    @ViewChild('trixEditor', { static: true }) private trixEditor: ElementRef;

    constructor(private changeDetector: ChangeDetectorRef) {}

    get trix(): HTMLElement & Trix {
        return this.trixEditor ? this.trixEditor.nativeElement : {};
    }

    onTrixChangeHandler = () => {
        if (this.initialized) {
            this.onChange(this.trix.innerHTML);
            this.changeDetector.markForCheck();
        }
    };

    onTrixFocusHandler = () => {
        if (this.initialized) {
            this.onTouch();
            this.changeDetector.markForCheck();
        }
    };

    ngAfterViewInit() {
        this.trix.addEventListener('trix-change', this.onTrixChangeHandler);
        this.trix.addEventListener('trix-focus', this.onTrixFocusHandler);
    }

    ngOnDestroy() {
        this.trix.removeEventListener('trix-change', this.onTrixChangeHandler);
        this.trix.removeEventListener('trix-focus', this.onTrixFocusHandler);
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    writeValue(value: any) {
        if (this.trix.innerHTML !== value) {
            if (!this.initialized) {
                setTimeout(() => {
                    this.trix.editor.loadHTML(value);
                    this.initialized = true;
                });
            }
        }
    }
}
