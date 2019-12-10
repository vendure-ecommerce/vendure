import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ExtensionHostConfig } from './extension-host-config';
import { ExtensionHostService } from './extension-host.service';

@Component({
    selector: 'vdr-extension-host',
    templateUrl: './extension-host.component.html',
    styleUrls: ['./extension-host.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [ExtensionHostService],
})
export class ExtensionHostComponent implements OnInit {
    extensionUrl: SafeResourceUrl;
    @ViewChild('extensionFrame', { static: true }) private extensionFrame: ElementRef<HTMLIFrameElement>;

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private extensionHostService: ExtensionHostService,
    ) {}

    ngOnInit() {
        const { data } = this.route.snapshot;
        if (!this.isExtensionHostConfig(data.extensionHostConfig)) {
            throw new Error(
                `Expected an ExtensionHostConfig object, got ${JSON.stringify(data.extensionHostConfig)}`,
            );
        }
        this.extensionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            data.extensionHostConfig.extensionUrl || 'about:blank',
        );
        const { contentWindow } = this.extensionFrame.nativeElement;
        if (contentWindow) {
            this.extensionHostService.init(contentWindow);
        }
    }

    private isExtensionHostConfig(input: any): input is ExtensionHostConfig {
        return input.hasOwnProperty('extensionUrl');
    }
}
