import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../config/apiClient';

export default function Reviews() {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const response = await apiClient.get('/reviews');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Client Reviews</h1>
        <p className="text-slate-400 mb-12">What our clients say about us</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-slate-800 p-6 rounded-lg border border-slate-700"
            >
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">
                  {'⭐'.repeat(review.rating || 5)}
                </div>
              </div>
              <p className="text-slate-300 mb-4">"{review.content}"</p>
              <div>
                <p className="font-semibold text-white">{review.clientName}</p>
                <p className="text-sm text-slate-400">{review.clientCompany}</p>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No reviews yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}