import { supabase } from "../supabaseClient";
import { useState } from 'react';
import { Library, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store';
import { Button } from '../components/UI/Button';
import { cn } from '../utils/cn';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || 'Login failed');
        }
      } else {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        const result = await register(name, email, password);
        if (!result.success) {
          setError(result.error || 'Registration failed');
        } else {
          setIsLogin(true);
          setError('');
          alert('Registration successful! Please check your email to confirm your account, then login.');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Test Admin', email: 'test@admin.com', password: 'test123', color: 'from-purple-500 to-pink-600' },
    { role: 'Admin', email: 'admin@library.com', password: 'admin123', color: 'from-red-500 to-rose-600' },
    { role: 'Librarian', email: 'librarian@library.com', password: 'librarian123', color: 'from-amber-500 to-orange-600' },
    { role: 'User', email: 'sumit@student.com', password: 'user123', color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl shadow-indigo-500/30">
              <Library className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">LibraryOS</h1>
              <p className="text-indigo-200">Cloud-Native Platform</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Library Resource Orchestration System
          </h2>
          <p className="text-lg text-indigo-200 mb-8 max-w-md">
            A modern cloud-native solution for managing physical and digital library resources with role-based access control.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Cloud-Native Architecture</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Role-Based Access Control</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Digital Resource Management</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Real-time Availability Tracking</span>
            </div>
          </div>

          <div className="mt-12 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
            <p className="text-sm text-indigo-200 mb-1">Developed by</p>
            <p className="text-white font-semibold">Sumit Ajay Dhokale</p>
            <p className="text-sm text-indigo-200">B.Tech CSE | URN: 1022031003</p>
            <p className="text-xs text-indigo-300 mt-2">ADCET, Ashta | 2025-26</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Library className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LibraryOS</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-indigo-200 mt-2">
                {isLogin ? 'Sign in to access your dashboard' : 'Register to get started'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className={cn(
                        'w-full pl-11 pr-4 py-3 rounded-xl',
                        'bg-white/10 border border-white/20',
                        'text-white placeholder-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                        'transition-all duration-200'
                      )}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className={cn(
                      'w-full pl-11 pr-4 py-3 rounded-xl',
                      'bg-white/10 border border-white/20',
                      'text-white placeholder-gray-400',
                      'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                      'transition-all duration-200'
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className={cn(
                      'w-full pl-11 pr-12 py-3 rounded-xl',
                      'bg-white/10 border border-white/20',
                      'text-white placeholder-gray-400',
                      'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                      'transition-all duration-200'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <Button type="submit" fullWidth loading={loading} size="lg">
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-indigo-300 hover:text-white transition-colors text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-indigo-300 text-center mb-4">Quick Demo Login</p>
              <div className="grid gap-2">
                {demoCredentials.map((cred) => (
                  <button
                    key={cred.role}
                    type="button"
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.password);
                      setIsLogin(true);
                    }}
                    className={cn(
                      'flex items-center justify-between px-4 py-2.5 rounded-xl',
                      'bg-white/5 hover:bg-white/10 border border-white/10',
                      'transition-all duration-200 group'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('w-3 h-3 rounded-full bg-gradient-to-r', cred.color)} />
                      <span className="text-sm text-white font-medium">{cred.role}</span>
                    </div>
                    <span className="text-xs text-indigo-300 group-hover:text-white transition-colors">
                      Click to fill
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-indigo-300/60 text-xs mt-6">
            Guided by Mrs. Anis Fatima N. Mulla
          </p>
        </div>
      </div>
    </div>
  );
}

