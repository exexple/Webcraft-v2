import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../config/apiClient';

export default function Dashboard() {
  const { data: projects = [] } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => (await apiClient.get('/projects')).data,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => (await apiClient.get('/bookings')).data,
  });

  const { data: inquiries = [] } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => (await apiClient.get('/inquiries')).data,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => (await apiClient.get('/reviews')).data,
  });

  const stats = [
    { label: 'Projects', value: projects.length, icon: '🗂️', color: 'cyan' },
    { label: 'Bookings', value: bookings.length, icon: '📅', color: 'blue' },
    { label: 'Inquiries', value: inquiries.length, icon: '📨', color: 'purple' },
    { label: 'Reviews', value: reviews.length, icon: '⭐', color: 'yellow' },
  ];

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const newInquiries = inquiries.filter((i) => i.status === 'new');

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back, Manas 👋</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800 rounded-lg p-5 border border-slate-700"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Bookings */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Pending Bookings ({pendingBookings.length})
        </h2>
        {pendingBookings.length === 0 ? (
          <p className="text-slate-400 text-sm">No pending bookings</p>
        ) : (
          <div className="space-y-3">
            {pendingBookings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-medium">{b.clientName}</p>
                  <p className="text-slate-400 text-sm">{b.serviceType}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  Pending
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Inquiries */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          New Inquiries ({newInquiries.length})
        </h2>
        {newInquiries.length === 0 ? (
          <p className="text-slate-400 text-sm">No new inquiries</p>
        ) : (
          <div className="space-y-3">
            {newInquiries.slice(0, 5).map((inq) => (
              <div
                key={inq.id}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700"
              >
                <p className="text-white font-medium">{inq.name}</p>
                <p className="text-slate-400 text-sm truncate">{inq.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}