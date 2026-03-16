import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { login } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans flex flex-col">
      <nav className="h-16 px-8 flex items-center border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">NovaCRM</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-16 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[150px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-[#151921]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome back</h1>
              <p className="text-slate-400 text-sm">Enter your credentials to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                {loading ? 'Signing in...' : <><span>Sign in to Dashboard</span><ArrowRight className="w-4 h-4" /></>}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </main>

      <footer className="py-6 px-8 border-t border-white/5 flex items-center justify-between">
        <p className="text-xs text-slate-600">© 2024 NovaCRM Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
