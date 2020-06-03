import TaskUtil from '../utils/TaskUtil';
import { TaskStatus, UserTaskResponse } from '@models';
import { TaskDefinition } from '../types/global';

export class UserTask {
  taskId: string
  answer: string
  status: TaskStatus
  task: TaskDefinition

  constructor(taskId:string, status:TaskStatus, answer:string = null) {
    this.taskId = taskId;
    this.status = status;
    this.answer = answer
  }

  toResponse ():UserTaskResponse {
    return {
      ...TaskUtil.getDefinition(this.taskId),
      taskId: this.taskId,
      status: this.status,
      answer: this.answer
    }
  }
}
