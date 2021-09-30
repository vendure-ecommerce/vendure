import { VendureEntity } from '../../../entity/base/base.entity';

/**
 * @description
 * Options used to control which relations of the entity get hydrated
 * when using the {@link EntityHydrator} helper.
 *
 * @since 1.3.0
 */
export interface HydrateOptions<Entity extends VendureEntity> {
    /**
     * @description
     * Defines the relations to hydrate, using strings with dot notation to indicate
     * nested joins. If the entity already has a particular relation available, that relation
     * will be skipped (no extra DB join will be added).
     */
    relations: Array<EntityRelationPaths<Entity>>;
    /**
     * @description
     * If set to `true`, any ProductVariants will also have their `price` and `priceWithTax` fields
     * applied based on the current context. If prices are not required, this can be left `false` which
     * will be slightly more efficient.
     *
     * @default false
     */
    applyProductVariantPrices?: boolean;
}

// The following types are all related to allowing dot-notation access to relation properties
export type EntityRelationKeys<T extends VendureEntity> = {
    [K in Extract<keyof T, string>]: T[K] extends VendureEntity
        ? K
        : T[K] extends VendureEntity[]
        ? K
        : never;
}[Extract<keyof T, string>];

export type EntityRelations<T extends VendureEntity> = {
    [K in EntityRelationKeys<T>]: T[K];
};

export type PathsToStringProps1<T extends VendureEntity> = T extends string
    ? []
    : {
          [K in EntityRelationKeys<T>]: K;
      }[Extract<EntityRelationKeys<T>, string>];

export type PathsToStringProps2<T extends VendureEntity> = T extends string
    ? never
    : {
          [K in EntityRelationKeys<T>]: T[K] extends VendureEntity[]
              ? [K, PathsToStringProps1<T[K][number]>]
              : [K, PathsToStringProps1<T[K]>];
      }[Extract<EntityRelationKeys<T>, string>];

export type TripleDotPath = `${string}.${string}.${string}`;

export type EntityRelationPaths<T extends VendureEntity> =
    | PathsToStringProps1<T>
    | Join<PathsToStringProps2<T>, '.'>
    | TripleDotPath;

// Based on https://stackoverflow.com/a/47058976/772859
export type Join<T extends Array<string | any>, D extends string> = T extends []
    ? never
    : T extends [infer F]
    ? F
    : // tslint:disable-next-line:no-shadowed-variable
    T extends [infer F, ...infer R]
    ? F extends string
        ? `${F}${D}${Join<Extract<R, string[]>, D>}`
        : never
    : string;
