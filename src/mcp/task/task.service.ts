import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TaskEntity } from '../entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getTasks() {
    return this.taskRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async createTask(title: string) {
    const task =
      this.taskRepository.create({
        title,
      });

    return this.taskRepository.save(
      task,
    );
  }

  async deleteTask(taskId: number) {
    const result =
      await this.taskRepository.delete(
        taskId,
      );

    return {
      deleted:
        result.affected !== 0,
    };
  }
}