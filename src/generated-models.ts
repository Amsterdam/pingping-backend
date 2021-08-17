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
  JSON: any;
  RouteAnswer: any;
};

export type AchievementResponse = {
   __typename?: 'AchievementResponse';
  achievementId: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  points: Scalars['Int'];
  status: AchievementStatus;
  icon?: Maybe<Scalars['String']>;
  earnedDate?: Maybe<Scalars['Date']>;
};

export enum AchievementStatus {
  AvailableToEarn = 'AvailableToEarn',
  Earned = 'Earned'
}

export enum AdminActionType {
  FixUsers = 'FixUsers',
  DeleteAllUsers = 'DeleteAllUsers'
}

export type AdminStatisticsResponse = {
   __typename?: 'AdminStatisticsResponse';
  usersPerWeek: Statistics;
  activeUsersPerWeek: Statistics;
  usersCumulative: Statistics;
  routesPerMonth: Statistics;
  routesCompletedPerMonth: Statistics;
  completedTasks: Statistics;
  routes?: Maybe<Array<RouteStatistics>>;
  activeUsers: StatisticNumberChange;
  totalUsers: StatisticNumberChange;
  usersPerYearOfBirth: Statistics;
  userPerMonthOfBirth: Statistics;
  skippedOnboarding: StatisticNumberChange;
};


export type AdminStatisticsResponseCompletedTasksArgs = {
  week?: Maybe<Scalars['String']>;
};


export type AdminStatisticsResponseUsersPerYearOfBirthArgs = {
  week?: Maybe<Scalars['String']>;
};


export type AdminStatisticsResponseUserPerMonthOfBirthArgs = {
  week?: Maybe<Scalars['String']>;
  minAge?: Maybe<Scalars['Int']>;
  maxAge?: Maybe<Scalars['Int']>;
};

export type AdminUserResponse = {
   __typename?: 'AdminUserResponse';
  id: Scalars['String'];
  devices?: Maybe<Array<DeviceResponse>>;
  role?: Maybe<UserRole>;
  balance: Scalars['Int'];
  email?: Maybe<Scalars['String']>;
  routes?: Maybe<Array<AdminUserRouteResponse>>;
  profile?: Maybe<UserProfileResponse>;
  userTasks?: Maybe<Array<UserTaskResponse>>;
  createdAt: Scalars['String'];
  activeAt?: Maybe<Scalars['String']>;
  rewards?: Maybe<Scalars['JSON']>;
  transactions?: Maybe<Scalars['JSON']>;
};

export type AdminUserRouteResponse = {
   __typename?: 'AdminUserRouteResponse';
  routeId: Scalars['String'];
  status: UserRouteStatus;
  createdAt?: Maybe<Scalars['Date']>;
  completedAt?: Maybe<Scalars['Date']>;
};


export type AdminUserRouteResponseCreatedAtArgs = {
  format?: Maybe<Scalars['String']>;
};


export type AdminUserRouteResponseCompletedAtArgs = {
  format?: Maybe<Scalars['String']>;
};

export type AuditLogResponse = {
   __typename?: 'AuditLogResponse';
  createdAt?: Maybe<Scalars['Date']>;
  user?: Maybe<UserResponse>;
  type: AuditLogType;
  description: Scalars['String'];
};

export enum AuditLogType {
  ViewUser = 'ViewUser',
  DeleteUser = 'DeleteUser',
  CreateUser = 'CreateUser',
  AdminLogin = 'AdminLogin',
  UpdateReward = 'UpdateReward',
  SendNotifications = 'SendNotifications'
}


export type CompleteTaskResponse = {
   __typename?: 'CompleteTaskResponse';
  previousTask?: Maybe<UserTaskResponse>;
};

export type ContactInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  body: Scalars['String'];
};

export type CreateGoalInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  amount: Scalars['Int'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  fullName: Scalars['String'];
  password: Scalars['String'];
  role: UserRole;
};


export type DeviceResponse = {
   __typename?: 'DeviceResponse';
  id: Scalars['String'];
  token?: Maybe<Scalars['String']>;
  os?: Maybe<Scalars['String']>;
  notificationStatus?: Maybe<NotificationStatus>;
};

export type ExportResponse = {
   __typename?: 'ExportResponse';
  token: Scalars['String'];
};

export type GetRoutesResponse = {
   __typename?: 'GetRoutesResponse';
  /** Routes currently assigned to the user */
  currentRoutes?: Maybe<Array<RouteResponse>>;
  /** All available routes */
  availableRoutes?: Maybe<Array<RouteResponse>>;
  /** Archived & completed routes */
  archivedRoutes?: Maybe<Array<RouteResponse>>;
};


export type LocactionInput = {
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
};

export enum Locale {
  NlNl = 'nl_NL'
}

export type LoginResponse = {
   __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  user: UserResponse;
};

