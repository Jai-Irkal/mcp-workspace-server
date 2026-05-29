import { MCPTool } from '../interfaces/tool.interface';
import { CreateTaskSchema } from '../schema/task.schema';

export class CreateTaskTool implements MCPTool {
  name = 'create_task';

  description = 'Create a workspace task';

  inputSchema = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
    },
    required: ['title'],
  };

  schema = CreateTaskSchema;

  jsonSchema = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Task title',
      },
    },
    required: ['title'],
  };

  async execute(input: any): Promise<any> {
    return {
      success: true,
      task: {
        id: Date.now(),
        title: input.title,
      },
    };
  }
}