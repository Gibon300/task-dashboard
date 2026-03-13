import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { Project, Task } from "../shared/types/models";
import { http } from "../shared/api/http";
import { tasksApi } from "../entities/task/api/tasksApi";
import { TaskItem } from "../entities/task/ui/TaskItem";

export function ProjectDetailsPage() {
  const { id: projectId } = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tasksError, setTasksError] = useState<string | null>(null);

  const [loadingProject, setLoadingProject] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState<Task["status"]>("todo");

  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function loadProject() {
    if (!projectId) return;

    try {
      setError(null);
      setLoadingProject(true);
      const data = await http.get<Project>(`/projects/${encodeURIComponent(projectId)}`);
      setProject(data);
    } catch (e) {
      setProject(null);
      setError(e instanceof Error ? e.message : "Failed to load project");
    } finally {
      setLoadingProject(false);
    }
  }

  async function loadTasks() {
    if (!projectId) return;

    try {
      setTasksError(null);
      setLoadingTasks(true);
      const data = await tasksApi.getTasksByProject(projectId);
      setTasks(data);
    } catch (e) {
      setTasks([]);
      setTasksError(e instanceof Error ? e.message : "Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    if (!projectId) return;
    void loadProject();
    void loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function handleCreateTask() {
    if (!projectId) return;
    const title = newTitle.trim();
    if (!title) return;

    try {
      setTasksError(null);
      setCreating(true);

      const created = await tasksApi.createTask({
        projectId,
        title,
        status: newStatus,
      });

      setTasks((prev) => [created, ...prev]);
      setNewTitle("");
      setNewStatus("todo");
    } catch (e) {
      setTasksError(e instanceof Error ? e.message : "Failed to create task");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteTask(id: number) {
    try {
      setTasksError(null);
      setUpdatingId(id);

      await tasksApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setTasksError(e instanceof Error ? e.message : "Failed to delete task");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleChangeStatus(id: number, status: Task["status"]) {
    try {
      setTasksError(null);
      setUpdatingId(id);

      const updated = await tasksApi.updateStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setTasksError(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  if (!projectId) {
    return (
      <div>
        <Link to="/">← Back</Link>
        <p style={{ color: "crimson" }}>Project id is missing in URL</p>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#800080] text-slate-900">
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between">
        <Link className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" to="/">
          ← Back
        </Link>

        <button
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          onClick={loadTasks}
          disabled={loadingTasks}
        >
          Refresh
        </button>
      </div>

      {/* Header */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loadingProject && <p className="text-sm text-slate-600">Loading project...</p>}
        {error && <p className="text-sm text-red-700">{error}</p>}

        {project && (
          <>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {"createdAt" in project && (project as any).createdAt ? (
              <p className="mt-1 text-sm text-slate-500">
                Created: {(project as any).createdAt}
              </p>
            ) : null}
          </>
        )}
      </div>

      {/* Tasks */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Tasks</h2>

        {/* Create form */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title..."
          />

          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:w-44"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as any)}
          >
            <option value="todo">todo</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
          </select>

          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-36"
            onClick={handleCreateTask}
            disabled={creating || !newTitle.trim()}
          >
            {creating ? "Adding..." : "Add task"}
          </button>
        </div>

        {/* Errors / loading */}
        {tasksError && <p className="mt-3 text-sm text-red-700">{tasksError}</p>}
        {loadingTasks && <p className="mt-3 text-sm text-slate-600">Loading tasks...</p>}

        {/* List */}
        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onChangeStatus={handleChangeStatus}
              isUpdating={updatingId === task.id}
            />
          ))}
        </ul>

        {!loadingTasks && !tasksError && tasks.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-[#800080] p-4 text-sm text-slate-600">
            No tasks yet. Add the first one above 👆
          </div>
        )}
      </div>
    </div>
  </div>
);

}
