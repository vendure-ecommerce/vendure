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
import { ConfigArgService } from '../config-arg/config-arg.service';

@Injectable()
export class EntityDuplicatorService {
    constructor(private configService: ConfigService, private configArgService: ConfigArgService) {}

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
        const permissionsArray = Array.isArray(duplicator.requiresPermission)
            ? duplicator.requiresPermission
            : [duplicator.requiresPermission];
        if (permissionsArray.length === 0 || !ctx.userHasPermissions(permissionsArray as Permission[])) {
            return new DuplicateEntityError({
                duplicationError: ctx.translate(`message.entity-duplication-no-permission`),
            });
        }

        const parsedInput = this.configArgService.parseInput('EntityDuplicator', input.duplicatorInput);

        try {
            const newEntity = await duplicator.duplicate({
                ctx,
                entityName: input.entityName,
                id: input.entityId,
                args: parsedInput.args,
            });
            return { newEntityId: newEntity.id };
        } catch (e: any) {
            return new DuplicateEntityError({
                duplicationError: e.message ?? e.toString(),
            });
        }
    }
}
