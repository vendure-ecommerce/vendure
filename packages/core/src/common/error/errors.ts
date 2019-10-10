import { ID } from '@vendure/common/lib/shared-types';

import { coreEntitiesMap } from '../../entity/entities';
import { I18nError } from '../../i18n/i18n-error';

/**
 * @description
 * This error should be thrown when some unexpected and exceptional case is encountered.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class InternalServerError extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, 'INTERNAL_SERVER_ERROR');
    }
}

/**
 * @description
 * This error should be thrown when user input is not as expected.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class UserInputError extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, 'USER_INPUT_ERROR');
    }
}

/**
 * @description
 * This error should be thrown when an operation is attempted which is not allowed.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class IllegalOperationError extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, 'ILLEGAL_OPERATION');
    }
}

/**
 * @description
 * This error should be thrown when the user's authentication credentials do not match.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class UnauthorizedError extends I18nError {
    constructor() {
        super('error.unauthorized', {}, 'UNAUTHORIZED');
    }
}

/**
 * @description
 * This error should be thrown when a user attempts to access a resource which is outside of
 * his or her privileges.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class ForbiddenError extends I18nError {
    constructor() {
        super('error.forbidden', {}, 'FORBIDDEN');
    }
}

/**
 * @description
 * This error should be thrown when a {@link Channel} cannot be found based on the provided
 * channel token.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class ChannelNotFoundError extends I18nError {
    constructor(token: string) {
        super('error.channel-not-found', { token }, 'CHANNEL_NOT_FOUND');
    }
}

/**
 * @description
 * This error should be thrown when an entity cannot be found in the database, i.e. no entity of
 * the given entityName (Product, User etc.) exists with the provided id.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class EntityNotFoundError extends I18nError {
    constructor(entityName: keyof typeof coreEntitiesMap, id: ID) {
        super('error.entity-with-id-not-found', { entityName, id }, 'ENTITY_NOT_FOUND');
    }
}

/**
 * @description
 * This error should be thrown when the verification token (used to verify a Customer's email
 * address) is either invalid or does not match any expected tokens.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class VerificationTokenError extends I18nError {
    constructor() {
        super('error.verification-token-not-recognized', {}, 'BAD_VERIFICATION_TOKEN');
    }
}

/**
 * @description
 * This error should be thrown when the verification token (used to verify a Customer's email
 * address) is valid, but has expired according to the `verificationTokenDuration` setting
 * in {@link AuthOptions}.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class VerificationTokenExpiredError extends I18nError {
    constructor() {
        super('error.verification-token-has-expired', {}, 'EXPIRED_VERIFICATION_TOKEN');
    }
}

/**
 * @description
 * This error should be thrown when an error occurs trying to reset a Customer's password.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class PasswordResetTokenError extends I18nError {
    constructor() {
        super('error.password-reset-token-not-recognized', {}, 'BAD_PASSWORD_RESET_TOKEN');
    }
}

/**
 * @description
 * This error should be thrown when an error occurs trying to reset a Customer's password
 * by reason of the token having expired.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class PasswordResetTokenExpiredError extends I18nError {
    constructor() {
        super('error.password-reset-token-has-expired', {}, 'EXPIRED_PASSWORD_RESET_TOKEN');
    }
}

/**
 * @description
 * This error should be thrown when an error occurs when attempting to update a User's identifier
 * (e.g. change email address).
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class IdentifierChangeTokenError extends I18nError {
    constructor() {
        super('error.identifier-change-token-not-recognized', {}, 'EXPIRED_IDENTIFIER_CHANGE_TOKEN');
    }
}

/**
 * @description
 * This error should be thrown when an error occurs when attempting to update a User's identifier
 * (e.g. change email address) by reason of the token having expired.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class IdentifierChangeTokenExpiredError extends I18nError {
    constructor() {
        super('error.identifier-change-token-has-expired', {}, 'EXPIRED_IDENTIFIER_CHANGE_TOKEN');
    }
}

/**
 * @description
 * This error should be thrown when the `requireVerification` in {@link AuthOptions} is set to
 * `true` and an unverified user attempts to authenticate.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class NotVerifiedError extends I18nError {
    constructor() {
        super('error.email-address-not-verified', {}, 'NOT_VERIFIED');
    }
}

/**
 * @description
 * This error should be thrown when the number or OrderItems in an Order exceeds the limit
 * specified by the `orderItemsLimit` setting in {@link OrderOptions}.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class OrderItemsLimitError extends I18nError {
    constructor(maxItems: number) {
        super('error.order-items-limit-exceeded', { maxItems }, 'ORDER_ITEMS_LIMIT_EXCEEDED');
    }
}

/**
 * @description
 * This error is thrown when the coupon code is not associated with any active Promotion.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class CouponCodeInvalidError extends I18nError {
    constructor(couponCode: string) {
        super('error.coupon-code-not-valid', { couponCode }, 'COUPON_CODE_INVALID');
    }
}

/**
 * @description
 * This error is thrown when the coupon code is associated with a Promotion that has expired.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class CouponCodeExpiredError extends I18nError {
    constructor(couponCode: string) {
        super('error.coupon-code-expired', { couponCode }, 'COUPON_CODE_EXPIRED');
    }
}

/**
 * @description
 * This error is thrown when the coupon code is associated with a Promotion that has expired.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class CouponCodeLimitError extends I18nError {
    constructor(limit: number) {
        super('error.coupon-code-limit-has-been-reached', { limit }, 'COUPON_CODE_LIMIT_REACHED');
    }
}
