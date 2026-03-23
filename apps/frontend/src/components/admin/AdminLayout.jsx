// apps/frontend/src/components/admin/AdminLayout.jsx
// Admin Dashboard Layout with sidebar navigation and outlet

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  MessageSquare,
  Mail,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';

function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FolderOpen, label: 'Projects', path: '/admin/projects' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: Mail, label: 'Inquiries', path: '/admin/inquiries' },
    { icon: MessageSquare, label: 'Reviews', path: '/admin/reviews' },
    { icon: FileText, label: 'Content', path: '/admin/content' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        className="w-64 bg-gradient-to-br from-slate-900 to-slate-800 text-white"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Webcraft
          </h1>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item, idx) => (
            <motion.button
              key={idx}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-600/20 hover:text-cyan-400 transition-all group"
              whileHover={{ x: 5 }}
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition" />
              <span className="text-sm">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="absolute bottom-6 left-4 w-56 flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 transition-all"
          whileHover={{ x: 5 }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        className="flex-1 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}

export default AdminLayout;
