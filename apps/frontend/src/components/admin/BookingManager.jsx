import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../config/apiClient';

const STATUS_COLORS = {
  pending: 'yellow',
  confirmed: 'green',
  completed: 'blue',
  cancelled: 'red',
};

const BUDGET_LABELS = {
  'under-5k': 'Under ₹5,000',
  '5k-15k': '₹5,000 – ₹15,000',
  '15k-50k': '₹15,000 – ₹50,000',
  '50k-1l': '₹50,000 – ₹1,00,000',
  'above-1l': 'Above ₹1,00,000',
  'not-specified': 'Not specified',
};

export default function BookingManager() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => (await apiClient.get('/bookings')).data,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      (await apiClient.put(`/bookings/${id}`, { status })).data,
    onSuccess: () => qc.invalidateQueries(['admin-bookings']),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => (await apiClient.delete(`/bookings/${id}`)).data,
    onSuccess: () => qc.invalidateQueries(['admin-bookings']),
  });

  const filtered =
    filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Bookings</h1>
        <span className="text-slate-400 text-sm">{filtered.length} total</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
              filter === f
                ? 'bg-cyan-500 text-slate-900 font-semibold'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {f}
            {f !== 'all' && (
              <span className="ml-1 text-xs opacity-60">
                ({bookings.filter((b) => b.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-slate-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-400">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const color = STATUS_COLORS[booking.status] || 'slate';
            return (
              <div
                key={booking.id}
                className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-3"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold">{booking.clientName}</h3>
                    <p className="text-slate-400 text-sm">{booking.clientEmail}</p>
                    <p className="text-slate-400 text-sm">{booking.clientPhone}</p>
                  </div>
                  <span
                    className={`px-2 py-1 bg-${color}-500/20 text-${color}-400 text-xs rounded-full capitalize`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">Service</p>
                    <p className="text-white capitalize">
                      {booking.serviceType?.replace(/-/g, ' ')}
                    </p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">Budget</p>
                    <p className="text-white">
                      {BUDGET_LABELS[booking.budget] || booking.budget || 'Not specified'}
                    </p>
                  </div>
                  {booking.preferredDate && (
                    <div className="bg-slate-700/50 rounded-lg p-3 col-span-2">
                      <p className="text-slate-400 text-xs mb-1">Preferred Start Date</p>
                      <p className="text-white">{booking.preferredDate}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Project Description</p>
                  <p className="text-slate-300 text-sm">{booking.projectDescription}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap pt-1">
                  {['confirmed', 'completed', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateMutation.mutate({ id: booking.id, status: s })}
                      disabled={booking.status === s || updateMutation.isPending}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-300 text-xs rounded-lg transition capitalize"
                    >
                      Mark {s}
                    </button>
                  ))}
                  <a
                    href={`mailto:${booking.clientEmail}`}
                    className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg hover:bg-green-500/40 transition"
                  >
                    Reply Email
                  </a>
                  <button
                    onClick={() => deleteMutation.mutate(booking.id)}
                    disabled={deleteMutation.isPending}
                    className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/40 transition ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}