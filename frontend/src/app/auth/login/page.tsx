// frontend/src/app/auth/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token } = await api.login(email, password);
      localStorage.setItem('token', token);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-10 border-2 border-gray-100 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-500" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-100 mb-6">
            <span className="text-3xl font-black">L</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bienvenido de nuevo</h1>
          <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-widest">Sistema de Cumplimiento Laboral</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Corporativo</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all text-sm font-medium"
                placeholder="nombre@empresa.com.py"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white transition-all text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-gray-400 px-1">
            <label className="flex items-center gap-2 cursor-pointer hover:text-gray-600 transition-colors">
              <input type="checkbox" className="rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
              Recordarme
            </label>
            <a href="#" className="hover:text-indigo-600 transition-colors">¿Olvidaste tu contraseña?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait group"
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar al sistema'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 opacity-60">
          <ShieldCheck className="w-4 h-4" />
          Conexión segura SSL (AES-256)
        </div>
      </div>
    </div>
  );
}
