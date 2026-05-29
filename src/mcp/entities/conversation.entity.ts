import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';

import { MessageEntity } from './message.entity';

@Entity('conversations')
export class ConversationEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        unique: true,
    })
    sessionId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({
        type: 'text',
        nullable: true,
    })
    summary!: string;

    @OneToMany(
        () => MessageEntity,
        (message) => message.conversation
    )
    messages!: MessageEntity[];
}