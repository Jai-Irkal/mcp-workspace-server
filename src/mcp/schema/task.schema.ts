import { z } from 'zod';

// Define Zod schemas for task-related operations
export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(100),
});

export type CreateTaskInput = z.infer<
  typeof CreateTaskSchema
>;

export const DeleteTaskSchema = z.object({
  taskId: z
    .number()
    .positive(),
});

export type DeleteTaskInput = z.infer<
  typeof DeleteTaskSchema
>;

export const ListTasksSchema = z.object({});

export type ListTasksInput = z.infer<
  typeof ListTasksSchema
>;