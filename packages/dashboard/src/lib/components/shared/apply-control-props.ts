import React from 'react';

/**
 * Fields with these names are never valid when empty or whitespace-only.
 * The GraphQL schema cannot tell us this: `String!` permits '', and translation and update inputs
 * are nullable throughout.
 */
const NON_BLANK_FIELD_NAMES = new Set([
    'name',
    'code',
    'sku',
    'slug',
    'firstName',
    'lastName',
    'emailAddress',
]);

/**
 * Injects `id` and `aria-invalid` props onto the rendered element via cloneElement.
 * Used by FormFieldWrapper and TranslatableFormFieldWrapper to wire up
 * accessibility attributes without requiring the consumer to do it manually.
 *
 * When `fieldName` is one of {@link NON_BLANK_FIELD_NAMES}, it also adds `required` and a
 * `pattern` that rejects whitespace-only values, so the browser blocks the form submit. Only
 * rendered inputs are validated, so the empty translation rows the form seeds for other languages
 * do not block saving. An input opts out with `required={false}`.
 */
export function applyControlProps(
    element: React.ReactNode,
    props: Record<string, unknown>,
    fieldName?: string,
) {
    if (!React.isValidElement(element)) return element;
    const elementProps = element.props as Record<string, unknown>;
    const nonBlank =
        fieldName !== undefined && NON_BLANK_FIELD_NAMES.has(fieldName) && elementProps.required !== false;
    return React.cloneElement(
        element as React.ReactElement<Record<string, unknown>>,
        nonBlank ? { required: true, pattern: String.raw`.*\S.*`, ...props } : props,
    );
}
