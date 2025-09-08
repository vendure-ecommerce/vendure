import { SessionCustomFieldsTestEntity } from './entities/example.entity';

declare module '@vendure/core/dist/entity/custom-entity-fields' {
    interface CustomSessionFields {
        example?: SessionCustomFieldsTestEntity | null;
    }

    interface CustomProductFields {
        example?: SessionCustomFieldsTestEntity | null;
    }
}