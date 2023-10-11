---
title: "RegisterHistoryEntryComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerHistoryEntryComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/register-history-entry-component.ts" sourceLine="68" packageName="@vendure/admin-ui" since="1.9.0" />

Registers a <a href='/reference/admin-ui-api/custom-history-entry-components/history-entry-component#historyentrycomponent'>HistoryEntryComponent</a> for displaying history entries in the Order/Customer
history timeline.

*Example*

```ts
import { Component } from '@angular/core';
import {
    CustomerFragment,
    CustomerHistoryEntryComponent,
    registerHistoryEntryComponent,
    SharedModule,
    TimelineDisplayType,
    TimelineHistoryEntry,
} from '@vendure/admin-ui/core';

@Component({
    selector: 'tax-id-verification-component',
    template: `
        <div *ngIf="entry.data.valid">
          Tax ID <strong>{{ entry.data.taxId }}</strong> was verified
          <vdr-history-entry-detail *ngIf="entry.data">
            <vdr-object-tree [value]="entry.data"></vdr-object-tree>
          </vdr-history-entry-detail>
        </div>
        <div *ngIf="entry.data.valid">Tax ID {{ entry.data.taxId }} could not be verified</div>
    `,
    standalone: true,
    imports: [SharedModule],
})
class TaxIdHistoryEntryComponent implements CustomerHistoryEntryComponent {
    entry: TimelineHistoryEntry;
    customer: CustomerFragment;

    getDisplayType(entry: TimelineHistoryEntry): TimelineDisplayType {
        return entry.data.valid ? 'success' : 'error';
    }

    getName(entry: TimelineHistoryEntry): string {
        return 'Tax ID Verification Plugin';
    }

    isFeatured(entry: TimelineHistoryEntry): boolean {
        return true;
    }

    getIconShape(entry: TimelineHistoryEntry) {
        return entry.data.valid ? 'check-circle' : 'exclamation-circle';
    }
}

export default [
    registerHistoryEntryComponent({
        type: 'CUSTOMER_TAX_ID_VERIFICATION',
        component: TaxIdHistoryEntryComponent,
    }),
];
```

```ts title="Signature"
function registerHistoryEntryComponent(config: HistoryEntryConfig): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/custom-history-entry-components/history-entry-config#historyentryconfig'>HistoryEntryConfig</a>`} />

