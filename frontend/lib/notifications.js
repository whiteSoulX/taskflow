// Shared helpers for classifying tasks by due date so the navbar bell,
// dashboard toasts, and task cards all agree on what counts as
// "overdue" vs "due soon".

const DUE_SOON_WINDOW_DAYS = 2;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDueDate(dueDate) {
  if (!dueDate) return null;
  // due_date comes back as 'YYYY-MM-DD' from the API; parse as local, not UTC.
  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function getTaskUrgency(task) {
  if (!task || task.status === 'done') return 'none';
  const due = parseDueDate(task.due_date);
  if (!due) return 'none';

  const today = startOfToday();
  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays <= DUE_SOON_WINDOW_DAYS) return 'due_soon';
  return 'none';
}

export function getNotifications(tasks) {
  const overdue = [];
  const dueSoon = [];

  for (const task of tasks || []) {
    const urgency = getTaskUrgency(task);
    if (urgency === 'overdue') overdue.push(task);
    else if (urgency === 'due_soon') dueSoon.push(task);
  }

  overdue.sort((a, b) => (a.due_date > b.due_date ? 1 : -1));
  dueSoon.sort((a, b) => (a.due_date > b.due_date ? 1 : -1));

  return { overdue, dueSoon, total: overdue.length + dueSoon.length };
}
