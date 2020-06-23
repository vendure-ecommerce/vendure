import { DocumentNode } from 'graphql';

import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { User } from '../../entity/user/user.entity';

/**
 * @description
 * An AuthenticationStrategy defines how a User (which can be a Customer in the Shop API or
 * and Administrator in the Admin API) may be authenticated.
 *
 * @docsCategory auth
 */
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
     * of the strategy. The shape of the input object should match the generic `Data`
     * type argument.
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
     *
     * **Note:** if more than one graphql `input` type is being defined (as in a nested input type), then
     * the _first_ input will be assumed to be the top-level input.
     */
    defineInputType(): DocumentNode;

    /**
     * @description
     * Used to authenticate a user with the authentication provider. This method
     * will
     */
    authenticate(ctx: RequestContext, data: Data): Promise<User | false>;

    /**
     * @description
     * Called when a user logs out, and may perform any required tasks
     * related to the user logging out.
     */
    onLogOut?(user: User): Promise<void>;
}
