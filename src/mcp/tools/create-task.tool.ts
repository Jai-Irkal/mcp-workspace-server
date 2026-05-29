import { Injectable } from '@nestjs/common';
import { MCPTool } from '../interfaces/tool.interface';
import { CreateTaskInput, CreateTaskSchema } from '../schema/task.schema';
import { TaskService } from '../task/task.service';

@Injectable()
export class CreateTaskTool implements MCPTool {

    constructor(
        private readonly taskService: TaskService,
    ) { }
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

    async execute(input: CreateTaskInput) {
        const task =
            await this.taskService.createTask(
                input.title,
            );
            
        return {
            success: true,
            task,
        };
    }
}