export type Media = {
   __typename?: 'Media';
  type: MediaType;
  value: Scalars['String'];
  thumbnail?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
};

export enum MediaType {
  YouTube = 'YouTube',
  Image = 'Image'
}

export type MessageResponse = {
   __typename?: 'MessageResponse';
  message: Scalars['String'];
};

export type Mutation = {
   __typename?: 'Mutation';
  /** Update a task with an answer and change the status of the task depending on the input. */
  updateTask: UpdateTaskResponse;
  /** Mark a task as completed without providing input. */
  completeTask: CompleteTaskResponse;
  /** Revert previous task to go back */
  revertTask: Scalars['String'];
  createRouteFeedback: RouteFeedbackResponse;
  /** Claim Rewards */
  claimReward: UserRewardResponse;
  /** Admin: Update a single reward */
  adminUpdateReward: RewardResponse;
  createGoal: UserGoalResponse;
  deleteUser?: Maybe<MessageResponse>;
  registerNotifications: DeviceResponse;
  contact?: Maybe<Scalars['String']>;
  adminActions: Scalars['String'];
  adminSendNotifications: Scalars['JSON'];
  adminCreateUser: UserResponse;
  adminDeleteUser: Scalars['String'];
  /** Admin: Login with email & password */
  adminLogin: LoginResponse;
  adminDeleteRewardVoucher: MessageResponse;
  /** Register a device to get an access token */
  registerDevice: RegisterDeviceResponse;
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};


export type MutationCompleteTaskArgs = {
  taskId: Scalars['String'];
};


export type MutationRevertTaskArgs = {
  taskId: Scalars['String'];
};


export type MutationCreateRouteFeedbackArgs = {
  input: RouteFeedbackInput;
};


export type MutationClaimRewardArgs = {
  rewardId: Scalars['String'];
};


export type MutationAdminUpdateRewardArgs = {
  id?: Maybe<Scalars['String']>;
  vouchers?: Maybe<Array<Maybe<RewardVoucherInput>>>;
};


export type MutationCreateGoalArgs = {
  input: CreateGoalInput;
};


export type MutationDeleteUserArgs = {
  confirm?: Maybe<Scalars['String']>;
};


export type MutationRegisterNotificationsArgs = {
  input: RegisterNotificationsInput;
};


export type MutationContactArgs = {
  input?: Maybe<ContactInput>;
};


export type MutationAdminActionsArgs = {
  type: AdminActionType;
};


export type MutationAdminSendNotificationsArgs = {
  input: SendNotificationInput;
};


export type MutationAdminCreateUserArgs = {
  input?: Maybe<CreateUserInput>;
};


export type MutationAdminDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationAdminLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  deviceId: Scalars['String'];
};


export type MutationAdminDeleteRewardVoucherArgs = {
  id?: Maybe<Scalars['String']>;
};


export type MutationRegisterDeviceArgs = {
  input: RegisterDeviceInput;
};

export enum NotificationDeliveryStatus {
  Initial = 'Initial',
  Delivered = 'Delivered',
  Viewed = 'Viewed',
  FailedToDeliver = 'FailedToDeliver'
}

export type NotificationDraftResponse = {
   __typename?: 'NotificationDraftResponse';
  title?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  payload?: Maybe<Scalars['JSON']>;
  recipientUserIds: Array<Scalars['String']>;
};

export type NotificationResponse = {
   __typename?: 'NotificationResponse';
  id: Scalars['String'];
  createdAt: Scalars['Date'];
  type: NotificationType;
  status: NotificationDeliveryStatus;
};

export enum NotificationStatus {
  Initial = 'Initial',
  Declined = 'Declined',
  Approved = 'Approved'
}

export enum NotificationType {
  RemindUserToContinueRoute = 'RemindUserToContinueRoute',
  RemindUserToCompleteOnboarding = 'RemindUserToCompleteOnboarding',
  Manual = 'Manual'
}

export type Query = {
   __typename?: 'Query';
  /** Get all routes */
  getRoutes: GetRoutesResponse;
  /** Get a specific route */
  getRoute: RouteResponse;
  /** Get a single user task */
  getUserTask: UserTaskResponse;
  getAvailableRewards: Array<RewardResponse>;
  getRewards: Array<RewardResponse>;
  getStatus: StatusResponse;
  whoAmI: UserResponse;
  getAchievements: Array<AchievementResponse>;
  adminStatistics: AdminStatisticsResponse;
  adminGetUsers: Array<Maybe<AdminUserResponse>>;
  adminGetAuditLog?: Maybe<Array<AuditLogResponse>>;
  adminGetFeedback?: Maybe<Array<RouteFeedbackResponse>>;
  getNotifications: Array<NotificationResponse>;
  getEnv: Scalars['String'];
  getDraftNotification?: Maybe<NotificationDraftResponse>;
};


export type QueryGetRouteArgs = {
  routeId: Scalars['String'];
};


