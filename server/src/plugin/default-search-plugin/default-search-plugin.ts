import { Type } from '../../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { InjectorFn, VendureConfig, VendurePlugin } from '../../config';

import { FulltextSearchResolver } from './fulltext-search.resolver';
import { FulltextSearchService } from './fulltext-search.service';
import { SearchIndexItem } from './search-index-item.entity';

export class DefaultSearchPlugin implements VendurePlugin {
    private fulltextSearchService: FulltextSearchService;

    async configure(config: Required<VendureConfig>): Promise<Required<VendureConfig>> {
        return config;
    }

    async onBootstrap(inject: InjectorFn): Promise<void> {
        const searchService = inject(FulltextSearchService);
        await searchService.checkIndex(DEFAULT_LANGUAGE_CODE);
    }

    defineEntities(): Array<Type<any>> {
        return [SearchIndexItem];
    }

    defineProviders(): Array<Type<any>> {
        return [FulltextSearchService, FulltextSearchResolver];
    }
}
