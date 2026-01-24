import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasksApi";

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: (created) => {
      // после успешного создания просто обновляем список задач проекта
      qc.invalidateQueries({ queryKey: ["tasks", created.projectId] });
    },
  });
}
