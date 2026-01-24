import type { Task } from "../../../shared/types/models";

type Props = {
  task: Task;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, status: Task["status"]) => void;
  isUpdating?: boolean;
};

const STATUS_STYLES: Record<Task["status"], string> = {
  todo: "bg-slate-100 text-slate-700 border-slate-200",
  in_progress: "bg-amber-100 text-amber-800 border-amber-200",
  done: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function TaskItem({
  task,
  onDelete,
  onChangeStatus,
  isUpdating = false,
}: Props) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Left */}
      <div className="min-w-0">
        <div className="truncate font-medium text-slate-900">
          {task.title}
        </div>

        <span
          className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <select
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
          value={task.status}
          disabled={isUpdating}
          onChange={(e) =>
            onChangeStatus(task.id, e.target.value as Task["status"])
          }
        >
          <option value="todo">todo</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>

        <button
          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onDelete(task.id)}
          disabled={isUpdating}
          title="Delete task"
        >
          ✕
        </button>
      </div>
    </li>
  );
}
