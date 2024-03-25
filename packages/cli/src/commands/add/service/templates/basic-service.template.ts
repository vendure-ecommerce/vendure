import { Injectable } from '@nestjs/common';
import { Ctx, Product, RequestContext, TransactionalConnection } from '@vendure/core';

@Injectable()
export class BasicServiceTemplate {
    constructor(private connection: TransactionalConnection) {}

    async exampleMethod(@Ctx() ctx: RequestContext) {
        // Add your method logic here
        const result = await this.connection.getRepository(ctx, Product).findOne({});
        return result;
    }
}
