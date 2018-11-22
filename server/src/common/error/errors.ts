import { ID } from 'shared/shared-types';

import { coreEntitiesMap } from '../../entity/entities';
import { I18nError } from '../../i18n/i18n-error';

export class InternalServerError extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, 'INTERNAL_SERVER_ERROR');
    }
}

export class UserInputError extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, 'USER_INPUT_ERROR');
    }
}

export class IllegalOperationError extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message || 'error.cannot-transition-order-from-to', variables, 'ILLEGAL_OPERATION');
    }
}

export class UnauthorizedError extends I18nError {
    constructor() {
        super('error.unauthorized', {}, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends I18nError {
    constructor() {
        super('error.forbidden', {}, 'FORBIDDEN');
    }
}

export class NoValidChannelError extends I18nError {
    constructor() {
        super('error.no-valid-channel-specified', {}, 'NO_VALID_CHANNEL');
    }
}

export class EntityNotFoundError extends I18nError {
    constructor(entityName: keyof typeof coreEntitiesMap, id: ID) {
        super('error.entity-with-id-not-found', { entityName, id }, 'ENTITY_NOT_FOUND');
    }
}

export class VerificationTokenError extends I18nError {
    constructor() {
        super('error.verification-token-not-recognized', {}, 'BAD_VERIFICATION_TOKEN');
    }
}

export class NotVerifiedError extends I18nError {
    constructor() {
        super('error.email-address-not-verified', {}, 'NOT_VERIFIED');
    }
}
