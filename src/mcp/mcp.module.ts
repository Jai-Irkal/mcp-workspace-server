import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { ToolRegistry } from './registry/tool.registry';
// import { AiModule } from 'src/ai/ai.module';
import { TaskService } from './task/task.service';
import { DeleteTaskTool } from './tools/delete-tasks.tool';
import { ListTasksTool } from './tools/list-tasks.tool';
import { CreateTaskTool } from './tools/create-task.tool';

@Module({
  imports: [],
  controllers: [McpController],
  providers: [
    McpService,
    ToolRegistry,
    TaskService,
    CreateTaskTool,
    ListTasksTool,
    DeleteTaskTool,
  ],
  exports: [McpService, ToolRegistry],
})
export class McpModule { }
