import { Injectable } from '@nestjs/common';

import { GeminiService } from 'src/ai/gemini.service';

@Injectable()
export class EmbeddingService {
  constructor(
    private readonly geminiService: GeminiService,
  ) {}

  async generateEmbedding(
    text: string,
  ) {
    const ai =
      this.geminiService.getClient();

    const response =
      await ai.models.embedContent({
        model: 'gemini-embedding-001',

        contents: text,
      });

    return response.embeddings?.[0]
      ?.values;
  }
}