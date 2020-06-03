/* tslint:ignore */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ModuleContext } from '@graphql-modules/core';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Choices: any;
  Date: any;
  RouteAnswer: any;
};









export type AchivementResponse = {
   __typename?: 'AchivementResponse';
  achivementId: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  points: Scalars['Int'];
  status: AchivementStatus;
  icon?: Maybe<Scalars['String']>;
  earnedDate?: Maybe<Scalars['Date']>;
};

export enum AchivementStatus {
  AvailableToEarn = 'AvailableToEarn',
  Earned = 'Earned'
}

export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};


export type CreateGoalInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  amount: Scalars['Int'];
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
  updateTask: UpdateTaskResponse;
  startRoute: UserRouteResponse;
  claimReward: UserRewardResponse;
  registerDevice: RegisterDeviceResponse;
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};


export type MutationStartRouteArgs = {
  routeId: Scalars['String'];
};


export type MutationClaimRewardArgs = {
  rewardId: Scalars['String'];
};


export type MutationRegisterDeviceArgs = {
  input: RegisterDeviceInput;
};

export type Query = {
   __typename?: 'Query';
  getCurrentRoutes: Array<Maybe<UserRouteResponse>>;
  getAvailableRoutes: Array<Maybe<RouteResponse>>;
  getAvailableRewards: Array<RewardResponse>;
  getStatus: StatusResponse;
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
  currentTask?: Maybe<UserTaskResponse>;
};

export type RewardResponse = {
   __typename?: 'RewardResponse';
  rewardId: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  price: Scalars['Int'];
  status: RewardStatus;
};

export enum RewardStatus {
  AvailableToClaim = 'AvailableToClaim',
  Claimed = 'Claimed',
  ClaimedAndUsed = 'ClaimedAndUsed',
  Expired = 'Expired'
}


export type RouteResponse = {
   __typename?: 'RouteResponse';
  routeId: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
};

export type StatusResponse = {
   __typename?: 'StatusResponse';
  user: UserResponse;
  currentTask?: Maybe<UserTaskResponse>;
  routes?: Maybe<Array<Maybe<UserRouteResponse>>>;
};

export enum TaskStatus {
  Completed = 'Completed',
  Dismissed = 'Dismissed',
  PendingUser = 'PendingUser'
}