export type QueryGetUserTaskArgs = {
  routeId: Scalars['String'];
  taskId: Scalars['String'];
};


export type QueryAdminStatisticsArgs = {
  week?: Maybe<Scalars['String']>;
};


export type QueryAdminGetUsersArgs = {
  roles?: Maybe<Array<UserRole>>;
  filter?: Maybe<UserFilter>;
};


export type QueryGetDraftNotificationArgs = {
  type: NotificationType;
  routeId?: Maybe<Scalars['String']>;
};

export type RegisterDeviceInput = {
  /** Include export token to transfer from another device */
  exportToken?: Maybe<Scalars['String']>;
  deviceId: Scalars['String'];
  deviceOs?: Maybe<Scalars['String']>;
  deviceType?: Maybe<Scalars['String']>;
  deviceToken?: Maybe<Scalars['String']>;
  locale?: Maybe<Locale>;
  location?: Maybe<LocactionInput>;
};

export type RegisterDeviceResponse = {
   __typename?: 'RegisterDeviceResponse';
  accessToken: Scalars['String'];
  user: UserResponse;
  currentTask?: Maybe<UserTaskResponse>;
};

export type RegisterNotificationsInput = {
  notificationStatus: NotificationStatus;
  /** Device token used to send out notifications */
  deviceToken: Scalars['String'];
};

export type RewardResponse = {
   __typename?: 'RewardResponse';
  rewardId: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /** @deprecated Use `cover`. */
  imageUrl?: Maybe<Scalars['String']>;
  /** @deprecated Use `cover`. */
  thumbnailUrl?: Maybe<Scalars['String']>;
  cover?: Maybe<Media>;
  price: Scalars['Int'];
  status: RewardStatus;
  active: Scalars['Boolean'];
  vouchers?: Maybe<Array<Maybe<RewardVoucherResponse>>>;
};

export enum RewardStatus {
  AvailableToClaim = 'AvailableToClaim',
  Claimed = 'Claimed',
  ClaimedAndUsed = 'ClaimedAndUsed',
  Expired = 'Expired',
  NotAvailable = 'NotAvailable'
}

export enum RewardType {
  Voucher = 'Voucher',
  SelfIssued = 'SelfIssued'
}

export type RewardVoucherInput = {
  id?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['JSON']>;
};

export type RewardVoucherResponse = {
   __typename?: 'RewardVoucherResponse';
  id: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['JSON']>;
};


export type RouteFeedbackInput = {
  routeId?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['Int']>;
  feedback?: Maybe<Scalars['String']>;
};

export type RouteFeedbackResponse = {
   __typename?: 'RouteFeedbackResponse';
  rating?: Maybe<Scalars['Int']>;
  routeId?: Maybe<Scalars['String']>;
  feedback?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
};

export type RouteResponse = {
   __typename?: 'RouteResponse';
  routeId: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /** @deprecated Use `cover`. */
  coverImageUrl?: Maybe<Scalars['String']>;
  cover?: Maybe<Media>;
  /** @deprecated Use `cover`. */
  mainColor?: Maybe<Scalars['String']>;
  /** @deprecated Use `cover`. */
  thumbnailUrl?: Maybe<Scalars['String']>;
  isSuggested: Scalars['Boolean'];
  numberOfSteps: Scalars['Int'];
  totalPoints: Scalars['Int'];
  targetAudience: Scalars['String'];
  tips?: Maybe<Array<RouteTip>>;
  progress?: Maybe<Scalars['Float']>;
  hasSubmittedFeedback: Scalars['Boolean'];
  tasks?: Maybe<Array<Maybe<UserTaskResponse>>>;
};

export type RouteStatistics = {
   __typename?: 'RouteStatistics';
  title: Scalars['String'];
  data: Statistics;
};

export type RouteTip = {
   __typename?: 'RouteTip';
  title: Scalars['String'];
  description: Scalars['String'];
};

export type SendNotificationInput = {
  title: Scalars['String'];
  message: Scalars['String'];
  type: NotificationType;
  payload: Scalars['JSON'];
  recipientUserIds: Array<Scalars['String']>;
};

export type StatisticNumberChange = {
   __typename?: 'StatisticNumberChange';
  current: Scalars['Int'];
  percentile?: Maybe<Scalars['Float']>;
  change?: Maybe<Scalars['Float']>;
};

export type Statistics = {
   __typename?: 'Statistics';
  dump?: Maybe<Scalars['JSON']>;
  values: Array<Maybe<Scalars['Int']>>;
  keys: Array<Scalars['String']>;
};

export type StatusResponse = {
   __typename?: 'StatusResponse';
  user: UserResponse;
  /** Current tasks to be completed */
  currentTask?: Maybe<UserTaskResponse>;
  /** Previously completed task */
  previousTask?: Maybe<UserTaskResponse>;
  /** Export token to transfer user to another device */
  exportToken: Scalars['String'];
  /** Current device */
  device: DeviceResponse;
};

