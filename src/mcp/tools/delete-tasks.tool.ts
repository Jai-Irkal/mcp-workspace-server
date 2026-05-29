import { MCPTool } from '../interfaces/tool.interface';
import { DeleteTaskSchema } from '../schema/task.schema';

export class DeleteTaskTool implements MCPTool {
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
      message: `Task with ID ${input.taskId} has been deleted`,
      task: {
        id: input.taskId,
        title: input.title,
      },
    };
  }
}