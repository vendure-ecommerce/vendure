import { Injectable } from '@nestjs/common';
import {
    DuplicateEntityInput,
    DuplicateEntityResult,
    EntityDuplicatorDefinition,
    Permission,
} from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/index';
import { DuplicateEntityError } from '../../../common/index';
import { ConfigService } from '../../../config/index';
import { TransactionalConnection } from '../../../connection/index';
import { ConfigArgService } from '../config-arg/config-arg.service';

@Injectable()
export class EntityDuplicatorService {
    constructor(
        private configService: ConfigService,
        private configArgService: ConfigArgService,
        private connection: TransactionalConnection,
    ) {}

    getEntityDuplicators(ctx: RequestContext): EntityDuplicatorDefinition[] {
        return this.configArgService.getDefinitions('EntityDuplicator').map(x => ({
            ...x.toGraphQlType(ctx),
            __typename: 'EntityDuplicatorDefinition',
            forEntities: x.forEntities,
            requiresPermission: x.requiresPermission as Permission[],
        }));
    }

    async duplicateEntity(ctx: RequestContext, input: DuplicateEntityInput): Promise<DuplicateEntityResult> {
        const duplicator = this.configService.entityOptions.entityDuplicators.find(
            s => s.forEntities.includes(input.entityName) && s.code === input.duplicatorInput.code,
        );
        if (!duplicator) {
            return new DuplicateEntityError({
                duplicationError: ctx.translate(`message.entity-duplication-no-strategy-found`, {
                    entityName: input.entityName,
                    code: input.duplicatorInput.code,
                }),
            });
        }

        // Check permissions
        if (
            duplicator.requiresPermission.length === 0 ||
            !ctx.userHasPermissions(duplicator.requiresPermission)
        ) {
            return new DuplicateEntityError({
                duplicationError: ctx.translate(`message.entity-duplication-no-permission`),
            });
        }

        const parsedInput = this.configArgService.parseInput('EntityDuplicator', input.duplicatorInput);

        return await this.connection.withTransaction(ctx, async innerCtx => {
            try {
                const newEntity = await duplicator.duplicate({
                    ctx: innerCtx,
                    entityName: input.entityName,
                    id: input.entityId,
                    args: parsedInput.args,
                });
                return { newEntityId: newEntity.id };
            } catch (e: any) {
                await this.connection.rollBackTransaction(innerCtx);
                return new DuplicateEntityError({
                    duplicationError: e.message ?? e.toString(),
                });
            }
        });
    }
}
