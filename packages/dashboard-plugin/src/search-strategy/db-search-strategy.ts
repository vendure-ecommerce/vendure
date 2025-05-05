import { Injectable } from '@nestjs/common';
import { GlobalSearchInput, GlobalSearchResultItem } from '@vendure/common/lib/generated-types';
import { Injector, ListQueryBuilder, Logger, PaginatedList, RequestContext } from '@vendure/core';

import { loggerCtx } from '../constants';
import { GlobalSearchIndexItem } from '../entities/global-search-index-item';

import { GlobalSearchStrategy } from './global-search-strategy';

@Injectable()
export class DbSearchStrategy implements GlobalSearchStrategy {
    private listQueryBuilder: ListQueryBuilder;
    init(injector: Injector): void | Promise<void> {
        this.listQueryBuilder = injector.get(ListQueryBuilder);
    }

    async getSearchResults(
        ctx: RequestContext,
        input: GlobalSearchInput,
    ): Promise<PaginatedList<GlobalSearchResultItem>> {
        const filter = {
            ...(input.query
                ? {
                      _or: [
                          {
                              name: {
                                  contains: input.query,
                              },
                          },
                          {
                              data: {
                                  contains: input.query,
                              },
                          },
                      ],
                  }
                : {}),
            languageCode: {
                eq: ctx.languageCode,
            },
            ...(input.enabledOnly === true ? { enabled: { eq: true, isNull: true } } : {}),
            ...(input.entityTypes && input.entityTypes.length > 0
                ? { entityType: { in: input.entityTypes } }
                : {}),
        };

        const [items, totalItems] = await this.listQueryBuilder
            .build(GlobalSearchIndexItem, {
                take: input.take,
                skip: input.skip,
                sort: {
                    [input.sortField ?? 'entityUpdatedAt']: input.sortDirection ?? 'DESC',
                },
                filter,
            })
            .getManyAndCount();

        return {
            items,
            totalItems,
        };
    }
}
