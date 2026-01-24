import { http } from "../../../shared/api/http";
import type { Task } from "../../../shared/types/models";

export const tasksApi = {
  getTasksByProject: (projectId: string) =>
    http.get<Task[]>(`/tasks?projectId=${encodeURIComponent(projectId)}`),

  createTask: (input: { projectId: string; title: string; status?: Task["status"] }) =>
    http.post<Task>("/tasks", {
      projectId: input.projectId,
      title: input.title,
      status: input.status ?? "todo",
    }),

  deleteTask: (id: number) => http.delete(`/tasks/${id}`),

  updateStatus: (id: number, status: Task["status"]) =>
    http.patch<Task>(`/tasks/${id}`, { status }),
};
