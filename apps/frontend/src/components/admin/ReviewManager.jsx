import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../config/apiClient';

export default function ReviewManager() {
  const qc = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => (await apiClient.get('/reviews')).data,
  });

  const approveMutation = useMutation({
    mutationFn: async (id) =>
      (await apiClient.put(`/reviews/${id}`, { approved: true })).data,
    onSuccess: () => qc.invalidateQueries(['admin-reviews']),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => (await apiClient.delete(`/reviews/${id}`)).data,
    onSuccess: () => qc.invalidateQueries(['admin-reviews']),
  });

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  const ReviewCard = ({ review }) => (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white font-semibold">{review.clientName}</p>
          <p className="text-slate-400 text-sm">{review.clientCompany}</p>
          <p className="text-yellow-400">{'⭐'.repeat(review.rating || 5)}</p>
        </div>
        <span
          className={`px-2 py-0.5 text-xs rounded-full ${
            review.approved
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          {review.approved ? 'Approved' : 'Pending'}
        </span>
      </div>

      <p className="text-slate-300 text-sm">"{review.content}"</p>

      <div className="flex gap-2">
        {!review.approved && (
          <button
            onClick={() => approveMutation.mutate(review.id)}
            className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg hover:bg-green-500/40 transition"
          >
            Approve
          </button>
        )}
        <button
          onClick={() => deleteMutation.mutate(review.id)}
          className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/40 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Reviews</h1>

      {isLoading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <>
          {pending.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-yellow-400 mb-3">
                Pending Approval ({pending.length})
              </h2>
              <div className="space-y-4">
                {pending.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-green-400 mb-3">
              Approved ({approved.length})
            </h2>
            {approved.length === 0 ? (
              <p className="text-slate-400 text-sm">No approved reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {approved.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}