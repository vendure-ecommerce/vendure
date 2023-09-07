import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Input,
    isDevMode,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { CodeJar } from 'codejar';
import { tap } from 'rxjs/operators';

import { UIExtensionLocationId } from '../../../common/component-registry-types';
import { DataService } from '../../../data/providers/data.service';
import { DropdownComponent } from '../dropdown/dropdown.component';

type UiExtensionType = 'actionBar' | 'navMenu' | 'detailComponent' | 'dataTable';

@Component({
    selector: 'vdr-ui-extension-point',
    templateUrl: './ui-extension-point.component.html',
    styleUrls: ['./ui-extension-point.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiExtensionPointComponent implements OnInit, AfterViewInit {
    @Input() locationId: UIExtensionLocationId;
    @Input() metadata?: any;
    @Input() topPx: number;
    @Input() leftPx: number;
    @HostBinding('style.display')
    @Input()
    display: 'block' | 'inline-block' = 'inline-block';
    @Input() api: UiExtensionType;
    @ViewChild('editor') private editorElementRef: ElementRef<HTMLDivElement>;
    @ViewChild('dropdownComponent') private dropdownComponent: DropdownComponent;
    display$: Observable<boolean>;
    jar: CodeJar;
    readonly isDevMode = isDevMode();

    constructor(private dataService: DataService) {}

    getCodeTemplate(api: UiExtensionType): string {
        return codeTemplates[api](this.locationId, this.metadata).trim();
    }

    ngOnInit(): void {
        this.display$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.displayUiExtensionPoints)
            .pipe(
                tap(display => {
                    if (display) {
                        setTimeout(() => {
                            const highlight = (editor: HTMLElement) => {
                                const code = editor.textContent ?? '';
                                editor.innerHTML = highlightTsCode(this.getCodeTemplate(this.api));
                            };
                            this.editorElementRef.nativeElement.contentEditable = 'false';
                            this.jar = CodeJar(this.editorElementRef.nativeElement, highlight);
                            this.jar.updateCode(this.getCodeTemplate(this.api));
                        });
                    }
                }),
            );
    }

    ngAfterViewInit() {
        // this.dropdownComponent.onOpenChange(isOpen => {
        //     if (isOpen) {
        //     }
        // });
    }
}

function highlightTsCode(tsCode: string) {
    tsCode = tsCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return tsCode.replace(
        /\b(abstract|any|as|boolean|break|case|catch|class|const|continue|default|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|never|new|null|number|object|of|private|protected|public|readonly|require|return|set|static|string|super|switch|symbol|this|throw|true|try|type|typeof|undefined|var|void|while|with|yield)\b|\/\/.*|\/\*[\s\S]*?\*\/|"(?:\\[\s\S]|[^\\"])*"|'[^']*'/g,
        (match, ...args) => {
            if (/^"/.test(match) || /^'/.test(match)) {
                return '<span class="ts-string">' + match + '</span>';
            } else if (/\/\/.*|\/\*[\s\S]*?\*\//.test(match)) {
                return '<span class="ts-comment">' + match + '</span>';
            } else if (
                /\b(abstract|any|as|boolean|break|case|catch|class|const|continue|default|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|never|new|null|number|object|of|private|protected|public|readonly|require|return|set|static|string|super|switch|symbol|this|throw|true|try|type|typeof|undefined|var|void|while|with|yield)\b/.test(
                    match,
                )
            ) {
                return '<span class="ts-keyword">' + match + '</span>';
            } else {
                return '<span class="ts-default">' + match + '</span>';
            }
        },
    );
}

const codeTemplates: Record<UiExtensionType, (locationId: UIExtensionLocationId, metadata: any) => string> = {
    actionBar: locationId => `
import { addActionBarItem } from '@vendure/admin-ui/core';

export default [
  addActionBarItem({
    id: 'my-button',
    label: 'My Action',
    locationId: '${locationId}',
  });
]`,
    navMenu: locationId => `
import { addNavMenuSection } from '@vendure/admin-ui/core';

export default [
  addNavMenuSection({
      id: 'my-menu-item',
      label: 'My Menu Item',
      routerLink: ['/extensions/my-plugin'],
    }
    '${locationId}'
  );
]`,
    detailComponent: locationId => `
import { registerCustomDetailComponent } from '@vendure/admin-ui/core';

export default [
  registerCustomDetailComponent({
    locationId: '${locationId}',
    component: MyCustomComponent,
  });
]`,
    dataTable: (locationId, metadata) => `
import { registerDataTableComponent } from '@vendure/admin-ui/core';

export default [
  registerDataTableComponent({
    tableId: '${locationId}',
    columnId: '${metadata}',
    component: MyCustomComponent,
  });
]`,
};
