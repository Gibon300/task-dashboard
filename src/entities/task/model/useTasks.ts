import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "../api/tasksApi";

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => tasksApi.getTasksByProject(projectId),
    enabled: Boolean(projectId),
  });
}
