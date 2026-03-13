import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectsApi } from "../entities/project/api/projectsApi";
import type { Project } from "../shared/types/models";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);


  useEffect(() => {
    projectsApi
      .getProjects()
      .then(setProjects)
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
  return (
    <div className="min-h-screen bg-[#800080] p-6 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          Loading...
        </div>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen bg-[#800080] p-6 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-red-200 bg-white p-6 text-red-700 shadow-sm">
          {error}
        </div>
      </div>
    </div>
  );
}

  async function handleCreateProject() {
  const name = newName.trim();
  if (!name) return;

  try {
    setCreating(true);
    const created = await projectsApi.createProject(name);
    setProjects((prev) => [...prev, created]);
    setNewName("");
  } finally {
    setCreating(false);
  }
}

async function handleDeleteProject(id: string) {
  const ok = window.confirm("Delete this project (and all its tasks)?");
  if (!ok) return;

  try {
    await projectsApi.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  } catch {
    setError("Failed to delete project");
  }
}


  return (
  <div className="min-h-screen bg-[#800080] text-slate-900">
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Project name..."
        />

        <button
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleCreateProject}
          disabled={creating || !newName.trim()}
        >
          {creating ? "Adding..." : "Add project"}
        </button>
      </div>

      <ul className="mt-6 space-y-2">
        {projects.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="min-w-0">
              <div className="truncate text-base font-semibold">{p.name}</div>
              {"createdAt" in p && (p as any).createdAt ? (
                <div className="mt-1 text-xs text-slate-500">
                  {(p as any).createdAt}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <Link
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                to={`/projects/${p.id}`}
              >
                Open →
              </Link>

              <button
                className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                onClick={() => handleDeleteProject(p.id)}
                title="Delete project"
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!loading && !error && projects.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
          No projects yet. Create your first one above 👆
        </div>
      )}
    </div>
  </div>
);

}
