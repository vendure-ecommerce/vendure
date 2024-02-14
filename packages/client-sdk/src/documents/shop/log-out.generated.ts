/* eslint-disable */
import * as Types from '../../gql/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type LogOutMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type LogOutMutation = { __typename?: 'Mutation', logout: { __typename?: 'Success', success: boolean } };


export const LogOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<LogOutMutation, LogOutMutationVariables>;