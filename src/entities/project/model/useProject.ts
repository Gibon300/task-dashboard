import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projectsApi";

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getProject(projectId),
    enabled: Boolean(projectId),
  });
}