export enum TaskType {
  DateOfBirth = 'DateOfBirth',
  YesOrNo = 'YesOrNo',
  MultipleChoices = 'MultipleChoices'
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

export type UserGoalResponse = {
   __typename?: 'UserGoalResponse';
  _id: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  amount: Scalars['Int'];
};

export type UserProfileResponse = {
   __typename?: 'UserProfileResponse';
  dateOfBirth?: Maybe<Scalars['Date']>;
};

export type UserResponse = {
   __typename?: 'UserResponse';
  id: Scalars['String'];
  profile: UserProfileResponse;
  balance: Scalars['Int'];
  goals?: Maybe<Array<UserGoalResponse>>;
  rewards?: Maybe<Array<UserRewardResponse>>;
};

export type UserRewardResponse = {
   __typename?: 'UserRewardResponse';
  _id: Scalars['String'];
  rewardId: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  status: RewardStatus;
  barcodeImageUrl: Scalars['String'];
};

export type UserRouteResponse = {
   __typename?: 'UserRouteResponse';
  routeId: Scalars['String'];
  title: Scalars['String'];
  progress?: Maybe<Scalars['Int']>;
  status: UserRouteStatus;
  tasks?: Maybe<Array<Maybe<UserTaskResponse>>>;
};

export enum UserRouteStatus {
  Active = 'Active',
  Completed = 'Completed'
}

export type UserTaskResponse = {
   __typename?: 'UserTaskResponse';
  taskId: Scalars['String'];
  title: Scalars['String'];
  status: TaskStatus;
  description?: Maybe<Scalars['String']>;
  media?: Maybe<Scalars['String']>;
  answer?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  choices?: Maybe<Scalars['Choices']>;
  type: TaskType;
  progressPercentile?: Maybe<Scalars['Int']>;
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
  UserRouteStatus: UserRouteStatus,
  UserTaskResponse: ResolverTypeWrapper<UserTaskResponse>,
  TaskStatus: TaskStatus,
  Choices: ResolverTypeWrapper<Scalars['Choices']>,
  TaskType: TaskType,
  RouteResponse: ResolverTypeWrapper<RouteResponse>,
  RewardResponse: ResolverTypeWrapper<RewardResponse>,
  RewardStatus: RewardStatus,
  StatusResponse: ResolverTypeWrapper<StatusResponse>,
  UserResponse: ResolverTypeWrapper<UserResponse>,
  UserProfileResponse: ResolverTypeWrapper<UserProfileResponse>,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  UserGoalResponse: ResolverTypeWrapper<UserGoalResponse>,
  UserRewardResponse: ResolverTypeWrapper<UserRewardResponse>,
  Mutation: ResolverTypeWrapper<{}>,
  UpdateTaskInput: UpdateTaskInput,
  UpdateTaskResponse: ResolverTypeWrapper<UpdateTaskResponse>,
  RegisterDeviceInput: RegisterDeviceInput,
  Locale: Locale,
  LocactionInput: LocactionInput,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  RegisterDeviceResponse: ResolverTypeWrapper<RegisterDeviceResponse>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  AchivementResponse: ResolverTypeWrapper<AchivementResponse>,
  AchivementStatus: AchivementStatus,
  RouteAnswer: ResolverTypeWrapper<Scalars['RouteAnswer']>,
  AdditionalEntityFields: AdditionalEntityFields,
  CreateGoalInput: CreateGoalInput,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  UserRouteResponse: UserRouteResponse,
  String: Scalars['String'],
  Int: Scalars['Int'],
  UserRouteStatus: UserRouteStatus,
  UserTaskResponse: UserTaskResponse,
  TaskStatus: TaskStatus,
  Choices: Scalars['Choices'],
  TaskType: TaskType,
  RouteResponse: RouteResponse,
  RewardResponse: RewardResponse,
  RewardStatus: RewardStatus,
  StatusResponse: StatusResponse,
  UserResponse: UserResponse,
  UserProfileResponse: UserProfileResponse,
  Date: Scalars['Date'],
  UserGoalResponse: UserGoalResponse,
  UserRewardResponse: UserRewardResponse,
  Mutation: {},
  UpdateTaskInput: UpdateTaskInput,
  UpdateTaskResponse: UpdateTaskResponse,
  RegisterDeviceInput: RegisterDeviceInput,
  Locale: Locale,
  LocactionInput: LocactionInput,
  Float: Scalars['Float'],
  RegisterDeviceResponse: RegisterDeviceResponse,
  Boolean: Scalars['Boolean'],
  AchivementResponse: AchivementResponse,
  AchivementStatus: AchivementStatus,
  RouteAnswer: Scalars['RouteAnswer'],
  AdditionalEntityFields: AdditionalEntityFields,
  CreateGoalInput: CreateGoalInput,
};

export type UnionDirectiveArgs = {   discriminatorField?: Maybe<Scalars['String']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type UnionDirectiveResolver<Result, Parent, ContextType = ModuleContext, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {   discriminatorField: Scalars['String'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = ModuleContext, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {   embedded?: Maybe<Scalars['Boolean']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type EntityDirectiveResolver<Result, Parent, ContextType = ModuleContext, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {   overrideType?: Maybe<Scalars['String']>; };

export type ColumnDirectiveResolver<Result, Parent, ContextType = ModuleContext, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = {  };

export type IdDirectiveResolver<Result, Parent, ContextType = ModuleContext, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {   overrideType?: Maybe<Scalars['String']>; };

export type LinkDirectiveResolver<Result, Parent, ContextType = ModuleContext, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = {  };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = ModuleContext, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {   path: Scalars['String']; };

export type MapDirectiveResolver<Result, Parent, ContextType = ModuleContext, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AchivementResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['AchivementResponse'] = ResolversParentTypes['AchivementResponse']> = {
  achivementId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['AchivementStatus'], ParentType, ContextType>,
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  earnedDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export interface ChoicesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Choices'], any> {
  name: 'Choices'
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type MutationResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  updateTask?: Resolver<ResolversTypes['UpdateTaskResponse'], ParentType, ContextType, RequireFields<MutationUpdateTaskArgs, 'input'>>,
  startRoute?: Resolver<ResolversTypes['UserRouteResponse'], ParentType, ContextType, RequireFields<MutationStartRouteArgs, 'routeId'>>,
  claimReward?: Resolver<ResolversTypes['UserRewardResponse'], ParentType, ContextType, RequireFields<MutationClaimRewardArgs, 'rewardId'>>,
  registerDevice?: Resolver<ResolversTypes['RegisterDeviceResponse'], ParentType, ContextType, RequireFields<MutationRegisterDeviceArgs, 'input'>>,
};

export type QueryResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getCurrentRoutes?: Resolver<Array<Maybe<ResolversTypes['UserRouteResponse']>>, ParentType, ContextType>,
  getAvailableRoutes?: Resolver<Array<Maybe<ResolversTypes['RouteResponse']>>, ParentType, ContextType>,
  getAvailableRewards?: Resolver<Array<ResolversTypes['RewardResponse']>, ParentType, ContextType>,
  getStatus?: Resolver<ResolversTypes['StatusResponse'], ParentType, ContextType>,
};

export type RegisterDeviceResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['RegisterDeviceResponse'] = ResolversParentTypes['RegisterDeviceResponse']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType>,
  currentTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type RewardResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['RewardResponse'] = ResolversParentTypes['RewardResponse']> = {
  rewardId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['RewardStatus'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export interface RouteAnswerScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RouteAnswer'], any> {
  name: 'RouteAnswer'
}

export type RouteResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['RouteResponse'] = ResolversParentTypes['RouteResponse']> = {
  routeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type StatusResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['StatusResponse'] = ResolversParentTypes['StatusResponse']> = {
  user?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType>,
  currentTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  routes?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserRouteResponse']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UpdateTaskResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UpdateTaskResponse'] = ResolversParentTypes['UpdateTaskResponse']> = {
  previousTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  nextTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserGoalResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserGoalResponse'] = ResolversParentTypes['UserGoalResponse']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserProfileResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserProfileResponse'] = ResolversParentTypes['UserProfileResponse']> = {
  dateOfBirth?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserResponse'] = ResolversParentTypes['UserResponse']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  profile?: Resolver<ResolversTypes['UserProfileResponse'], ParentType, ContextType>,
  balance?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  goals?: Resolver<Maybe<Array<ResolversTypes['UserGoalResponse']>>, ParentType, ContextType>,
  rewards?: Resolver<Maybe<Array<ResolversTypes['UserRewardResponse']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserRewardResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserRewardResponse'] = ResolversParentTypes['UserRewardResponse']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  rewardId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  status?: Resolver<ResolversTypes['RewardStatus'], ParentType, ContextType>,
  barcodeImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserRouteResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserRouteResponse'] = ResolversParentTypes['UserRouteResponse']> = {
  routeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  progress?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  status?: Resolver<ResolversTypes['UserRouteStatus'], ParentType, ContextType>,
  tasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserTaskResponse']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserTaskResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserTaskResponse'] = ResolversParentTypes['UserTaskResponse']> = {
  taskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  media?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  answer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  choices?: Resolver<Maybe<ResolversTypes['Choices']>, ParentType, ContextType>,
  type?: Resolver<ResolversTypes['TaskType'], ParentType, ContextType>,
  progressPercentile?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = ModuleContext> = {
  AchivementResponse?: AchivementResponseResolvers<ContextType>,
  Choices?: GraphQLScalarType,
  Date?: GraphQLScalarType,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  RegisterDeviceResponse?: RegisterDeviceResponseResolvers<ContextType>,
  RewardResponse?: RewardResponseResolvers<ContextType>,
  RouteAnswer?: GraphQLScalarType,
  RouteResponse?: RouteResponseResolvers<ContextType>,
  StatusResponse?: StatusResponseResolvers<ContextType>,
  UpdateTaskResponse?: UpdateTaskResponseResolvers<ContextType>,
  UserGoalResponse?: UserGoalResponseResolvers<ContextType>,
  UserProfileResponse?: UserProfileResponseResolvers<ContextType>,
  UserResponse?: UserResponseResolvers<ContextType>,
  UserRewardResponse?: UserRewardResponseResolvers<ContextType>,
  UserRouteResponse?: UserRouteResponseResolvers<ContextType>,
  UserTaskResponse?: UserTaskResponseResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = ModuleContext> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = ModuleContext> = {
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
export type IDirectiveResolvers<ContextType = ModuleContext> = DirectiveResolvers<ContextType>;