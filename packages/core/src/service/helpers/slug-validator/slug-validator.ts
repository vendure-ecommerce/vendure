import { Injectable } from '@nestjs/common';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { ID, Type } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../../api/common/request-context';
import { VendureEntity } from '../../../entity/base/base.entity';
import { ProductOptionGroup } from '../../../entity/product-option-group/product-option-group.entity';
import { TransactionalConnection } from '../../transaction/transactional-connection';

export type InputWithSlug = {
    id?: ID | null;
    translations?: Array<{
        id?: ID | null;
        languageCode: LanguageCode;
        slug?: string | null;
    }> | null;
};

export type TranslationEntity = VendureEntity & {
    id: ID;
    languageCode: LanguageCode;
    slug: string;
    base: any;
};

@Injectable()
export class SlugValidator {
    constructor(private connection: TransactionalConnection) {}

    /**
     * Normalizes the slug to be URL-safe, and ensures it is unique for the given languageCode.
     * Mutates the input.
     */
    async validateSlugs<T extends InputWithSlug, E extends TranslationEntity>(
        ctx: RequestContext,
        input: T,
        translationEntity: Type<E>,
    ): Promise<T> {
        if (input.translations) {
            for (const t of input.translations) {
                if (t.slug) {
                    t.slug = normalizeString(t.slug, '-');
                    let match: E | undefined;
                    let suffix = 1;
                    const alreadySuffixed = /-\d+$/;
                    do {
                        const qb = this.connection
                            .getRepository(ctx, translationEntity)
                            .createQueryBuilder('translation')
                            .innerJoinAndSelect('translation.base', 'base')
                            .where(`translation.slug = :slug`, { slug: t.slug })
                            .andWhere(`translation.languageCode = :languageCode`, {
                                languageCode: t.languageCode,
                            });
                        if (input.id) {
                            qb.andWhere(`translation.base != :id`, { id: input.id });
                        }
                        match = await qb.getOne();
                        if (match && !match.base.deletedAt) {
                            suffix++;
                            if (alreadySuffixed.test(t.slug)) {
                                t.slug = t.slug.replace(alreadySuffixed, `-${suffix}`);
                            } else {
                                t.slug = `${t.slug}-${suffix}`;
                            }
                        }
                    } while (match && !match.base.deletedAt);
                }
            }
        }
        return input;
    }
}
