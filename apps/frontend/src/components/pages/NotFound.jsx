import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-cyan-400 mb-2">404</h1>
        <p className="text-2xl text-white mb-4">Page Not Found</p>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold px-6 py-2 rounded-lg transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}