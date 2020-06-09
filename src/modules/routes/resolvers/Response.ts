import { UserTask } from 'models/UserTask';
import TaskUtil from 'utils/TaskUtil';
import { TaskDefinition, RouteDefinition } from 'types/global';
import { UserRoute } from 'models/UserRoute';
import { TaskStatus } from '@models';
import InitialDataUtil from 'utils/InitialDataUtil';

export const UserTaskResponse: any = {
  status: (doc: UserTask) => doc.status,
  answer: (doc: UserTask) => doc.answer,
  task: (doc: UserTask) => TaskUtil.getDefinition(doc.taskId),
};

export const TaskResponse: any = {
  taskId: (doc: TaskDefinition) => doc.id,
  title: (doc: TaskDefinition) => doc.title,
  description: (doc: TaskDefinition) => doc.description,
  media: (doc: TaskDefinition) => doc.media,
  choices: (doc: TaskDefinition) => doc.choices,
  type: (doc: TaskDefinition) => doc.type,
  progressPercentile: (doc: TaskDefinition) => 0,
};

export const RouteResponse: any = {
  routeId: (doc: RouteDefinition) => doc.id,
  title: (doc: RouteDefinition) => doc.title,
  description: (doc: RouteDefinition) => doc.description,
  imageUrl: (doc: RouteDefinition) => doc.imageUrl,
};

export const UserRouteResponse: any = {
  status: (doc: UserRoute) => doc.status,
  progress: (doc: UserRoute) => doc.progress,
  tasks: (doc: UserRoute) => {
    return doc.tasks.map((task: UserTask) => {
      let status = TaskStatus.PendingUser;
      let answer = null;

      return {
        status,
        answer,
        taskId: task.taskId,
      };
    });
  },

  //   // Look for completed tasks
  //   const taskFoundIndex = doc.map((t:UserTask) => t.taskId).indexOf(taskDef.id)
  //   const onboardingTaskFoundIndex = user.tasks.map(t => InitialDataUtil.getTaskById(t.taskId)).map(t => t.routeTaskId).indexOf(`${doc.routeId}.${taskDef.id}`)

  //   if (taskFoundIndex !== -1) {
  //     status = _.get(doc, `${taskFoundIndex}.status`, TaskStatus.PendingUser)
  //     answer = _.get(doc, `${taskFoundIndex}.answer`)
  //   } else if (onboardingTaskFoundIndex !== -1) {
  //     status = _.get(user.tasks, `${onboardingTaskFoundIndex}.status`) === TaskStatus.Dismissed ? TaskStatus.PendingUser : TaskStatus.Completed
  //     answer = _.get(user.tasks, `${onboardingTaskFoundIndex}.answer`)
  //   }
  // })
  // }
};

route: RouteResponse!;
tasks: [UserTaskResponse];
