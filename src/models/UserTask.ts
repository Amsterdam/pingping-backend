import { TaskStatus } from '@models';
import { TaskDefinition } from '../types/global';

export class UserTask {
  taskId: string;
  answer: string;
  status: TaskStatus;
  task: TaskDefinition;

  constructor(taskId: string, status: TaskStatus, answer: string = null) {
    this.taskId = taskId;
    this.status = status;
    this.answer = answer;
  }
}
