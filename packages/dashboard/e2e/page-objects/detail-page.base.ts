import { type Locator, type Page, expect } from '@playwright/test';

export interface DetailPageConfig {
    /** URL path for the "new" form, e.g. '/tax-categories/new' */
    newPath: string;
    /** URL path prefix for existing entities, e.g. '/tax-categories/' */
    pathPrefix: string;
    /** The page title shown when creating a new entity, e.g. 'New tax category' */
    newTitle: string;
}

export interface FieldInput {
    /** The label text as it appears in the <label> element */
    label: string;
    /** The value to type/set */
    value: string | boolean;
    /** Field type — defaults to 'input' */
    type?: 'input' | 'switch';
}

/**
 * Base page object for all detail (create/edit) pages.
 *
 * Detail pages follow a consistent pattern:
 * - Every field is wrapped in a `[data-slot="form-item"]` container
 *   with a `[data-slot="form-label"]` child
 * - Submit button says "Create" for new entities or "Update" for existing ones
 * - Success/error feedback via Sonner toasts
 *
 * Note: We locate fields by finding the form-item container that has a matching
 * label, then targeting the input/switch inside. We can't use `getByLabel()`
 * because `OverriddenFormComponent` sits between the `FormControl` Slot and the
 * actual input, breaking the htmlFor→id association.
 */
export class BaseDetailPage {
    readonly createButton: Locator;
    readonly updateButton: Locator;

    constructor(
        protected page: Page,
        protected config: DetailPageConfig,
    ) {
        this.createButton = page.getByRole('button', { name: 'Create', exact: true });
        this.updateButton = page.getByRole('button', { name: 'Update', exact: true });
    }

    async gotoNew() {
        await this.page.goto(this.config.newPath);
    }

    async gotoExisting(id: string) {
        await this.page.goto(`${this.config.pathPrefix}${id}`);
    }

    async expectNewPageLoaded() {
        await expect(this.page.getByRole('heading', { name: this.config.newTitle })).toBeVisible();
    }

    /**
     * Locate the form-item container for a given label text.
     * This is the [data-slot="form-item"] div that wraps both the label and the input.
     * Uses exact text matching to avoid ambiguity (e.g. "Name" vs "First name").
     */
    formItem(label: string): Locator {
        return this.page.locator('[data-slot="form-item"]').filter({
            has: this.page.locator('[data-slot="form-label"]').getByText(label, { exact: true }),
        });
    }

    /** Fill a text input field identified by its label. */
    async fillInput(label: string, value: string) {
        await this.formItem(label).getByRole('textbox').fill(value);
    }

    /** Toggle a switch field identified by its label. */
    async toggleSwitch(label: string, checked: boolean) {
        const switchEl = this.formItem(label).getByRole('switch');
        const isChecked = await switchEl.isChecked();
        if (isChecked !== checked) {
            await switchEl.click();
        }
    }

    /** Fill multiple fields at once from a config array. */
    async fillFields(fields: FieldInput[]) {
        for (const field of fields) {
            if (field.type === 'switch') {
                await this.toggleSwitch(field.label, field.value as boolean);
            } else {
                await this.fillInput(field.label, field.value as string);
            }
        }
    }

    async clickCreate() {
        await this.createButton.click();
    }

    async clickUpdate() {
        await this.updateButton.click();
    }

    /** Submit the form with the appropriate button based on whether we're creating or updating. */
    async save(isNew: boolean) {
        if (isNew) {
            await this.clickCreate();
        } else {
            await this.clickUpdate();
        }
    }

    /** Wait for a success toast to appear (handles both toast.success and toast with text). */
    async expectSuccessToast(textMatch?: string | RegExp) {
        if (textMatch) {
            await expect(
                this.page.locator('[data-sonner-toast]').filter({ hasText: textMatch }).first(),
            ).toBeVisible({ timeout: 10_000 });
        } else {
            await expect(this.page.locator('[data-sonner-toast][data-type="success"]').first()).toBeVisible({
                timeout: 10_000,
            });
        }
    }

    /** Expect an error toast to appear. */
    async expectErrorToast() {
        await expect(this.page.locator('[data-sonner-toast][data-type="error"]').first()).toBeVisible({
            timeout: 10_000,
        });
    }

    /** Wait for navigation to the detail page of a newly created entity. */
    async expectNavigatedToExisting() {
        // After creation, the URL changes from .../new to .../<id>
        await expect(this.page).not.toHaveURL(/\/new/, { timeout: 10_000 });
        await expect(this.page).toHaveURL(new RegExp(this.config.pathPrefix));
    }

    /** Dismiss the "Confirm navigation" dialog if dirty form state is detected. */
    async confirmNavigation() {
        const dialog = this.page.getByRole('alertdialog');
        if (await dialog.isVisible()) {
            await dialog.getByRole('button', { name: 'Confirm' }).click();
        }
    }
}
