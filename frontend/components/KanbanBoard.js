'use client';

import { useState } from 'react';
import TaskCard from './TaskCard';

const COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

export default function KanbanBoard({ tasks, onEdit, onDelete, onToggleDone, onStatusChange }) {
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDrop = (e, status) => {
    e.preventDefault();
    setDragOverCol(null);
    const id = e.dataTransfer.getData('text/plain');
    const task = tasks.find((t) => String(t.id) === id);
    if (task && task.status !== status) {
      onStatusChange(task, status);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 items-start">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        const isOver = dragOverCol === col.key;

        return (
          <div
            key={col.key}
            data-column={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverCol(col.key);
            }}
            onDragLeave={() => setDragOverCol((cur) => (cur === col.key ? null : cur))}
            onDrop={(e) => handleDrop(e, col.key)}
            className={`bg-slate-950/40 border rounded-xl p-3 min-h-[160px] transition-colors ${
              isOver ? 'border-cyan-400/60 bg-slate-900/60' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-slate-300">{col.label}</h3>
              <span className="text-xs text-slate-500 bg-slate-800 rounded-full px-2 py-0.5">
                {colTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {colTasks.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-8 border border-dashed border-slate-800 rounded-lg">
                  Drop a task here
                </p>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleDone={onToggleDone}
                    draggable
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
