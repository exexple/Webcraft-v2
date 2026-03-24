import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../config/apiClient';

export default function Portfolio() {
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiClient.get('/projects');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Our Portfolio</h1>
        <p className="text-slate-400 mb-12">Explore our latest projects</p>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 mb-8">
            Failed to load projects
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-400 transition"
            >
              <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400">No image</div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{project.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No projects yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}