export type TaskResponse = {
   __typename?: 'TaskResponse';
  taskId: Scalars['String'];
  title: Scalars['String'];
  headerTitle: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  media?: Maybe<Media>;
  choices?: Maybe<Scalars['Choices']>;
  progress?: Maybe<Scalars['Float']>;
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
  Confirm = 'Confirm',
  MultipleChoices = 'MultipleChoices',
  Other = 'Other',
  GoBack = 'GoBack'
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

export enum UserFilter {
  None = 'None',
  NotAmsterdam = 'NotAmsterdam',
  SkippedOnboarding = 'SkippedOnboarding',
  OnboardingIncomplete = 'OnboardingIncomplete',
  InactiveInFixJeBasis = 'InactiveInFixJeBasis',
  CompletedFixJeBasis = 'CompletedFixJeBasis'
}

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
  fullName?: Maybe<Scalars['String']>;
};

export type UserResponse = {
   __typename?: 'UserResponse';
  id: Scalars['String'];
  profile: UserProfileResponse;
  balance: Scalars['Int'];
  role?: Maybe<UserRole>;
  goals?: Maybe<Array<UserGoalResponse>>;
  rewards?: Maybe<Array<UserRewardResponse>>;
  devices?: Maybe<Array<DeviceResponse>>;
  createdAt: Scalars['String'];
  activeAt?: Maybe<Scalars['String']>;
};

export type UserRewardResponse = {
   __typename?: 'UserRewardResponse';
  id: Scalars['String'];
  reward: RewardResponse;
  status: RewardStatus;
  barcodeImageUrl?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['JSON']>;
};

export enum UserRole {
  User = 'User',
  Admin = 'Admin',
  Employee = 'Employee',
  Developer = 'Developer',
  Reporter = 'Reporter'
}

export enum UserRouteStatus {
  Active = 'Active',
  Completed = 'Completed',
  Archived = 'Archived'
}

