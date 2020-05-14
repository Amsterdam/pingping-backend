# PingPing Backend

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
The `initialData.json` file contains the configuration for the application.

#### onboardingTasks
Defines the initial tasks the user is asked to perform before being assigned his initial route. The tasks can have a direct link to a `routeTask`, so when completed this will also complete the task on that linked route.

#### routes
Available routes and their definitions of tasks

#### rewards
Available rewards for purchase

#### achivements
Unlockable achivements

## Error handling
Errors can be return on a specific occasion, the error message will be descriptive enough to clarify the meaning of the error. Here are some of these error listed

### task_not_defined
The task requested doesn't exists in the initialData definition file

### task_not_found_on_user
The task requested doesn't  exist on the user. This means it hassn't been assigned to the user or does not exist on a route the user has assigned to him.

### task_invalid_status
The task has an invalid status on the user. This could mean the task is already completed.

### achivement_not_defined
The achivement doesn't exist in the initialData definition file

### reward_not_defined
The reward doesn't exist in the initialData definition file

### route_not_defined
The route doesn't exist in the initialData definition file

### route_not_found_on_user
The route is not found on the user

### route_already_assigned
The route is already active or completed on the user