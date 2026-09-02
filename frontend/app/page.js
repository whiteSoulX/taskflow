import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CheckCircle2, Rocket, ShieldCheck, LayoutDashboard, BellRing } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block bg-slate-800 text-cyan-400 text-xs font-medium px-3 py-1 rounded-full mb-4">
            Next.js · React · Django REST · JWT Auth
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Full-Stack Task Management,{' '}
            <span className="text-cyan-400">Built to Ship</span>
          </h1>
          <p className="text-slate-400 mt-4">
            A production-ready portfolio app demonstrating a Next.js frontend, a Django
            REST Framework API, JWT authentication, and a real database — the same stack
            used to deliver client web applications.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link
              href="/register"
              className="bg-cyan-400 text-slate-900 font-medium px-6 py-3 rounded-lg hover:bg-cyan-300 transition"
            >
              Try the Demo
            </Link>
            <Link
              href="/login"
              className="border border-slate-700 text-slate-200 px-6 py-3 rounded-lg hover:border-cyan-400 transition"
            >
              Log In
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <Feature
            icon={<ShieldCheck className="text-cyan-400" />}
            title="JWT Authentication"
            text="Secure register/login flow with access + refresh tokens handled end-to-end."
          />
          <Feature
            icon={<LayoutDashboard className="text-cyan-400" />}
            title="Kanban & Grid Views"
            text="Drag and drop tasks between To Do, In Progress, and Done, or work from a filterable grid."
          />
          <Feature
            icon={<BellRing className="text-cyan-400" />}
            title="Deadline Reminders"
            text="A live notification bell and dashboard alerts flag overdue and due-soon tasks automatically."
          />
          <Feature
            icon={<Rocket className="text-cyan-400" />}
            title="Deployment Ready"
            text="Configured for Vercel (frontend) and Docker / Render / Railway (backend)."
          />
        </div>

        <div className="mt-20 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-white font-semibold text-lg mb-4">What this demonstrates</h2>
          <ul className="grid md:grid-cols-2 gap-3 text-slate-300 text-sm">
            {[
              'Responsive Next.js UI with Tailwind CSS',
              'Django REST Framework CRUD API with search, filtering & sorting',
              'PostgreSQL-ready database layer',
              'JWT auth with automatic token refresh',
              'Drag-and-drop kanban board with per-user data isolation',
              'Deadline notifications and Docker + Vercel deployment config',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="mb-3">{icon}</div>
      <h3 className="text-white font-medium mb-1">{title}</h3>
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  );
}
