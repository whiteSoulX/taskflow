'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function TaskForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(
    initial || { title: '', description: '', status: 'todo', priority: 'medium', due_date: '' }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            {initial ? 'Edit Task' : 'New Task'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <input
            type="date"
            name="due_date"
            value={form.due_date || ''}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
          />
          <button
            type="submit"
            className="w-full bg-cyan-400 text-slate-900 font-medium py-2 rounded-lg hover:bg-cyan-300 transition"
          >
            Save Task
          </button>
        </form>
      </div>
    </div>
  );
}
