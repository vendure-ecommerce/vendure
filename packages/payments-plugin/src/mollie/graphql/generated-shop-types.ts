// tslint:disable
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type MolliePaymentIntent = {
  __typename?: 'MolliePaymentIntent';
  url: Scalars['String'];
};

export type MolliePaymentIntentError = {
  __typename?: 'MolliePaymentIntentError';
  errorCode: Scalars['String'];
  message: Scalars['String'];
};

export type MolliePaymentIntentInput = {
  paymentMethodCode: Scalars['String'];
};

export type MolliePaymentIntentResult = MolliePaymentIntent | MolliePaymentIntentError;

export type Mutation = {
  __typename?: 'Mutation';
  createMolliePaymentIntent: MolliePaymentIntentResult;
};


export type MutationCreateMolliePaymentIntentArgs = {
  input: MolliePaymentIntentInput;
};
