import { ZodType } from 'zod';
import { $ZodTypeInternals } from 'zod/v4/core';
import { MCPTool } from '../interfaces/tool.interface';
import { ListTasksSchema } from '../schema/task.schema';

export class ListTasksTool implements MCPTool {
    name = 'list_tasks';

    description = 'List all workspace tasks';

    schema = ListTasksSchema;

    inputSchema = null;

    jsonSchema= null;

    async execute(): Promise<any> {
        return {
            success: true,
            tasks: [
                {
                    id: 1,
                    title: "Meeting with team",
                },
                {
                    id: 2,
                    title: "Code review",
                },
                {
                    id: 3,
                    title: "Write documentation",
                },
                {
                    id: 4,
                    title: "Update dependencies",
                },
                {
                    id: 5,
                    title: "Plan next sprint",
                },
                {
                    id: 6,
                    title: "Fix bugs",
                },
            ],
        };
    }
}