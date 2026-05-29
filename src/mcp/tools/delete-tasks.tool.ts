import { Injectable } from '@nestjs/common';
import { MCPTool } from '../interfaces/tool.interface';
import { DeleteTaskSchema } from '../schema/task.schema';
import { TaskService } from '../task/task.service';

@Injectable()
export class DeleteTaskTool implements MCPTool {

    constructor(
        private readonly taskService: TaskService,
    ) { }
  name = 'delete_task';

  description = 'Delete a workspace task';

  schema = DeleteTaskSchema;

  inputSchema = {
    type: 'object',
    properties: {
      taskId: {
        type: 'string',
      },
    },
    required: ['taskId'],
  };

  jsonSchema = {
    type: 'object',
    properties: {
      taskId: {
        type: 'string',
        description: 'Task ID to delete',
      },
    },
    required: ['taskId'],
  };

  async execute(input: any): Promise<any> {
    return {
      success: true,
      message: this.taskService.deleteTask(input.taskId),
    };
  }
}