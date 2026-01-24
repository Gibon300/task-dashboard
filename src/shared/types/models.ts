export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: number;
  projectId: string;
  title: string;
  status: "todo" | "in_progress" | "done";
};


export type Project = {
  id: string;
  name: string;
  createdAt: string;
};
