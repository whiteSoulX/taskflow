'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { register, login } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.password2);
      await login(form.username, form.password);
      toast.success('Account created!');
      router.push('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data
          ? Object.values(err.response.data).flat().join(' ')
          : 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold text-white mb-6">Create your account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.password2}
            onChange={(e) => setForm({ ...form, password2: e.target.value })}
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 text-slate-900 font-medium py-3 rounded-lg hover:bg-cyan-300 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-slate-400 text-sm mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Log In
          </Link>
        </p>
      </main>
    </>
  );
}
