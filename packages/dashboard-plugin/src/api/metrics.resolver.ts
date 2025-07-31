import { Args, Query, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext } from '@vendure/core';

import { MetricsService } from '../service/metrics.service';
import { DashboardMetricSummary, DashboardMetricSummaryInput } from '../types';

@Resolver()
export class MetricsResolver {
    constructor(private service: MetricsService) {}

    @Query()
    @Allow(Permission.ReadOrder)
    async dashboardMetricSummary(
        @Ctx() ctx: RequestContext,
        @Args('input') input: DashboardMetricSummaryInput,
    ): Promise<DashboardMetricSummary[]> {
        return this.service.getMetrics(ctx, input);
    }
}
