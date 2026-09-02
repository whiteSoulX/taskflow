import { Pencil, Trash2, AlertTriangle, Clock, CheckCircle2, Circle } from 'lucide-react';
import { getTaskUrgency } from '@/lib/notifications';

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

const urgencyBorder = {
  overdue: 'border-red-500/60',
  due_soon: 'border-amber-400/60',
  none: 'border-slate-800',
};

export default function TaskCard({ task, onEdit, onDelete, onToggleDone, draggable = false }) {
  const urgency = getTaskUrgency(task);
  const isDone = task.status === 'done';

  return (
    <div
      draggable={draggable}
      onDragStart={
        draggable
          ? (e) => {
              e.dataTransfer.setData('text/plain', String(task.id));
              e.dataTransfer.effectAllowed = 'move';
            }
          : undefined
      }
      className={`bg-slate-900 border rounded-xl p-4 flex flex-col gap-2 transition ${
        urgencyBorder[urgency]
      } ${draggable ? 'cursor-grab active:cursor-grabbing hover:border-slate-700' : ''}`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <button
            onClick={() => onToggleDone(task)}
            className="mt-0.5 text-slate-500 hover:text-emerald-400 transition shrink-0"
            title={isDone ? 'Mark as not done' : 'Mark as done'}
          >
            {isDone ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <Circle size={18} />
            )}
          </button>
          <h4 className={`font-medium truncate ${isDone ? 'text-slate-500 line-through' : 'text-white'}`}>
            {task.title}
          </h4>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {task.description && (
        <p className="text-slate-400 text-sm line-clamp-2">{task.description}</p>
      )}

      {urgency !== 'none' && (
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            urgency === 'overdue' ? 'text-red-400' : 'text-amber-400'
          }`}
        >
          {urgency === 'overdue' ? <AlertTriangle size={13} /> : <Clock size={13} />}
          {urgency === 'overdue' ? 'Overdue' : 'Due soon'}
        </div>
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
