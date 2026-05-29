import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
    private tasks = [
        {
            id: 1,
            title: 'Meeting with team',
        },
        {
            id: 2,
            title: 'Code review',
        },
    ];

    getTasks() {
        return this.tasks;
    }

    createTask(title: string) {
        const task = {
            id: Date.now(),
            title,
        };

        this.tasks.push(task);

        return task;
    }

    deleteTask(taskId: number) {
        const initialLength =
            this.tasks.length;

        this.tasks = this.tasks.filter(
            (task) => task.id !== taskId,
        );

        return {
            deleted:
                this.tasks.length !==
                initialLength,
        };
    }
}