import { CdkObserveContent } from '@angular/cdk/observers';
import { Component, type ElementRef, computed, contentChildren, input, viewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { BrnTabsPaginatedListDirective, BrnTabsTriggerDirective } from '@spartan-ng/brain/tabs';
import { buttonVariants } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';
import { listVariants } from './hlm-tabs-list.component';

@Component({
	selector: 'hlm-paginated-tabs-list',
	standalone: true,
	imports: [CdkObserveContent, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
	template: `
		<button
			#previousPaginator
			data-pagination="previous"
			type="button"
			aria-hidden="true"
			tabindex="-1"
			[class.flex]="_showPaginationControls()"
			[class.hidden]="!_showPaginationControls()"
			[class]="_paginationButtonClass()"
			[disabled]="_disableScrollBefore || null"
			(click)="_handlePaginatorClick('before')"
			(mousedown)="_handlePaginatorPress('before', $event)"
			(touchend)="_stopInterval()"
		>
			<ng-icon hlm size="base" name="lucideChevronLeft" />
		</button>

		<div #tabListContainer class="z-[1] flex grow overflow-hidden" (keydown)="_handleKeydown($event)">
			<div class="relative grow transition-transform" #tabList role="tablist" (cdkObserveContent)="_onContentChanges()">
				<div #tabListInner [class]="_tabListClass()">
					<ng-content></ng-content>
				</div>
			</div>
		</div>

		<button
			#nextPaginator
			data-pagination="next"
			type="button"
			aria-hidden="true"
			tabindex="-1"
			[class.flex]="_showPaginationControls()"
			[class.hidden]="!_showPaginationControls()"
			[class]="_paginationButtonClass()"
			[disabled]="_disableScrollAfter || null"
			(click)="_handlePaginatorClick('after')"
			(mousedown)="_handlePaginatorPress('after', $event)"
			(touchend)="_stopInterval()"
		>
			<ng-icon hlm size="base" name="lucideChevronRight" />
		</button>
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmTabsPaginatedListComponent extends BrnTabsPaginatedListDirective {
	public readonly _items = contentChildren(BrnTabsTriggerDirective, { descendants: false });
	public readonly _itemsChanges = toObservable(this._items);

	public readonly _tabListContainer = viewChild.required<ElementRef<HTMLElement>>('tabListContainer');
	public readonly _tabList = viewChild.required<ElementRef<HTMLElement>>('tabList');
	public readonly _tabListInner = viewChild.required<ElementRef<HTMLElement>>('tabListInner');
	public readonly _nextPaginator = viewChild.required<ElementRef<HTMLElement>>('nextPaginator');
	public readonly _previousPaginator = viewChild.required<ElementRef<HTMLElement>>('previousPaginator');

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex overflow-hidden relative gap-1 flex-shrink-0', this.userClass()),
	);

	public readonly tabLisClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _tabListClass = computed(() => hlm(listVariants(), this.tabLisClass()));

	public readonly paginationButtonClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _paginationButtonClass = computed(() =>
		hlm(
			'relative z-[2] select-none disabled:cursor-default',
			buttonVariants({ variant: 'ghost', size: 'icon' }),
			this.paginationButtonClass(),
		),
	);

	protected _itemSelected(event: KeyboardEvent) {
		event.preventDefault();
	}
}
