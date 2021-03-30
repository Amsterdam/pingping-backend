#!/usr/bin/env ts-node
import boot from '../boot';
import sinon from 'sinon';
import moment from 'moment';
import { argv } from 'process';
import readline from 'readline';
import UserUtil from 'utils/UserUtil';
import { User } from 'models/User';
import { UserTask } from 'models/UserTask';
import TaskUtil from 'utils/TaskUtil';
import { NotificationStatus, TaskStatus } from '@models';
import StatisticsUtil from 'utils/StatisticsUtil';

const START_DATE = '2021-01-04';
const NUMBER_OF_DAYS = 83;
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
  if (process.env.NODE_ENV !== 'development') {
    console.error(`This command can only be run during development, currrent ${process.env.NODE_ENV}`);
    process.exit(1);
  }
  const type = argv[2];

  let payload, result;

  switch (type) {
    case 'mock-data':
      let startDate = moment(START_DATE);
      // Moch PingPing Start Date
      sinon.useFakeTimers(startDate.toDate());

      for (var d = 0; d <= NUMBER_OF_DAYS; d++) {
        let numberOfUsersToday = getRandomNumber(MAX_USERS_PER_DAY, MIN_USERS_PER_DAY);
        sinon.useFakeTimers(startDate.add(1, 'days').toDate());

        console.log('Today is', moment().toDate(), 'creating', numberOfUsersToday, 'users');

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
          await user.save();

          let isAmsterdam = getRandomNumber(0, 10) < 2 ? false : true;

          let gemeenteDef = TaskUtil.getDefinition('onboarding.gemeente');
          await TaskUtil.handleTask(user, gemeenteDef, isAmsterdam ? 'yes' : 'no');

          if (!isAmsterdam) {
            continue;
          }

          let welcomeDef = TaskUtil.getDefinition('onboarding.welcome');
          await TaskUtil.handleTask(user, welcomeDef, getRandomNumber(0, 10) < 1 ? 'no' : 'yes');
          let dobDef = TaskUtil.getDefinition('onboarding.dateOfBirth');
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
          console.log('Completing extra', numberOfTasks, 'tasks');
          for (var tn = 0; tn <= numberOfTasks; tn++) {
            let nextTask = TaskUtil.getNextTask(user);

            if (nextTask) {
              let nextTaskDef = TaskUtil.getDefinition(nextTask.taskId);
              await TaskUtil.handleTask(user, nextTaskDef, Boolean(Math.round(Math.random())) ? 'yes' : 'no');
            }
          }

          await StatisticsUtil.registerStatistics();
        }

        // For the users that exists, complete random tasks
        let randomNumberOfUsers = getRandomNumber(0, (await User.countDocuments()) / 20);
        let numberOfTasks = getRandomNumber(0, 9);
        console.log(`for ${randomNumberOfUsers} users, do complete random number of tasks`);
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
              let tasks = user.tasks.filter((t) => t.status === TaskStatus.Dismissed);

              for (var tl in tasks) {
                let dismissedTaskDef = TaskUtil.getDefinition(tasks[tl].taskId);
                if (dismissedTaskDef.routeTaskId && getRandomNumber(0, 10) > 1) {
                  let dismissedRouteTaskDef = TaskUtil.getDefinition(dismissedTaskDef.routeTaskId);
                  await TaskUtil.handleTask(user, dismissedRouteTaskDef, 'yes');
                }
              }
              break;
            }
          }
        }
      }

      break;
  }

  console.log(`Seed done ${type}:`);
  console.log('Paylaod:', payload);
  console.log('Result', result);

  rl.close();
};

boot.start().then(seed);

rl.on('close', function () {
  process.exit(0);
});
