import { DocumentNode } from 'graphql';

import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { User } from '../../entity/user/user.entity';

export interface AuthenticationStrategy<Data = unknown> extends InjectableStrategy {
    /**
     * @description
     * The `name` property is used to create the `AuthenticationMethod` GraphQL enum
     * used by the `authenticate` mutation.
     */
    readonly name: string;

    /**
     * @description
     * Defines the type of the GraphQL Input object expected by the `authenticate`
     * mutation. The final input object will be a map, with the key being the name
     * of the strategy.
     *
     * For example, given the following:
     * ```TypeScript
     * defineInputType() {
     *   return gql`
     *      input MyAuthInput {
     *        token: String!
     *      }
     *   `;
     * }
     * ```
     *
     * assuming the strategy name is "my_auth", then the resulting call to `authenticate`
     * would look like:
     *
     * ```GraphQL
     * authenticate(input: {
     *   my_auth: {
     *     token: "foo"
     *   }
     * }) {
     *   # ...
     * }
     * ```
     */
    defineInputType(): DocumentNode;

    /**
     * @description
     * Used to authenticate a user with the authentication provider.
     */
    authenticate(ctx: RequestContext, data: Data): Promise<User | false>;

    /**
     * @description
     * Called when a user logs out, and may perform any required tasks
     * related to the user logging out.
     */
    onLogOut?(user: User): Promise<void>;
}
