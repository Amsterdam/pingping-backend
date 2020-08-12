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

export type MessageResponse = {
   __typename?: 'MessageResponse';
  message: Scalars['String'];
};

export type Mutation = {
   __typename?: 'Mutation';
  updateTask: UpdateTaskResponse;
  startRoute: UserRouteResponse;
  createRouteFeedback: RouteFeedbackResponse;
  claimReward: UserRewardResponse;
  createGoal: UserGoalResponse;
  registerDevice: RegisterDeviceResponse;
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};


export type MutationStartRouteArgs = {
  routeId: Scalars['String'];
};


export type MutationCreateRouteFeedbackArgs = {
  input: RouteFeedbackInput;
};


export type MutationClaimRewardArgs = {
  rewardId: Scalars['String'];
};


export type MutationCreateGoalArgs = {
  input: CreateGoalInput;
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
  previousTask?: Maybe<UserTaskResponse>;
  routes?: Maybe<Array<Maybe<UserRouteResponse>>>;
  exportUrl?: Maybe<Scalars['String']>;
};

export type TaskResponse = {
   __typename?: 'TaskResponse';
  taskId: Scalars['String'];
  title: Scalars['String'];
  headerTitle: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  media?: Maybe<Scalars['String']>;
  choices?: Maybe<Scalars['Choices']>;
  type: TaskType;
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
  id: Scalars['String'];
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
  id: Scalars['String'];
  reward: RewardResponse;
  status: RewardStatus;
  barcodeImageUrl: Scalars['String'];
};

export type UserRouteResponse = {
   __typename?: 'UserRouteResponse';
  route: RouteResponse;
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
  status: TaskStatus;
  task: TaskResponse;
  answer?: Maybe<Scalars['String']>;
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
  RouteResponse: ResolverTypeWrapper<RouteResponse>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  UserRouteStatus: UserRouteStatus,
  UserTaskResponse: ResolverTypeWrapper<UserTaskResponse>,
  TaskStatus: TaskStatus,
  TaskResponse: ResolverTypeWrapper<TaskResponse>,
  Choices: ResolverTypeWrapper<Scalars['Choices']>,
  TaskType: TaskType,
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
  CreateGoalInput: CreateGoalInput,
  RegisterDeviceInput: RegisterDeviceInput,
  Locale: Locale,
  LocactionInput: LocactionInput,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  RegisterDeviceResponse: ResolverTypeWrapper<RegisterDeviceResponse>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  AchivementResponse: ResolverTypeWrapper<AchivementResponse>,
  AchivementStatus: AchivementStatus,
  RouteAnswer: ResolverTypeWrapper<Scalars['RouteAnswer']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  UserRouteResponse: UserRouteResponse,
  RouteResponse: RouteResponse,
  String: Scalars['String'],
  Int: Scalars['Int'],
  UserRouteStatus: UserRouteStatus,
  UserTaskResponse: UserTaskResponse,
  TaskStatus: TaskStatus,
  TaskResponse: TaskResponse,
  Choices: Scalars['Choices'],
  TaskType: TaskType,
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
  CreateGoalInput: CreateGoalInput,
  RegisterDeviceInput: RegisterDeviceInput,
  Locale: Locale,
  LocactionInput: LocactionInput,
  Float: Scalars['Float'],
  RegisterDeviceResponse: RegisterDeviceResponse,
  Boolean: Scalars['Boolean'],
  AchivementResponse: AchivementResponse,
  AchivementStatus: AchivementStatus,
  RouteAnswer: Scalars['RouteAnswer'],
};

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

export type MessageResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['MessageResponse'] = ResolversParentTypes['MessageResponse']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MutationResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  updateTask?: Resolver<ResolversTypes['UpdateTaskResponse'], ParentType, ContextType, RequireFields<MutationUpdateTaskArgs, 'input'>>,
  startRoute?: Resolver<ResolversTypes['UserRouteResponse'], ParentType, ContextType, RequireFields<MutationStartRouteArgs, 'routeId'>>,
  createRouteFeedback?: Resolver<ResolversTypes['RouteFeedbackResponse'], ParentType, ContextType, RequireFields<MutationCreateRouteFeedbackArgs, 'input'>>,
  claimReward?: Resolver<ResolversTypes['UserRewardResponse'], ParentType, ContextType, RequireFields<MutationClaimRewardArgs, 'rewardId'>>,
  createGoal?: Resolver<ResolversTypes['UserGoalResponse'], ParentType, ContextType, RequireFields<MutationCreateGoalArgs, 'input'>>,
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
  previousTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  routes?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserRouteResponse']>>>, ParentType, ContextType>,
  exportUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type TaskResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['TaskResponse'] = ResolversParentTypes['TaskResponse']> = {
  taskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  headerTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  media?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  choices?: Resolver<Maybe<ResolversTypes['Choices']>, ParentType, ContextType>,
  type?: Resolver<ResolversTypes['TaskType'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UpdateTaskResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UpdateTaskResponse'] = ResolversParentTypes['UpdateTaskResponse']> = {
  previousTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  nextTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserGoalResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserGoalResponse'] = ResolversParentTypes['UserGoalResponse']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
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
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  reward?: Resolver<ResolversTypes['RewardResponse'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['RewardStatus'], ParentType, ContextType>,
  barcodeImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserRouteResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserRouteResponse'] = ResolversParentTypes['UserRouteResponse']> = {
  route?: Resolver<ResolversTypes['RouteResponse'], ParentType, ContextType>,
  progress?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  status?: Resolver<ResolversTypes['UserRouteStatus'], ParentType, ContextType>,
  tasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserTaskResponse']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserTaskResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserTaskResponse'] = ResolversParentTypes['UserTaskResponse']> = {
  status?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>,
  task?: Resolver<ResolversTypes['TaskResponse'], ParentType, ContextType>,
  answer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = ModuleContext> = {
  AchivementResponse?: AchivementResponseResolvers<ContextType>,
  Choices?: GraphQLScalarType,
  Date?: GraphQLScalarType,
  MessageResponse?: MessageResponseResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  RegisterDeviceResponse?: RegisterDeviceResponseResolvers<ContextType>,
  RewardResponse?: RewardResponseResolvers<ContextType>,
  RouteAnswer?: GraphQLScalarType,
  RouteFeedbackResponse?: RouteFeedbackResponseResolvers<ContextType>,
  RouteResponse?: RouteResponseResolvers<ContextType>,
  StatusResponse?: StatusResponseResolvers<ContextType>,
  TaskResponse?: TaskResponseResolvers<ContextType>,
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
