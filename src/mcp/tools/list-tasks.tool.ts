import { ZodType } from 'zod';
import { $ZodTypeInternals } from 'zod/v4/core';
import { MCPTool } from '../interfaces/tool.interface';
import { ListTasksSchema } from '../schema/task.schema';
import { Injectable } from '@nestjs/common';
import { TaskService } from '../task/task.service';

@Injectable()
export class ListTasksTool implements MCPTool {

    constructor(
        private readonly taskService: TaskService,
    ) { }

    name = 'list_tasks';

    description = 'List all workspace tasks';

    schema = ListTasksSchema;

    inputSchema = null;

    jsonSchema= null;

    async execute(): Promise<any> {
        return {
            success: true,
            tasks: this.taskService.getTasks(),
        };
    }
}