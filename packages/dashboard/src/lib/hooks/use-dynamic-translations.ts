import { camelCaseToTitleCase } from '@/vdb/lib/utils.js';
import { useLingui } from '@lingui/react';

export function useDynamicTranslations() {
    const { i18n } = useLingui();

    const getTranslatedFieldName = (fieldId: string) => {
        const fieldNameTranslationId = `fieldName.${fieldId}`;
        const translatedDisplay = i18n.t(fieldNameTranslationId);
        return translatedDisplay !== fieldNameTranslationId
            ? translatedDisplay
            : camelCaseToTitleCase(fieldId);
    };

    const getTranslatedOrderState = (state: string) => {
        const stateTranslationId = `orderState.${state}`;
        const translatedDisplay = i18n.t(stateTranslationId);
        return translatedDisplay !== stateTranslationId ? translatedDisplay : camelCaseToTitleCase(state);
    };

    const getTranslatedFulfillmentState = (state: string) => {
        const stateTranslationId = `fulfillmentState.${state}`;
        const translatedDisplay = i18n.t(stateTranslationId);
        return translatedDisplay !== stateTranslationId ? translatedDisplay : camelCaseToTitleCase(state);
    };

    const getTranslatedPaymentState = (state: string) => {
        const stateTranslationId = `paymentState.${state}`;
        const translatedDisplay = i18n.t(stateTranslationId);
        return translatedDisplay !== stateTranslationId ? translatedDisplay : camelCaseToTitleCase(state);
    };

    const getTranslatedRefundState = (state: string) => {
        const stateTranslationId = `refundState.${state}`;
        const translatedDisplay = i18n.t(stateTranslationId);
        return translatedDisplay !== stateTranslationId ? translatedDisplay : camelCaseToTitleCase(state);
    };

    return {
        getTranslatedFieldName,
        getTranslatedOrderState,
        getTranslatedFulfillmentState,
        getTranslatedPaymentState,
        getTranslatedRefundState,
    };
}
