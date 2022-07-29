# PingPing Backend

## Admin Development

To run the admin development you have to do the following:

```
cd admin
yarn install
VUE_APP_GRAPHQL_HTTP=http://localhost:4010/api yarn serve
```

## Development

```
yarn install
PORT=4010 yarn dev
```

## Deployment

```
yarn build
yarn prod
```

## Migration

- We have to delete user tasks that don't exist anymore.

## Tests

```
yarn test
```

## Enums

### TaskType

Tasks have 3 different types:

#### DateOfBirth

expected value of answer when updating task is `1996-12-31`

#### YesOrNo

expected value of answer when updating task is `yes` or `no`

#### MultipleChoices

expected value of answer comma separated values `choiceOne,choiseTwo`

### TaskStatus

#### Completed

Completed by the user

## Dismissed

Dismissed by the user, that is, the tas completion resulted in a negative response. This will not cause a linked task to be completed on a route.

#### PendingUser

Waiting for action by the user

### RewardStatus

#### AvailableToClaim

The reward can be claimed by the user and he has sufficient balance

#### Claimed

The reward is claimed by the user but not used

#### ClaimedAndUsed

The reward is claimed and used by the user

#### Expired

The reward is expired, cannot be claimed or used

## Configuration

### Initial Data

The `json` files in `defs` contain the configuration for the application and tenants.

#### onboardingTasks

Defines the initial tasks the user is asked to perform before being assigned his initial route. The tasks can have a direct link to a `routeTask`, so when completed this will also complete the task on that linked route.

#### routes

Available routes and their definitions of tasks

#### rewards

Available rewards for purchase

#### achievements

Unlockable achievements

## Error handling

Errors can be return on a specific occasion, the error message will be descriptive enough to clarify the meaning of the error. Here are some of these error listed

### task_not_defined

The task requested doesn't exists in the definition files

### task_not_found_on_user

The task requested doesn't exist on the user. This means it hassn't been assigned to the user or does not exist on a route the user has assigned to him.

### task_invalid_status

The task has an invalid status on the user. This could mean the task is already completed.

### achievement_not_defined

The achievement doesn't exist in the definition files

### reward_not_defined

The reward doesn't exist in the definition files

### route_not_defined

The route doesn't exist in the definition files

-
