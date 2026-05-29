import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';

import { ConversationEntity } from './conversation.entity';

@Entity('messages')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    role!: string;

    @Column({
        type: 'text',
    })
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(
        () => ConversationEntity,
        (conversation) => conversation.messages,
        {
            onDelete: 'CASCADE',
        }
    )
    conversation!: ConversationEntity;
}