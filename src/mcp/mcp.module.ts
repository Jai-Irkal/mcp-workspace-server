import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { ToolRegistry } from './registry/tool.registry';
// import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [],
  controllers: [McpController],
  providers: [McpService, ToolRegistry],
  exports: [McpService, ToolRegistry],
})
export class McpModule {}
