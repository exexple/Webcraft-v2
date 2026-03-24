import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../config/apiClient';

export default function InquiryManager() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(null);

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => (await apiClient.get('/inquiries')).data,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      (await apiClient.put(`/inquiries/${id}`, { status })).data,
    onSuccess: () => qc.invalidateQueries(['admin-inquiries']),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => (await apiClient.delete(`/inquiries/${id}`)).data,
    onSuccess: () => qc.invalidateQueries(['admin-inquiries']),
  });

  const newCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white">Inquiries</h1>
        {newCount > 0 && (
          <span className="px-2 py-0.5 bg-cyan-500 text-slate-900 text-xs font-bold rounded-full">
            {newCount} new
          </span>
        )}
      </div>

      {isLoading ? (
        <p className="text-slate-400">Loading...</p>
      ) : inquiries.length === 0 ? (
        <p className="text-slate-400">No inquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`bg-slate-800 rounded-lg border transition ${
                inq.status === 'new'
                  ? 'border-cyan-500/50'
                  : 'border-slate-700'
              }`}
            >
              <div
                className="p-5 flex justify-between items-start cursor-pointer"
                onClick={() =>
                  setExpanded(expanded === inq.id ? null : inq.id)
                }
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{inq.name}</h3>
                    {inq.status === 'new' && (
                      <span className="w-2 h-2 bg-cyan-400 rounded-full inline-block"></span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{inq.email}</p>
                </div>
                <span className="text-slate-400 text-lg">
                  {expanded === inq.id ? '▲' : '▼'}
                </span>
              </div>

              {expanded === inq.id && (
                <div className="px-5 pb-5 space-y-4">
                  <p className="text-slate-300 text-sm border-t border-slate-700 pt-4">
                    {inq.message}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={`mailto:${inq.email}`}
                      className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg hover:bg-green-500/40 transition"
                    >
                      Reply via Email
                    </a>
                    <button
                      onClick={() =>
                        updateMutation.mutate({ id: inq.id, status: 'read' })
                      }
                      disabled={inq.status === 'read'}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/40 disabled:opacity-40 transition"
                    >
                      Mark Read
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(inq.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/40 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}