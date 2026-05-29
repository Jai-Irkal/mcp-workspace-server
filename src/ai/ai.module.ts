import { forwardRef, Module } from '@nestjs/common';
import { AIOrchestratorService } from './ai-orchestrator.service';
import { AIController } from './ai.controller';
import { GeminiService } from './gemini.service';
import { McpModule } from 'src/mcp/mcp.module';

@Module({
  imports: [forwardRef(() => McpModule)],
  providers: [AIOrchestratorService, GeminiService],
  controllers: [AIController],
  exports: [GeminiService],
})
export class AiModule {}
