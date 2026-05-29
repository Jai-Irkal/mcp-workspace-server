import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../entities/conversation.entity';
import { MessageEntity } from '../entities/message.entity';

@Injectable()
export class MemoryService {
    constructor(
        @InjectRepository(
            ConversationEntity,
        )
        private readonly conversationRepository: Repository<ConversationEntity>,

        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
    ) { }

    async getOrCreateConversation(
        sessionId: string,
    ) {
        let conversation =
            await this.conversationRepository.findOne({
                where: {
                    sessionId,
                },

                relations: ['messages'],
            });

        if (!conversation) {
            conversation =
                this.conversationRepository.create({
                    sessionId,
                });

            conversation =
                await this.conversationRepository.save(
                    conversation,
                );
        }

        return conversation;
    }

    async addMessage(
        sessionId: string,
        role: string,
        content: string,
    ) {
        const conversation =
            await this.getOrCreateConversation(
                sessionId,
            );

        const message =
            this.messageRepository.create({
                role,
                content,
                conversation,
            });

        return this.messageRepository.save(
            message,
        );
    }

    async getConversationHistory(
        sessionId: string,
    ) {
        const conversation =
            await this.conversationRepository.findOne({
                where: {
                    sessionId,
                },

                relations: ['messages'],
            });

        if (!conversation) {
            return [];
        }

        return conversation.messages.sort(
            (a, b) =>
                a.createdAt.getTime() -
                b.createdAt.getTime(),
        );
    }
}