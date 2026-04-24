import { useState } from 'react';
import { useAuth } from '../lib/auth';

export default function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) setError(err);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.jpeg" alt="Queen Homes" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Admin Portal
          </h1>
          <p className="text-white/40 text-sm mt-1">Queen Homes &amp; Properties Nigeria Limited</p>
        </div>

        <div className="bg-gray-900 rounded-xl border border-white/8 p-8 shadow-2xl">
          <h2 className="text-white font-semibold text-lg mb-1">Sign In</h2>
          <p className="text-white/40 text-sm mb-6">Enter your admin credentials to continue</p>

          {error && (
            <div className="mb-5 bg-red-900/30 border border-red-700/40 text-red-300 text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/15"
                placeholder="admin@queenhomes.ng"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/15"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white py-3 rounded font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In to Admin Panel'}
            </button>
          </form>

          <p className="text-center text-white/25 text-xs mt-6">
            Restricted access. Authorised personnel only.
          </p>
        </div>

        <p className="text-center mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="text-white/30 hover:text-white/60 text-sm transition-colors"
          >
            ← Back to Website
          </button>
        </p>
      </div>
    </div>
  );
}
