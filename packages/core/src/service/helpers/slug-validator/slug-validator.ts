import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { VendureEntity } from '../../../entity/base/base.entity';

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
};

@Injectable()
export class SlugValidator {
    constructor(@InjectConnection() private connection: Connection) {}

    /**
     * Normalizes the slug to be URL-safe, and ensures it is unique for the given languageCode.
     * Mutates the input.
     */
    async validateSlugs<T extends InputWithSlug, E extends TranslationEntity>(
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
                            .getRepository(translationEntity)
                            .createQueryBuilder('translation')
                            .where(`translation.slug = :slug`, { slug: t.slug })
                            .andWhere(`translation.languageCode = :languageCode`, {
                                languageCode: t.languageCode,
                            });
                        if (input.id) {
                            qb.andWhere(`translation.base != :id`, { id: input.id });
                        }
                        match = await qb.getOne();
                        if (match) {
                            suffix++;
                            if (alreadySuffixed.test(t.slug)) {
                                t.slug = t.slug.replace(alreadySuffixed, `-${suffix}`);
                            } else {
                                t.slug = `${t.slug}-${suffix}`;
                            }
                        }
                    } while (match);
                }
            }
        }
        return input;
    }
}
