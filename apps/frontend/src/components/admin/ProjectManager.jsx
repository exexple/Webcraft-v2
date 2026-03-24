import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../config/apiClient';

const emptyForm = {
  title: '',
  description: '',
  imageUrl: '',
  tags: '',
  liveUrl: '',
};

export default function ProjectManager() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => (await apiClient.get('/projects')).data,
  });

  const createMutation = useMutation({
    mutationFn: async (data) => (await apiClient.post('/projects', data)).data,
    onSuccess: () => {
      qc.invalidateQueries(['admin-projects']);
      setForm(emptyForm);
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) =>
      (await apiClient.put(`/projects/${id}`, data)).data,
    onSuccess: () => {
      qc.invalidateQueries(['admin-projects']);
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => (await apiClient.delete(`/projects/${id}`)).data,
    onSuccess: () => qc.invalidateQueries(['admin-projects']),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (editId) {
      updateMutation.mutate({ id: editId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (project) => {
    setForm({
      ...project,
      tags: project.tags?.join(', ') || '',
    });
    setEditId(project.id);
    setShowForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition"
        >
          {showForm ? 'Cancel' : '+ Add Project'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white">
            {editId ? 'Edit Project' : 'New Project'}
          </h2>

          {['title', 'description', 'imageUrl', 'liveUrl'].map((field) => (
            <div key={field}>
              <label className="block text-sm text-slate-300 mb-1 capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required={field === 'title' || field === 'description'}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 outline-none"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 outline-none"
              placeholder="React, Firebase, Tailwind"
            />
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-slate-900 font-semibold py-2 rounded-lg transition"
          >
            {editId ? 'Update Project' : 'Create Project'}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-slate-400">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-slate-400">No projects yet. Add one!</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800 rounded-lg p-5 border border-slate-700 flex justify-between items-start"
            >
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="text-white font-semibold">{project.title}</h3>
                <p className="text-slate-400 text-sm truncate">{project.description}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg hover:bg-blue-500/40 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(project.id)}
                  className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/40 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}