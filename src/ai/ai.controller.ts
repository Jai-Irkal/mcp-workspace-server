import { Body, Controller, Post } from '@nestjs/common';

import { AIOrchestratorService } from './ai-orchestrator.service';

@Controller('ai')
export class AIController {
  constructor(
    private readonly aiOrchestrator: AIOrchestratorService,
  ) {}

  @Post('chat')
  async chat(@Body() body: { prompt: string }) {
    return this.aiOrchestrator.chat(body.prompt);
  }
}