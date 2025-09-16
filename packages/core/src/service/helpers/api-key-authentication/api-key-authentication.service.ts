import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../../api/common/request-context';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { User } from '../../../entity/user/user.entity';
import { AdministratorService } from '../../services/administrator.service';
import { CustomerService } from '../../services/customer.service';

/**
 * @description
 * This is a helper service which exposes methods related to looking up and creating Users based on an
 * API key {@link AuthenticationStrategy}.
 *
 * @docsCategory auth
 */
@Injectable()
export class ApiKeyAuthenticationService {
    constructor(
        private connection: TransactionalConnection,
        private administratorService: AdministratorService,
        private customerService: CustomerService,
    ) {}

    /**
     * Excludes soft-deleted users
     */
    async findUser(ctx: RequestContext, apiKey: string): Promise<User | undefined> {
        const user = await this.connection
            .getRepository(ctx, User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'aums')
            .leftJoin('user.authenticationMethods', 'authMethod')
            .andWhere('authMethod.apiKey = :apiKey', { apiKey })
            .andWhere('user.deletedAt IS NULL')
            .getOne();

        return user || undefined;
    }

    /**
     * @description
     * Looks up a User based on their api key, ensuring this User is associated with an Administrator account.
     * // TODO keep private until we need it
     */
    private async findAdministratorUser(ctx: RequestContext, apiKey: string): Promise<User | undefined> {
        const user = await this.findUser(ctx, apiKey);
        if (!user) return;

        const administrator = await this.administratorService.findOneByUserId(ctx, user.id);
        if (administrator) return user;
    }

    /**
     * @description
     * Looks up a User based on their api key, ensuring this User is associated with a Customer account.
     * // TODO do we need this? Leave private for now, might delete later
     */
    private async findCustomerUser(ctx: RequestContext, apiKey: string): Promise<User | undefined> {
        const user = await this.findUser(ctx, apiKey);
        if (!user) return;

        const customer = await this.customerService.findOneByUserId(ctx, user.id);
        if (customer) return user;
    }

    /**
     *
     */
    // async assignApiKeyToUser(ctx: RequestContext, idUser: ID, apiKey: string) {
    //   // TODO think about
    //   const user = await this.findUser(ctx, apiKey);
    //   const authMethod = await this.connection.getRepository(ctx, ApiKeyAuthenticationMethod)
    //     .save(new ApiKeyAuthenticationMethod({ apiKey, user }));
    //   await this.connection.getRepository(ctx, User).save(user)
    // }
}
