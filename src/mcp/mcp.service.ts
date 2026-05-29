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
  ) {}

  onModuleInit() {
    this.registerTools();
  }

  private registerTools() {
    this.toolRegistry.register(
      new CreateTaskTool(),
    );

    this.toolRegistry.register(
      new ListTasksTool(),
    );

    this.toolRegistry.register(
      new DeleteTaskTool(),
    );
  }

  getTools() {
    return this.toolRegistry.listTools();
  }

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