export type UserTaskResponse = {
   __typename?: 'UserTaskResponse';
  status: TaskStatus;
  task: TaskResponse;
  answer?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
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
  GetRoutesResponse: ResolverTypeWrapper<GetRoutesResponse>,
  RouteResponse: ResolverTypeWrapper<RouteResponse>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Media: ResolverTypeWrapper<Media>,
  MediaType: MediaType,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  RouteTip: ResolverTypeWrapper<RouteTip>,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  UserTaskResponse: ResolverTypeWrapper<UserTaskResponse>,
  TaskStatus: TaskStatus,
  TaskResponse: ResolverTypeWrapper<TaskResponse>,
  Choices: ResolverTypeWrapper<Scalars['Choices']>,
  TaskType: TaskType,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  RewardResponse: ResolverTypeWrapper<RewardResponse>,
  RewardStatus: RewardStatus,
  RewardVoucherResponse: ResolverTypeWrapper<RewardVoucherResponse>,
  JSON: ResolverTypeWrapper<Scalars['JSON']>,
  StatusResponse: ResolverTypeWrapper<StatusResponse>,
  UserResponse: ResolverTypeWrapper<UserResponse>,
  UserProfileResponse: ResolverTypeWrapper<UserProfileResponse>,
  UserRole: UserRole,
  UserGoalResponse: ResolverTypeWrapper<UserGoalResponse>,
  UserRewardResponse: ResolverTypeWrapper<UserRewardResponse>,
  DeviceResponse: ResolverTypeWrapper<DeviceResponse>,
  NotificationStatus: NotificationStatus,
  AchievementResponse: ResolverTypeWrapper<AchievementResponse>,
  AchievementStatus: AchievementStatus,
  AdminStatisticsResponse: ResolverTypeWrapper<AdminStatisticsResponse>,
  Statistics: ResolverTypeWrapper<Statistics>,
  RouteStatistics: ResolverTypeWrapper<RouteStatistics>,
  StatisticNumberChange: ResolverTypeWrapper<StatisticNumberChange>,
  UserFilter: UserFilter,
  AdminUserResponse: ResolverTypeWrapper<AdminUserResponse>,
  AdminUserRouteResponse: ResolverTypeWrapper<AdminUserRouteResponse>,
  UserRouteStatus: UserRouteStatus,
  AuditLogResponse: ResolverTypeWrapper<AuditLogResponse>,
  AuditLogType: AuditLogType,
  RouteFeedbackResponse: ResolverTypeWrapper<RouteFeedbackResponse>,
  NotificationResponse: ResolverTypeWrapper<NotificationResponse>,
  NotificationType: NotificationType,
  NotificationDeliveryStatus: NotificationDeliveryStatus,
  NotificationDraftResponse: ResolverTypeWrapper<NotificationDraftResponse>,
  Mutation: ResolverTypeWrapper<{}>,
  UpdateTaskInput: UpdateTaskInput,
  UpdateTaskResponse: ResolverTypeWrapper<UpdateTaskResponse>,
  CompleteTaskResponse: ResolverTypeWrapper<CompleteTaskResponse>,
  RouteFeedbackInput: RouteFeedbackInput,
  RewardVoucherInput: RewardVoucherInput,
  CreateGoalInput: CreateGoalInput,
  MessageResponse: ResolverTypeWrapper<MessageResponse>,
  RegisterNotificationsInput: RegisterNotificationsInput,
  ContactInput: ContactInput,
  AdminActionType: AdminActionType,
  SendNotificationInput: SendNotificationInput,
  CreateUserInput: CreateUserInput,
  LoginResponse: ResolverTypeWrapper<LoginResponse>,
  RegisterDeviceInput: RegisterDeviceInput,
  Locale: Locale,
  LocactionInput: LocactionInput,
  RegisterDeviceResponse: ResolverTypeWrapper<RegisterDeviceResponse>,
  ExportResponse: ResolverTypeWrapper<ExportResponse>,
  RewardType: RewardType,
  RouteAnswer: ResolverTypeWrapper<Scalars['RouteAnswer']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  GetRoutesResponse: GetRoutesResponse,
  RouteResponse: RouteResponse,
  String: Scalars['String'],
  Media: Media,
  MediaType: MediaType,
  Boolean: Scalars['Boolean'],
  Int: Scalars['Int'],
  RouteTip: RouteTip,
  Float: Scalars['Float'],
  UserTaskResponse: UserTaskResponse,
  TaskStatus: TaskStatus,
  TaskResponse: TaskResponse,
  Choices: Scalars['Choices'],
  TaskType: TaskType,
  Date: Scalars['Date'],
  RewardResponse: RewardResponse,
  RewardStatus: RewardStatus,
  RewardVoucherResponse: RewardVoucherResponse,
  JSON: Scalars['JSON'],
  StatusResponse: StatusResponse,
  UserResponse: UserResponse,
  UserProfileResponse: UserProfileResponse,
  UserRole: UserRole,
  UserGoalResponse: UserGoalResponse,
  UserRewardResponse: UserRewardResponse,
  DeviceResponse: DeviceResponse,
  NotificationStatus: NotificationStatus,
  AchievementResponse: AchievementResponse,
  AchievementStatus: AchievementStatus,
  AdminStatisticsResponse: AdminStatisticsResponse,
  Statistics: Statistics,
  RouteStatistics: RouteStatistics,
  StatisticNumberChange: StatisticNumberChange,
  UserFilter: UserFilter,
  AdminUserResponse: AdminUserResponse,
  AdminUserRouteResponse: AdminUserRouteResponse,
  UserRouteStatus: UserRouteStatus,
  AuditLogResponse: AuditLogResponse,
  AuditLogType: AuditLogType,
  RouteFeedbackResponse: RouteFeedbackResponse,
  NotificationResponse: NotificationResponse,
  NotificationType: NotificationType,
  NotificationDeliveryStatus: NotificationDeliveryStatus,
  NotificationDraftResponse: NotificationDraftResponse,
  Mutation: {},
  UpdateTaskInput: UpdateTaskInput,
  UpdateTaskResponse: UpdateTaskResponse,
  CompleteTaskResponse: CompleteTaskResponse,
  RouteFeedbackInput: RouteFeedbackInput,
  RewardVoucherInput: RewardVoucherInput,
  CreateGoalInput: CreateGoalInput,
  MessageResponse: MessageResponse,
  RegisterNotificationsInput: RegisterNotificationsInput,
  ContactInput: ContactInput,
  AdminActionType: AdminActionType,
  SendNotificationInput: SendNotificationInput,
  CreateUserInput: CreateUserInput,
  LoginResponse: LoginResponse,
  RegisterDeviceInput: RegisterDeviceInput,
  Locale: Locale,
  LocactionInput: LocactionInput,
  RegisterDeviceResponse: RegisterDeviceResponse,
  ExportResponse: ExportResponse,
  RewardType: RewardType,
  RouteAnswer: Scalars['RouteAnswer'],
};

