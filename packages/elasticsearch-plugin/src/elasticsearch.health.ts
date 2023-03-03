import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

import { ElasticsearchService } from './elasticsearch.service';

@Injectable()
export class ElasticsearchHealthIndicator extends HealthIndicator {
    constructor(private elasticsearchService: ElasticsearchService) {
        super();
    }

    async isHealthy(): Promise<HealthIndicatorResult> {
        let isHealthy = false;
        let error = '';
        try {
            await this.elasticsearchService.checkConnection();
            isHealthy = true;
        } catch (e: any) {
            error = e.message;
        }
        const result = this.getStatus('elasticsearch', isHealthy, { message: error });
        if (isHealthy) {
            return result;
        }
        this.throwHealthCheckError(result);
    }

    startupCheckFailed(message: string): never {
        const result = this.getStatus('elasticsearch', false, { message });
        return this.throwHealthCheckError(result);
    }

    private throwHealthCheckError(result: HealthIndicatorResult): never {
        throw new HealthCheckError('Elasticsearch not available', result);
    }
}
