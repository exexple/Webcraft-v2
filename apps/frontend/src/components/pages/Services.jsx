import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../config/apiClient';

export default function Services() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await apiClient.get('/content/services');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Our Services</h1>
        <p className="text-slate-400 mb-12">What we offer</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-slate-800 p-8 rounded-lg border border-slate-700 hover:border-cyan-400 transition"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {service.title}
              </h3>
              <p className="text-slate-400">{service.description}</p>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Services coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}