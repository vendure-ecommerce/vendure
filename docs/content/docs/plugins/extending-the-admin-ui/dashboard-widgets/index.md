---
title: 'Dashboard Widgets'
---

# Dashboard Widgets

Dashboard widgets are components which can be added to the Admin UI dashboard. These widgets are useful for displaying information which is commonly required by administrations, such as sales summaries, lists of incomplete orders, notifications, etc.

The Admin UI comes with a handful of widgets, and you can also create your own widgets.

{{< figure src="./dashboard-widgets.jpg" caption="Dashboard widgets" >}}

## Example: Reviews Widget

In this example we will use a hypothetical reviews plugin, which allows customers to write product reviews. These reviews then get approved by an Administrator before being displayed in the storefront.

To notify administrators about new reviews that need approval, we'll create a dashboard widget.

### Create the widget

A dashboard widget is an Angular component. This example features a simplified UI, just to illustrate the overall strucutre:

```TypeScript
import { Component, NgModule, OnInit } from '@angular/core';
import { DataService, SharedModule } from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'reviews-widget',
  template: `
    <ul>
      <li *ngFor="let review of pendingReviews$ | async">
        <a [routerLink]="['/extensions', 'product-reviews', review.id]">{{ review.summary }}</a>
        <span class="rating">{{ review.rating }} / 5</span>
      </li>
    </ul>
  `,
})
export class ReviewsWidgetComponent implements OnInit {
  pendingReviews$: Observable<GetAllReviews.Items[]>;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.pendingReviews$ = this.dataService.query(gql`
      query GetAllReviews($options: ProductReviewListOptions) {
        productReviews(options: $options) {
          items {
            id
            createdAt
            authorName
            summary
            rating
          }
        }
      }`, {
        options: {
          filter: {
              state: { eq: 'new' },
          },
          take: 10,
        },
      })
      .mapStream(data => data.productReviews.items);
  }
}

@NgModule({
    imports: [SharedModule],
    declarations: [ReviewsWidgetComponent],
})
export class ReviewsWidgetModule {}
```

{{% alert %}}
Note that we also need to define an `NgModule` for this component. This is because we will be lazy-loading the component at run-time, and the NgModule is required for us to use shared providers (e.g. `DataService`) and any shared components, directives or pipes defined in the `@vendure/admin-ui/core` package.
{{% /alert %}}

### Register the widget

Our widget now needs to be registered as part of a [shared module]({{< relref "extending-the-admin-ui" >}}#lazy-vs-shared-modules):

```TypeScript
import { NgModule } from '@angular/core';
import { registerDashboardWidget } from '@vendure/admin-ui/core';
import { reviewPermission } from '../constants';

@NgModule({
  imports: [],
  declarations: [],
  providers: [
    registerDashboardWidget('reviews', {
      title: 'Latest reviews',
      supportedWidths: [4, 6, 8, 12],
      requiresPermissions: [reviewPermission.Read],
      loadComponent: () =>
        import('./reviews-widget/reviews-widget.component').then(
          m => m.ReviewsWidgetComponent,
        ),
    }),
  ],
})
export class MySharedUiExtensionModule {}
```

* **`title`** This is the title of the widget that will be displayed in the widget header.
* **`supportedWidths`** This indicated which widths are supported by the widget. The number indicates columns in a Bootstrap-style 12-column grid. So `12` would be full-width, `6` half-width, etc. In the UI, the administrator will be able to re-size the widget to one of the supported widths. If not provided, all widths will be allowed.
* **`requiresPermissions`** This allows an array of Permissions to be specified which limit the display of the widget to administrators who possess all of those permissions. If not provided, all administrators will be able to use the widget.
* **`loadComponent`** This function defines how to load the component. Using the dynamic `import()` syntax will enable the Angular compiler to intelligently generate a lazy-loaded JavaScript bundle just for that component. This means that your widget can, for example, include 3rd-party dependencies (such as a charting library) without increasing the bundle size (and therefore load-times) of the main Admin UI app. The widget-specific code will _only_ be loaded when the widget is rendered on the dashboard.

Once registered, the reviews widget will be available to select by administrators with the appropriate permissions.

## Setting the default widget layout

While administrators can customize which widgets they want to display on the dashboard, and the layout of those widgets, you can also set a default layout:

```TypeScript
import { NgModule } from '@angular/core';
import { registerDashboardWidget, setDashboardWidgetLayout } from '@vendure/admin-ui/core';
import { reviewPermission } from '../constants';

@NgModule({
  imports: [],
  declarations: [],
  providers: [
    registerDashboardWidget('reviews', {
      // omitted for brevity
    }),
    setDashboardWidgetLayout([
      { id: 'welcome', width: 12 },
      { id: 'orderSummary', width: 4 },
      { id: 'latestOrders', width: 8 },
      { id: 'reviews', width: 6 },
    ]),
  ],
})
export class MySharedUiExtensionModule {}
```

This defines the order of widgets with their default widths. The actual layout in terms of rows and columns will be calculated at run-time based on what will fit on each row.
