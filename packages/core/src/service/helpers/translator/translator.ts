import { RequestContext } from '../../../api/common/request-context';
import { Translatable } from '../../../common/types/locale-types';
import { ConfigService } from '../../../config';
import { VendureEntity } from '../../../entity';
import { DeepTranslatableRelations, translateDeep } from '../utils/translate-entity';

export class Translator {
    constructor(
        private configService: ConfigService,
    ) {
    }

    translate<T extends Translatable & VendureEntity>(
        translatable: T,
        ctx: RequestContext,
        translatableRelations: DeepTranslatableRelations<T> = [],
    ) {
        return translateDeep(translatable, [
            ctx.languageCode,
            ctx.channel.defaultLanguageCode,
            this.configService.defaultLanguageCode,
        ], translatableRelations);
    }
}
