import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};









export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};


export type LocactionInput = {
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
};

export enum Locale {
  NlNl = 'nl_NL'
}

export type Mutation = {
   __typename?: 'Mutation';
  registerDevice: RegisterDeviceResponse;
  updateTask: UpdateTaskResponse;
};


export type MutationRegisterDeviceArgs = {
  input: RegisterDeviceInput;
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};

export type Query = {
   __typename?: 'Query';
  getCurrentRoutes: Array<Maybe<UserRouteResponse>>;
  getAvailableRoutes: Array<Maybe<RouteResponse>>;
};

export type RegisterDeviceInput = {
  deviceId: Scalars['String'];
  deviceOs?: Maybe<Scalars['String']>;
  deviceType?: Maybe<Scalars['String']>;
  locale?: Maybe<Locale>;
  location?: Maybe<LocactionInput>;
};

export type RegisterDeviceResponse = {
   __typename?: 'RegisterDeviceResponse';
  accessToken: Scalars['String'];
  user: UserResponse;
  currentProgress?: Maybe<Scalars['Int']>;
  currentTask?: Maybe<UserTaskResponse>;
};

export type RouteResponse = {
   __typename?: 'RouteResponse';
  title: Scalars['String'];
};

export enum TaskStatus {
  Completed = 'Completed',
  PendingUser = 'PendingUser'
}

export enum TaskType {
  DateOfBirth = 'DateOfBirth',
  YesOrNo = 'YesOrNo'
}

export type UpdateTaskInput = {
  taskId: Scalars['String'];
  answer?: Maybe<Scalars['String']>;
};

export type UpdateTaskResponse = {
   __typename?: 'UpdateTaskResponse';
  previousTask?: Maybe<UserTaskResponse>;
  nextTask?: Maybe<UserTaskResponse>;
};

export type UserProfileResponse = {
   __typename?: 'UserProfileResponse';
  dateOfBirth?: Maybe<Scalars['Date']>;
};

export type UserResponse = {
   __typename?: 'UserResponse';
  id: Scalars['String'];
  profile: UserProfileResponse;
};

export type UserRouteResponse = {
   __typename?: 'UserRouteResponse';
  title: Scalars['String'];
  progress?: Maybe<Scalars['Int']>;
  tasks?: Maybe<Array<Maybe<UserTaskResponse>>>;
};

export type UserTaskResponse = {
   __typename?: 'UserTaskResponse';
  taskId?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  status?: Maybe<TaskStatus>;
  description?: Maybe<Scalars['String']>;
  answer?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  type?: Maybe<TaskType>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  UserRouteResponse: ResolverTypeWrapper<UserRouteResponse>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  UserTaskResponse: ResolverTypeWrapper<UserTaskResponse>,
  TaskStatus: TaskStatus,
  TaskType: TaskType,
  RouteResponse: ResolverTypeWrapper<RouteResponse>,
  Mutation: ResolverTypeWrapper<{}>,
  RegisterDeviceInput: RegisterDeviceInput,
  Locale: Locale,
  LocactionInput: LocactionInput,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  RegisterDeviceResponse: ResolverTypeWrapper<RegisterDeviceResponse>,
  UserResponse: ResolverTypeWrapper<UserResponse>,
  UserProfileResponse: ResolverTypeWrapper<UserProfileResponse>,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  UpdateTaskInput: UpdateTaskInput,
  UpdateTaskResponse: ResolverTypeWrapper<UpdateTaskResponse>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  AdditionalEntityFields: AdditionalEntityFields,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  UserRouteResponse: UserRouteResponse,
  String: Scalars['String'],
  Int: Scalars['Int'],
  UserTaskResponse: UserTaskResponse,
  TaskStatus: TaskStatus,
  TaskType: TaskType,
  RouteResponse: RouteResponse,
  Mutation: {},
  RegisterDeviceInput: RegisterDeviceInput,
  Locale: Locale,
  LocactionInput: LocactionInput,
  Float: Scalars['Float'],
  RegisterDeviceResponse: RegisterDeviceResponse,
  UserResponse: UserResponse,
  UserProfileResponse: UserProfileResponse,
  Date: Scalars['Date'],
  UpdateTaskInput: UpdateTaskInput,
  UpdateTaskResponse: UpdateTaskResponse,
  Boolean: Scalars['Boolean'],
  AdditionalEntityFields: AdditionalEntityFields,
};

export type UnionDirectiveArgs = {   discriminatorField?: Maybe<Scalars['String']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {   discriminatorField: Scalars['String'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {   embedded?: Maybe<Scalars['Boolean']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {   overrideType?: Maybe<Scalars['String']>; };

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = {  };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {   overrideType?: Maybe<Scalars['String']>; };

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = {  };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {   path: Scalars['String']; };

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  registerDevice?: Resolver<ResolversTypes['RegisterDeviceResponse'], ParentType, ContextType, RequireFields<MutationRegisterDeviceArgs, 'input'>>,
  updateTask?: Resolver<ResolversTypes['UpdateTaskResponse'], ParentType, ContextType, RequireFields<MutationUpdateTaskArgs, 'input'>>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getCurrentRoutes?: Resolver<Array<Maybe<ResolversTypes['UserRouteResponse']>>, ParentType, ContextType>,
  getAvailableRoutes?: Resolver<Array<Maybe<ResolversTypes['RouteResponse']>>, ParentType, ContextType>,
};

export type RegisterDeviceResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegisterDeviceResponse'] = ResolversParentTypes['RegisterDeviceResponse']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType>,
  currentProgress?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  currentTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type RouteResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RouteResponse'] = ResolversParentTypes['RouteResponse']> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UpdateTaskResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTaskResponse'] = ResolversParentTypes['UpdateTaskResponse']> = {
  previousTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  nextTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserProfileResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserProfileResponse'] = ResolversParentTypes['UserProfileResponse']> = {
  dateOfBirth?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserResponse'] = ResolversParentTypes['UserResponse']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  profile?: Resolver<ResolversTypes['UserProfileResponse'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserRouteResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserRouteResponse'] = ResolversParentTypes['UserRouteResponse']> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  progress?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  tasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserTaskResponse']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserTaskResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserTaskResponse'] = ResolversParentTypes['UserTaskResponse']> = {
  taskId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  status?: Resolver<Maybe<ResolversTypes['TaskStatus']>, ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  answer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['TaskType']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  RegisterDeviceResponse?: RegisterDeviceResponseResolvers<ContextType>,
  RouteResponse?: RouteResponseResolvers<ContextType>,
  UpdateTaskResponse?: UpdateTaskResponseResolvers<ContextType>,
  UserProfileResponse?: UserProfileResponseResolvers<ContextType>,
  UserResponse?: UserResponseResolvers<ContextType>,
  UserRouteResponse?: UserRouteResponseResolvers<ContextType>,
  UserTaskResponse?: UserTaskResponseResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  union?: UnionDirectiveResolver<any, any, ContextType>,
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>,
  entity?: EntityDirectiveResolver<any, any, ContextType>,
  column?: ColumnDirectiveResolver<any, any, ContextType>,
  id?: IdDirectiveResolver<any, any, ContextType>,
  link?: LinkDirectiveResolver<any, any, ContextType>,
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>,
  map?: MapDirectiveResolver<any, any, ContextType>,
};


/**
* @deprecated
* Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
*/
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;
import { ObjectID } from 'mongodb';