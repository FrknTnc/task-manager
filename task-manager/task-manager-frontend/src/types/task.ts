/**
 * @file task.ts
 * @description Görev ve görev logları ile ilgili tip ve arayüz tanımlarını içerir.
 * @module types/task
 */

import { User } from "./user";

export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  project: string; 
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskLog {
  _id: string;
  taskId: string;
  previousData: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedTo: string | null;
  };
  changedAt: string;
  changedBy: User;
}
