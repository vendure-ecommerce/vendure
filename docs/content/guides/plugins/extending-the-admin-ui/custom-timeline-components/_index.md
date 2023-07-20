---
title: 'Custom History Timeline Components'
weight: 6
---

# Custom History Timeline Components

The Order & Customer detail pages feature a timeline of history entries. Since v1.9.0 it is possible to define custom history entry types - see the [HistoryService docs]({{< relref "history-service" >}}) for an example.

You can also define a custom Angular component to render any timeline entry using the [registerHistoryEntryComponent function]({{< relref "register-history-entry-component" >}}).

{{< figure src="./timeline-entry.webp" >}}

Following the example used in the HistoryService docs, we can define a component to render the tax ID verification
entry in our Customer timeline:

```TypeScript
import { Component, NgModule } from '@angular/core';
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

@NgModule({
  imports: [SharedModule],
  declarations: [TaxIdHistoryEntryComponent],
  providers: [
    registerHistoryEntryComponent({
      type: 'CUSTOMER_TAX_ID_VERIFICATION', 
      component:TaxIdHistoryEntryComponent,
    }),
  ]
})
export class SharedExtensionModule {}
```


