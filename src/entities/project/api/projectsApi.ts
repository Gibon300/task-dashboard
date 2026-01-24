import { http } from "../../../shared/api/http";
import type { Project } from "../../../shared/types/models";

export const projectsApi = {
  getProjects: () => http.get<Project[]>("/projects"),
  createProject: (name: string) => http.post<Project>("/projects", { name }),
  deleteProject: (id: string) => http.delete(`/projects/${encodeURIComponent(id)}`),
};
