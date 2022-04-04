#!/usr/bin/env ts-node
import boot from '../boot';
import sinon from 'sinon';
import moment from 'moment';
import faker from 'faker';
import { argv } from 'process';
import readline from 'readline';
import UserUtil from 'utils/UserUtil';
import { User, DATA_SET_AMSTERDAM } from 'models/User';
import TaskUtil from 'utils/TaskUtil';
import { NotificationStatus, TaskStatus } from '@models';
import StatisticsUtil from 'utils/StatisticsUtil';
import { ENV_DEVELOPMENT } from 'config/index';
import MigrationUtil from 'utils/MigrationUtil';
import { UserTask } from 'models/UserTask';
import { DATA_SET_ROTTERDAM, DATA_SET_NONE } from 'models/User';
import { RouteFeedback } from 'models/RouteFeedback';
import { PushNotificationUtil } from 'utils/PushNotificationUtil';
import { use } from 'chai';

const START_DATE = '2022-01-01';
const NUMBER_OF_DAYS = moment().diff(moment(START_DATE), 'days');
const MIN_USERS_PER_DAY = 2;
const MAX_USERS_PER_DAY = 8;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const seed = async () => {
  if (process.env.ENVIRONMENT !== ENV_DEVELOPMENT) {
    console.error(`This command can only be run during development, current ${process.env.ENVIRONMENT}`);
    process.exit(1);
  }
  const type = argv[2];

  let payload, result;

  switch (type) {
    case 'push':
      const payload = PushNotificationUtil.getPayload('Hello', 'This is a test notification', {});
      await PushNotificationUtil.send([argv[3]], payload);
      break;
    case 'mock-data':
      let startDate = moment(START_DATE);
      // Mock PingPing Start Date
      sinon.useFakeTimers(startDate.toDate());

      for (var d = 0; d <= NUMBER_OF_DAYS; d++) {
        MigrationUtil.checkRouteProgress();
        let numberOfUsersToday = getRandomNumber(MAX_USERS_PER_DAY, MIN_USERS_PER_DAY);
        sinon.useFakeTimers(startDate.add(1, 'days').toDate());

        console.info('Today is', moment().toDate(), 'creating', numberOfUsersToday, 'users');

        for (var un = 0; un <= numberOfUsersToday; un++) {
          // Create [n-(n+r) number of users
          const user = await UserUtil.createOrFindUser({
            deviceId: Math.random().toString(36).slice(2),
            deviceOs: Boolean(Math.round(Math.random())) ? 'Android' : 'iOS',
          });
          user.devices[0].notificationStatus = Boolean(Math.round(Math.random()))
            ? NotificationStatus.Approved
            : NotificationStatus.Declined;
          user.devices[0].token = Math.random().toString(36).slice(2);
          user.dataSet = argv[3];
          await user.save();

          let isCity = getRandomNumber(0, 10) < 2 ? false : true;

          let gemeenteDef = TaskUtil.getDefinition('onboarding.gemeente');
          await TaskUtil.handleTask(user, gemeenteDef, isCity ? argv[3] : 'no');

          if (!isCity) {
            continue;
          }

          let welcomeDef = TaskUtil.getDefinition(
            argv[3] === DATA_SET_AMSTERDAM ? 'onboarding.welcome' : `onboarding.welcome-${argv[3]}`
          );
          await TaskUtil.handleTask(user, welcomeDef, getRandomNumber(0, 10) < 1 ? 'no' : 'yes');
          let dobDef = TaskUtil.getDefinition(
            argv[3] === DATA_SET_AMSTERDAM ? 'onboarding.dateOfBirth' : `onboarding.dateOfBirth-${argv[3]}`
          );
          await TaskUtil.handleTask(
            user,
            dobDef,
            moment()
              .subtract(18, 'years')
              .add(Math.floor(Math.random() * (365 * 4 - 0 + 1)) + 0, 'days')
              .format('YYYY-MM-DD')
          );

          // Complete nt next tasks in onboarding
          let numberOfTasks = getRandomNumber(0, 9);
          console.info('Completing extra', numberOfTasks, 'tasks');
          for (var tn = 0; tn <= numberOfTasks; tn++) {
            let nextTask = TaskUtil.getNextTask(user);

            if (nextTask) {
              let nextTaskDef = TaskUtil.getDefinition(nextTask.taskId);
              await TaskUtil.handleTask(user, nextTaskDef, Boolean(Math.round(Math.random())) ? 'yes' : 'no');
            }
          }

          await StatisticsUtil.registerStatistics(argv[3]);
        }

        // For the users that exists, complete random tasks
        let randomNumberOfUsers = getRandomNumber(0, (await User.countDocuments()) / 20);
        let numberOfTasks = getRandomNumber(0, 9);
        console.info(`for ${randomNumberOfUsers} users, do complete random number of tasks`);
        for (var en = 0; en <= randomNumberOfUsers; en++) {
          let N = await User.countDocuments();
          let R = Math.floor(Math.random() * N);
          let user = await User.findOne({}).limit(1).skip(R);

          for (var tn = 0; tn <= numberOfTasks; tn++) {
            let nextTask = TaskUtil.getNextTask(user);

            if (nextTask) {
              let nextTaskDef = TaskUtil.getDefinition(nextTask.taskId);
              await TaskUtil.handleTask(user, nextTaskDef, Boolean(Math.round(Math.random())) ? 'yes' : 'no');
            } else {
              // Look for a dismissed onboarding tasks and complete it
              let tasks = user.tasks.filter((t: UserTask) => t.status === TaskStatus.Dismissed);

              for (var tl in tasks) {
                let dismissedTaskDef = TaskUtil.getDefinition(tasks[tl].taskId);
                if (dismissedTaskDef.routeTaskId && getRandomNumber(0, 10) > 1) {
                  let dismissedRouteTaskDef = TaskUtil.getDefinition(dismissedTaskDef.routeTaskId);
                  await TaskUtil.handleTask(user, dismissedRouteTaskDef, 'yes');
                }
              }

              // Random route feedback
              if (user.routes.length) {
                await RouteFeedback.create({
                  dataSet: user.dataSet,
                  userId: user._id,
                  routeId: user.routes[0]?.routeId,
                  rating: getRandomNumber(1, 5),
                  feedback: faker.lorem.sentences(getRandomNumber(1, 5)),
                });
              }

              break;
            }
          }
        }
      }

      break;
  }

  console.info(`Seed done ${type}:`);
  console.info('Payload:', payload);
  console.info('Result', result);

  rl.close();
};

boot.start().then(seed);

rl.on('close', function () {
  process.exit(0);
});
