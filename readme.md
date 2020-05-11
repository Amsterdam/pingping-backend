# PingPing Backend

## Development
`PORT=4010 yarn dev`

## Deployment
`yarn build`
`yarn prod`

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

## Tests
`yarn test`