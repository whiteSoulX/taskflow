'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import StatsCard from '@/components/StatsCard';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import api from '@/lib/api';
import { getNotifications } from '@/lib/notifications';
import { Plus, Search, AlertTriangle } from 'lucide-react';

function DashboardContent() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('-created_at');

  const fetchTasks = async ({ notify } = {}) => {
    try {
      const { data } = await api.get('/tasks/');
      const list = data.results || data;
      setTasks(list);
      window.dispatchEvent(new CustomEvent('tasks:changed'));

      if (notify) {
        const { overdue, dueSoon } = getNotifications(list);
        if (overdue.length > 0) {
          toast.error(
            `${overdue.length} task${overdue.length > 1 ? 's are' : ' is'} overdue!`,
            { icon: '⚠️', duration: 5000 }
          );
        } else if (dueSoon.length > 0) {
          toast(
            `${dueSoon.length} task${dueSoon.length > 1 ? 's' : ''} due soon.`,
            { icon: '⏰' }
          );
        }
      }
    } catch (err) {
      toast.error('Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks({ notify: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (form) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}/`, form);
        toast.success('Task updated');
      } else {
        await api.post('/tasks/', form);
        toast.success('Task created');
      }
      setShowForm(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error('Could not save task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}/`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error('Could not delete task');
    }
  };

  const handleToggleDone = async (task) => {
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      await api.put(`/tasks/${task.id}/`, { ...task, status: nextStatus });
      toast.success(nextStatus === 'done' ? 'Task completed 🎉' : 'Task reopened');
      fetchTasks();
    } catch (err) {
      toast.error('Could not update task');
    }
  };

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  const { overdue, dueSoon } = getNotifications(tasks);

  const visibleTasks = useMemo(() => {
    let list = [...tasks];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }
    if (statusFilter) list = list.filter((t) => t.status === statusFilter);
    if (priorityFilter) list = list.filter((t) => t.priority === priorityFilter);

    const priorityRank = { low: 0, medium: 1, high: 2 };
    list.sort((a, b) => {
      switch (sortBy) {
        case 'due_date':
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return a.due_date.localeCompare(b.due_date);
        case 'priority':
          return priorityRank[b.priority] - priorityRank[a.priority];
        default:
          return 0;
      }
    });

    return list;
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Tasks</h1>
            <p className="text-slate-400 text-sm">Manage everything from one dashboard</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-cyan-400 text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-cyan-300 transition"
          >
            <Plus size={18} /> New Task
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatsCard label="Total Tasks" value={stats.total} accent="text-white" />
          <StatsCard label="In Progress" value={stats.inProgress} accent="text-amber-400" />
          <StatsCard label="Completed" value={stats.done} accent="text-emerald-400" />
        </div>

        {(overdue.length > 0 || dueSoon.length > 0) && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-300">
            <AlertTriangle size={16} className="shrink-0" />
            <span>
              {overdue.length > 0 && (
                <>
                  {overdue.length} task{overdue.length > 1 ? 's' : ''} overdue
                  {dueSoon.length > 0 ? ', ' : '.'}
                </>
              )}
              {dueSoon.length > 0 && (
                <>{dueSoon.length} due within 2 days.</>
              )}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="">All statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="-created_at">Newest first</option>
            <option value="due_date">Due date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No tasks yet — create your first one.
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No tasks match your filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setEditingTask(t);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                onToggleDone={handleToggleDone}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <TaskForm
          initial={editingTask}
          onSubmit={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
