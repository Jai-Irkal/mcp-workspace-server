import { forwardRef, Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { ToolRegistry } from './registry/tool.registry';
// import { AiModule } from 'src/ai/ai.module';
import { TaskService } from './task/task.service';
import { DeleteTaskTool } from './tools/delete-tasks.tool';
import { ListTasksTool } from './tools/list-tasks.tool';
import { CreateTaskTool } from './tools/create-task.tool';
import { TaskEntity } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';
import { MemoryService } from './memory/memory.service';
import { MemoryEmbeddingEntity } from './entities/memory-embedding.entity';
import { EmbeddingService } from './embedding/embedding.service';
import { SemanticMemoryService } from './semantic-memory/semantic-memory.service';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      ConversationEntity,
      MessageEntity,
      MemoryEmbeddingEntity
    ]),
    forwardRef(() => AiModule)
  ],
  controllers: [McpController],
  providers: [
    McpService,
    ToolRegistry,
    TaskService,
    CreateTaskTool,
    ListTasksTool,
    DeleteTaskTool,
    MemoryService,
    EmbeddingService,
    SemanticMemoryService,
  ],
  exports: [
    McpService, 
    ToolRegistry,
    MemoryService,
    SemanticMemoryService,
  ],
})
export class McpModule { }
