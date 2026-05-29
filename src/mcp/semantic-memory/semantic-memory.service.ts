import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemoryEmbeddingEntity } from '../entities/memory-embedding.entity';
import { EmbeddingService } from '../embedding/embedding.service';

@Injectable()
export class SemanticMemoryService {
    constructor(
        @InjectRepository(
            MemoryEmbeddingEntity,
        )
        private readonly embeddingRepository: Repository<MemoryEmbeddingEntity>,

        private readonly embeddingService: EmbeddingService,
    ) { }

    async storeMemory(
        sessionId: string,
        content: string,
    ) {
        const embedding =
            await this.embeddingService.generateEmbedding(
                content,
            );

        const memory =
            this.embeddingRepository.create({
                sessionId,
                content,
                embedding,
            });

        return this.embeddingRepository.save(
            memory,
        );
    }

    async searchRelevantMemories(
        sessionId: string,
        query: string,
        limit = 5,
    ) {
        const embedding =
            await this.embeddingService.generateEmbedding(
                query,
            );

        return this.embeddingRepository.query(
            `
    SELECT
      id,
      content,
      embedding <=> $1 AS distance
    FROM memory_embeddings
    WHERE "sessionId" = $2
    ORDER BY distance ASC
    LIMIT $3
    `,
            [JSON.stringify(embedding), sessionId, limit],
        );
    }
}