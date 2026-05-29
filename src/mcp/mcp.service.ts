import {
    Injectable,
    OnModuleInit,
} from '@nestjs/common';

import { ToolRegistry } from './registry/tool.registry';

import { CreateTaskTool } from './tools/create-task.tool';
import { ListTasksTool } from './tools/list-tasks.tool';
import { DeleteTaskTool } from './tools/delete-tasks.tool';

@Injectable()
export class McpService implements OnModuleInit {
    constructor(
        private readonly toolRegistry: ToolRegistry,

        private readonly createTaskTool: CreateTaskTool,

        private readonly listTasksTool: ListTasksTool,

        private readonly deleteTaskTool: DeleteTaskTool,
    ) { }

    // On module initialization, register all available tools with the tool registry
    onModuleInit() {
        this.registerTools();
    }

    private registerTools() {
        this.toolRegistry.register(
            this.createTaskTool,
        );

        this.toolRegistry.register(
            this.listTasksTool,
        );

        this.toolRegistry.register(
            this.deleteTaskTool,
        );
    }

    // Get a list of all registered tools
    getTools() {
        return this.toolRegistry.listTools();
    }

    // Execute a tool by name with the provided input
    async executeTool(
        name: string,
        input: any,
    ) {
        return this.toolRegistry.executeTool(
            name,
            input,
        );
    }
}