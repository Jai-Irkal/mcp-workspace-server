import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('memory_embeddings')
export class MemoryEmbeddingEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'text',
    })
    content!: string;

    @Column({
        type: 'vector',
        length: 3072,
    })
    embedding!: number[];

    @Column()
    sessionId!: string;

    @CreateDateColumn()
    createdAt!: Date;
}