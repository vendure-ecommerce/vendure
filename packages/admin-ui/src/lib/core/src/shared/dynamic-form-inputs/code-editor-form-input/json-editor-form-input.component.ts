import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DefaultFormComponentConfig, DefaultFormComponentId } from '@vendure/common/lib/shared-types';
import { CodeJar } from 'codejar';

import { FormInputComponent } from '../../../common/component-registry-types';

export function jsonValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const error: ValidationErrors = { jsonInvalid: true };

        try {
            JSON.parse(control.value);
        } catch (e) {
            control.setErrors(error);
            return error;
        }

        control.setErrors(null);
        return null;
    };
}

/**
 * @description
 * A JSON editor input with syntax highlighting and error detection. Works well
 * with `text` type fields.
 *
 * @docsCategory custom-input-components
 * @docsPage default-inputs
 */
@Component({
    selector: 'vdr-json-editor-form-input',
    templateUrl: './json-editor-form-input.component.html',
    styleUrls: ['./json-editor-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonEditorFormInputComponent implements FormInputComponent, AfterViewInit, OnInit {
    static readonly id: DefaultFormComponentId = 'json-editor-form-input';
    readonly: boolean;
    formControl: FormControl;
    config: DefaultFormComponentConfig<'json-editor-form-input'>;
    isValid = true;
    errorMessage: string | undefined;
    @ViewChild('editor') private editorElementRef: ElementRef<HTMLDivElement>;
    jar: CodeJar;

    constructor(private changeDetector: ChangeDetectorRef) {}

    get height() {
        return this.config.ui?.height || this.config.height;
    }

    ngOnInit() {
        this.formControl.addValidators(jsonValidator());
    }

    ngAfterViewInit() {
        let lastVal = '';
        const highlight = (editor: HTMLElement) => {
            const code = editor.textContent ?? '';
            if (code === lastVal) {
                return;
            }
            lastVal = code;
            this.errorMessage = this.getJsonError(code);
            this.changeDetector.markForCheck();
            editor.innerHTML = this.syntaxHighlight(code, this.getErrorPos(this.errorMessage));
        };
        this.jar = CodeJar(this.editorElementRef.nativeElement, highlight);
        this.jar.onUpdate(value => {
            this.formControl.setValue(value);
            this.formControl.markAsDirty();
            this.isValid = this.formControl.valid;
        });
        this.jar.updateCode(this.formControl.value);

        if (this.readonly) {
            this.editorElementRef.nativeElement.contentEditable = 'false';
        }
    }

    private getJsonError(json: string): string | undefined {
        try {
            JSON.parse(json);
        } catch (e) {
            return e.message;
        }
        return;
    }

    private getErrorPos(errorMessage: string | undefined): number | undefined {
        if (!errorMessage) {
            return;
        }
        const matches = errorMessage.match(/at position (\d+)/);
        const pos = matches?.[1];
        return pos != null ? +pos : undefined;
    }

    private syntaxHighlight(json: string, errorPos: number | undefined) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        let hasMarkedError = false;
        return json.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            (match, ...args) => {
                let cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                let errorClass = '';
                if (errorPos && !hasMarkedError) {
                    const length = args[0].length;
                    const offset = args[4];
                    if (errorPos <= length + offset) {
                        errorClass = 'je-error';
                        hasMarkedError = true;
                    }
                }
                return '<span class="je-' + cls + ' ' + errorClass + '">' + match + '</span>';
            },
        );
    }
}
