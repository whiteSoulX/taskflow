'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import StatsCard from '@/components/StatsCard';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import api from '@/lib/api';
import { Plus } from 'lucide-react';

function DashboardContent() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks/');
      setTasks(data.results || data);
    } catch (err) {
      toast.error('Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
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

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

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

        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatsCard label="Total Tasks" value={stats.total} accent="text-white" />
          <StatsCard label="In Progress" value={stats.inProgress} accent="text-amber-400" />
          <StatsCard label="Completed" value={stats.done} accent="text-emerald-400" />
        </div>

        {loading ? (
          <p className="text-slate-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No tasks yet — create your first one.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setEditingTask(t);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
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
