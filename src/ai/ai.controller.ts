import { Body, Controller, Post } from '@nestjs/common';

import { AIOrchestratorService } from './ai-orchestrator.service';

@Controller('ai')
export class AIController {
  constructor(
    private readonly aiOrchestrator: AIOrchestratorService,
  ) {}

  @Post('chat')
  async chat(@Body() body: { sessionId: string, prompt: string }) {
    return this.aiOrchestrator.chat(body.sessionId, body.prompt);
  }
}