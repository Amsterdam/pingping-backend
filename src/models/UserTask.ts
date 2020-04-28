import { TaskStatus, UserTaskResponse } from '../generated/graphql';
import { TaskDefinition } from 'global';
import TaskUtil from '../utils/TaskUtil';

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
