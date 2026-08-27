import { Pencil, Trash2 } from 'lucide-react';

const statusColors = {
  todo: 'bg-slate-700 text-slate-200',
  in_progress: 'bg-amber-400/20 text-amber-300',
  done: 'bg-emerald-400/20 text-emerald-300',
};

const priorityColors = {
  low: 'text-slate-400',
  medium: 'text-cyan-400',
  high: 'text-red-400',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-white">{task.title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      {task.description && (
        <p className="text-slate-400 text-sm line-clamp-2">{task.description}</p>
      )}
      <div className="flex justify-between items-center mt-2 text-xs">
        <span className={priorityColors[task.priority]}>{task.priority} priority</span>
        {task.due_date && <span className="text-slate-500">Due {task.due_date}</span>}
      </div>
      <div className="flex gap-3 mt-2 border-t border-slate-800 pt-2">
        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400"
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