export type AchievementResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['AchievementResponse'] = ResolversParentTypes['AchievementResponse']> = {
  achievementId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['AchievementStatus'], ParentType, ContextType>,
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  earnedDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type AdminStatisticsResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['AdminStatisticsResponse'] = ResolversParentTypes['AdminStatisticsResponse']> = {
  usersPerWeek?: Resolver<ResolversTypes['Statistics'], ParentType, ContextType>,
  activeUsersPerWeek?: Resolver<ResolversTypes['Statistics'], ParentType, ContextType>,
  usersCumulative?: Resolver<ResolversTypes['Statistics'], ParentType, ContextType>,
  routesPerMonth?: Resolver<ResolversTypes['Statistics'], ParentType, ContextType>,
  routesCompletedPerMonth?: Resolver<ResolversTypes['Statistics'], ParentType, ContextType>,
  completedTasks?: Resolver<ResolversTypes['Statistics'], ParentType, ContextType, RequireFields<AdminStatisticsResponseCompletedTasksArgs, never>>,
  routes?: Resolver<Maybe<Array<ResolversTypes['RouteStatistics']>>, ParentType, ContextType>,
  activeUsers?: Resolver<ResolversTypes['StatisticNumberChange'], ParentType, ContextType>,
  totalUsers?: Resolver<ResolversTypes['StatisticNumberChange'], ParentType, ContextType>,
  usersPerYearOfBirth?: Resolver<ResolversTypes['Statistics'], ParentType, ContextType, RequireFields<AdminStatisticsResponseUsersPerYearOfBirthArgs, never>>,
  userPerMonthOfBirth?: Resolver<ResolversTypes['Statistics'], ParentType, ContextType, RequireFields<AdminStatisticsResponseUserPerMonthOfBirthArgs, 'minAge' | 'maxAge'>>,
  skippedOnboarding?: Resolver<ResolversTypes['StatisticNumberChange'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type AdminUserResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['AdminUserResponse'] = ResolversParentTypes['AdminUserResponse']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  devices?: Resolver<Maybe<Array<ResolversTypes['DeviceResponse']>>, ParentType, ContextType>,
  role?: Resolver<Maybe<ResolversTypes['UserRole']>, ParentType, ContextType>,
  balance?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  routes?: Resolver<Maybe<Array<ResolversTypes['AdminUserRouteResponse']>>, ParentType, ContextType>,
  profile?: Resolver<Maybe<ResolversTypes['UserProfileResponse']>, ParentType, ContextType>,
  userTasks?: Resolver<Maybe<Array<ResolversTypes['UserTaskResponse']>>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  activeAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  rewards?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
  transactions?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type AdminUserRouteResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['AdminUserRouteResponse'] = ResolversParentTypes['AdminUserRouteResponse']> = {
  routeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['UserRouteStatus'], ParentType, ContextType>,
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType, RequireFields<AdminUserRouteResponseCreatedAtArgs, never>>,
  completedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType, RequireFields<AdminUserRouteResponseCompletedAtArgs, never>>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type AuditLogResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['AuditLogResponse'] = ResolversParentTypes['AuditLogResponse']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['UserResponse']>, ParentType, ContextType>,
  type?: Resolver<ResolversTypes['AuditLogType'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export interface ChoicesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Choices'], any> {
  name: 'Choices'
}

export type CompleteTaskResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['CompleteTaskResponse'] = ResolversParentTypes['CompleteTaskResponse']> = {
  previousTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type DeviceResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['DeviceResponse'] = ResolversParentTypes['DeviceResponse']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  os?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  notificationStatus?: Resolver<Maybe<ResolversTypes['NotificationStatus']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ExportResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['ExportResponse'] = ResolversParentTypes['ExportResponse']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type GetRoutesResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['GetRoutesResponse'] = ResolversParentTypes['GetRoutesResponse']> = {
  currentRoutes?: Resolver<Maybe<Array<ResolversTypes['RouteResponse']>>, ParentType, ContextType>,
  availableRoutes?: Resolver<Maybe<Array<ResolversTypes['RouteResponse']>>, ParentType, ContextType>,
  archivedRoutes?: Resolver<Maybe<Array<ResolversTypes['RouteResponse']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export type LoginResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MediaResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Media'] = ResolversParentTypes['Media']> = {
  type?: Resolver<ResolversTypes['MediaType'], ParentType, ContextType>,
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MessageResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['MessageResponse'] = ResolversParentTypes['MessageResponse']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MutationResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  updateTask?: Resolver<ResolversTypes['UpdateTaskResponse'], ParentType, ContextType, RequireFields<MutationUpdateTaskArgs, 'input'>>,
  completeTask?: Resolver<ResolversTypes['CompleteTaskResponse'], ParentType, ContextType, RequireFields<MutationCompleteTaskArgs, 'taskId'>>,
  revertTask?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationRevertTaskArgs, 'taskId'>>,
  createRouteFeedback?: Resolver<ResolversTypes['RouteFeedbackResponse'], ParentType, ContextType, RequireFields<MutationCreateRouteFeedbackArgs, 'input'>>,
  claimReward?: Resolver<ResolversTypes['UserRewardResponse'], ParentType, ContextType, RequireFields<MutationClaimRewardArgs, 'rewardId'>>,
  adminUpdateReward?: Resolver<ResolversTypes['RewardResponse'], ParentType, ContextType, RequireFields<MutationAdminUpdateRewardArgs, never>>,
  createGoal?: Resolver<ResolversTypes['UserGoalResponse'], ParentType, ContextType, RequireFields<MutationCreateGoalArgs, 'input'>>,
  deleteUser?: Resolver<Maybe<ResolversTypes['MessageResponse']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, never>>,
  registerNotifications?: Resolver<ResolversTypes['DeviceResponse'], ParentType, ContextType, RequireFields<MutationRegisterNotificationsArgs, 'input'>>,
  contact?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationContactArgs, never>>,
  adminActions?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAdminActionsArgs, 'type'>>,
  adminSendNotifications?: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<MutationAdminSendNotificationsArgs, 'input'>>,
  adminCreateUser?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType, RequireFields<MutationAdminCreateUserArgs, never>>,
  adminDeleteUser?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAdminDeleteUserArgs, 'id'>>,
  adminLogin?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationAdminLoginArgs, 'email' | 'password' | 'deviceId'>>,
  adminDeleteRewardVoucher?: Resolver<ResolversTypes['MessageResponse'], ParentType, ContextType, RequireFields<MutationAdminDeleteRewardVoucherArgs, never>>,
  registerDevice?: Resolver<ResolversTypes['RegisterDeviceResponse'], ParentType, ContextType, RequireFields<MutationRegisterDeviceArgs, 'input'>>,
};

export type NotificationDraftResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['NotificationDraftResponse'] = ResolversParentTypes['NotificationDraftResponse']> = {
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  payload?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
  recipientUserIds?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type NotificationResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['NotificationResponse'] = ResolversParentTypes['NotificationResponse']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['NotificationType'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['NotificationDeliveryStatus'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getRoutes?: Resolver<ResolversTypes['GetRoutesResponse'], ParentType, ContextType>,
  getRoute?: Resolver<ResolversTypes['RouteResponse'], ParentType, ContextType, RequireFields<QueryGetRouteArgs, 'routeId'>>,
  getUserTask?: Resolver<ResolversTypes['UserTaskResponse'], ParentType, ContextType, RequireFields<QueryGetUserTaskArgs, 'routeId' | 'taskId'>>,
  getAvailableRewards?: Resolver<Array<ResolversTypes['RewardResponse']>, ParentType, ContextType>,
  getRewards?: Resolver<Array<ResolversTypes['RewardResponse']>, ParentType, ContextType>,
  getStatus?: Resolver<ResolversTypes['StatusResponse'], ParentType, ContextType>,
  whoAmI?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType>,
  getAchievements?: Resolver<Array<ResolversTypes['AchievementResponse']>, ParentType, ContextType>,
  adminStatistics?: Resolver<ResolversTypes['AdminStatisticsResponse'], ParentType, ContextType, RequireFields<QueryAdminStatisticsArgs, never>>,
  adminGetUsers?: Resolver<Array<Maybe<ResolversTypes['AdminUserResponse']>>, ParentType, ContextType, RequireFields<QueryAdminGetUsersArgs, never>>,
  adminGetAuditLog?: Resolver<Maybe<Array<ResolversTypes['AuditLogResponse']>>, ParentType, ContextType>,
  adminGetFeedback?: Resolver<Maybe<Array<ResolversTypes['RouteFeedbackResponse']>>, ParentType, ContextType>,
  getNotifications?: Resolver<Array<ResolversTypes['NotificationResponse']>, ParentType, ContextType>,
  getEnv?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  getDraftNotification?: Resolver<Maybe<ResolversTypes['NotificationDraftResponse']>, ParentType, ContextType, RequireFields<QueryGetDraftNotificationArgs, 'type'>>,
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
  thumbnailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  cover?: Resolver<Maybe<ResolversTypes['Media']>, ParentType, ContextType>,
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['RewardStatus'], ParentType, ContextType>,
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  vouchers?: Resolver<Maybe<Array<Maybe<ResolversTypes['RewardVoucherResponse']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type RewardVoucherResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['RewardVoucherResponse'] = ResolversParentTypes['RewardVoucherResponse']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  userId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export interface RouteAnswerScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RouteAnswer'], any> {
  name: 'RouteAnswer'
}

export type RouteFeedbackResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['RouteFeedbackResponse'] = ResolversParentTypes['RouteFeedbackResponse']> = {
  rating?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  routeId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  feedback?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type RouteResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['RouteResponse'] = ResolversParentTypes['RouteResponse']> = {
  routeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  coverImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  cover?: Resolver<Maybe<ResolversTypes['Media']>, ParentType, ContextType>,
  mainColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  thumbnailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  isSuggested?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  numberOfSteps?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  totalPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  targetAudience?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  tips?: Resolver<Maybe<Array<ResolversTypes['RouteTip']>>, ParentType, ContextType>,
  progress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>,
  hasSubmittedFeedback?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  tasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserTaskResponse']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type RouteStatisticsResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['RouteStatistics'] = ResolversParentTypes['RouteStatistics']> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  data?: Resolver<ResolversTypes['Statistics'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type RouteTipResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['RouteTip'] = ResolversParentTypes['RouteTip']> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type StatisticNumberChangeResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['StatisticNumberChange'] = ResolversParentTypes['StatisticNumberChange']> = {
  current?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  percentile?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>,
  change?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type StatisticsResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['Statistics'] = ResolversParentTypes['Statistics']> = {
  dump?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
  values?: Resolver<Array<Maybe<ResolversTypes['Int']>>, ParentType, ContextType>,
  keys?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type StatusResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['StatusResponse'] = ResolversParentTypes['StatusResponse']> = {
  user?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType>,
  currentTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  previousTask?: Resolver<Maybe<ResolversTypes['UserTaskResponse']>, ParentType, ContextType>,
  exportToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  device?: Resolver<ResolversTypes['DeviceResponse'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type TaskResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['TaskResponse'] = ResolversParentTypes['TaskResponse']> = {
  taskId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  headerTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  media?: Resolver<Maybe<ResolversTypes['Media']>, ParentType, ContextType>,
  choices?: Resolver<Maybe<ResolversTypes['Choices']>, ParentType, ContextType>,
  progress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>,
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
  fullName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserResponse'] = ResolversParentTypes['UserResponse']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  profile?: Resolver<ResolversTypes['UserProfileResponse'], ParentType, ContextType>,
  balance?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  role?: Resolver<Maybe<ResolversTypes['UserRole']>, ParentType, ContextType>,
  goals?: Resolver<Maybe<Array<ResolversTypes['UserGoalResponse']>>, ParentType, ContextType>,
  rewards?: Resolver<Maybe<Array<ResolversTypes['UserRewardResponse']>>, ParentType, ContextType>,
  devices?: Resolver<Maybe<Array<ResolversTypes['DeviceResponse']>>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  activeAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserRewardResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserRewardResponse'] = ResolversParentTypes['UserRewardResponse']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  reward?: Resolver<ResolversTypes['RewardResponse'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['RewardStatus'], ParentType, ContextType>,
  barcodeImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserTaskResponseResolvers<ContextType = ModuleContext, ParentType extends ResolversParentTypes['UserTaskResponse'] = ResolversParentTypes['UserTaskResponse']> = {
  status?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>,
  task?: Resolver<ResolversTypes['TaskResponse'], ParentType, ContextType>,
  answer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = ModuleContext> = {
  AchievementResponse?: AchievementResponseResolvers<ContextType>,
  AdminStatisticsResponse?: AdminStatisticsResponseResolvers<ContextType>,
  AdminUserResponse?: AdminUserResponseResolvers<ContextType>,
  AdminUserRouteResponse?: AdminUserRouteResponseResolvers<ContextType>,
  AuditLogResponse?: AuditLogResponseResolvers<ContextType>,
  Choices?: GraphQLScalarType,
  CompleteTaskResponse?: CompleteTaskResponseResolvers<ContextType>,
  Date?: GraphQLScalarType,
  DeviceResponse?: DeviceResponseResolvers<ContextType>,
  ExportResponse?: ExportResponseResolvers<ContextType>,
  GetRoutesResponse?: GetRoutesResponseResolvers<ContextType>,
  JSON?: GraphQLScalarType,
  LoginResponse?: LoginResponseResolvers<ContextType>,
  Media?: MediaResolvers<ContextType>,
  MessageResponse?: MessageResponseResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  NotificationDraftResponse?: NotificationDraftResponseResolvers<ContextType>,
  NotificationResponse?: NotificationResponseResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  RegisterDeviceResponse?: RegisterDeviceResponseResolvers<ContextType>,
  RewardResponse?: RewardResponseResolvers<ContextType>,
  RewardVoucherResponse?: RewardVoucherResponseResolvers<ContextType>,
  RouteAnswer?: GraphQLScalarType,
  RouteFeedbackResponse?: RouteFeedbackResponseResolvers<ContextType>,
  RouteResponse?: RouteResponseResolvers<ContextType>,
  RouteStatistics?: RouteStatisticsResolvers<ContextType>,
  RouteTip?: RouteTipResolvers<ContextType>,
  StatisticNumberChange?: StatisticNumberChangeResolvers<ContextType>,
  Statistics?: StatisticsResolvers<ContextType>,
  StatusResponse?: StatusResponseResolvers<ContextType>,
  TaskResponse?: TaskResponseResolvers<ContextType>,
  UpdateTaskResponse?: UpdateTaskResponseResolvers<ContextType>,
  UserGoalResponse?: UserGoalResponseResolvers<ContextType>,
  UserProfileResponse?: UserProfileResponseResolvers<ContextType>,
  UserResponse?: UserResponseResolvers<ContextType>,
  UserRewardResponse?: UserRewardResponseResolvers<ContextType>,
  UserTaskResponse?: UserTaskResponseResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = ModuleContext> = Resolvers<ContextType>;
