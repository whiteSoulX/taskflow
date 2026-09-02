'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, AlertTriangle, Clock } from 'lucide-react';
import api from '@/lib/api';
import { getNotifications } from '@/lib/notifications';

export default function NotificationBell() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchTasks = async () => {
      try {
        const { data } = await api.get('/tasks/');
        if (!cancelled) setTasks(data.results || data);
      } catch (err) {
        // Silently ignore — the dashboard surfaces load errors already.
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 60000);
    // The dashboard fires this event on every create/update/delete/toggle
    // so the bell doesn't sit on stale data between its own 60s polls.
    window.addEventListener('tasks:changed', fetchTasks);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('tasks:changed', fetchTasks);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { overdue, dueSoon, total } = getNotifications(tasks);

  const goToDashboard = () => {
    setOpen(false);
    router.push('/dashboard');
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-30">
          <div className="px-4 py-3 border-b border-slate-800">
            <h4 className="text-white font-medium text-sm">Notifications</h4>
          </div>

          {total === 0 ? (
            <p className="text-slate-500 text-sm px-4 py-6 text-center">
              You&apos;re all caught up. No overdue or upcoming tasks.
            </p>
          ) : (
            <div className="py-1">
              {overdue.map((task) => (
                <button
                  key={`overdue-${task.id}`}
                  onClick={goToDashboard}
                  className="w-full text-left px-4 py-2.5 flex items-start gap-2.5 hover:bg-slate-800 transition"
                >
                  <AlertTriangle size={15} className="text-red-400 mt-0.5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm text-white truncate">{task.title}</span>
                    <span className="block text-xs text-red-400">
                      Overdue &middot; was due {task.due_date}
                    </span>
                  </span>
                </button>
              ))}
              {dueSoon.map((task) => (
                <button
                  key={`soon-${task.id}`}
                  onClick={goToDashboard}
                  className="w-full text-left px-4 py-2.5 flex items-start gap-2.5 hover:bg-slate-800 transition"
                >
                  <Clock size={15} className="text-amber-400 mt-0.5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm text-white truncate">{task.title}</span>
                    <span className="block text-xs text-amber-400">Due {task.due_date}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
