import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { updatePassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/stores';

export default function SettingsPanel() {
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);
  const user = useAuthStore((state) => state.user);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setPasswordMsg('✓ Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    clearUser();
    navigate('/admin/login');
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Account Info */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-3">
        <h2 className="text-lg font-semibold text-white">Account</h2>
        <div className="space-y-1">
          <p className="text-slate-400 text-sm">Logged in as</p>
          <p className="text-white font-medium">{user?.email || 'Admin'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 text-sm transition"
        >
          Logout
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 outline-none"
              placeholder="••••••••"
            />
          </div>

          {passwordMsg && (
            <p
              className={`text-sm ${
                passwordMsg.includes('✓')
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {passwordMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-slate-900 font-semibold py-2 rounded-lg transition"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}