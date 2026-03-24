import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../config/apiClient';

export default function ContentEditor() {
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroCtaText: '',
    aboutText: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    whatsappNumber: '',
  });
  const [saved, setSaved] = useState(false);

  const { data: content, isLoading } = useQuery({
    queryKey: ['admin-content'],
    queryFn: async () => (await apiClient.get('/content')).data,
  });

  useEffect(() => {
    if (content) {
      setFormData((prev) => ({ ...prev, ...content }));
    }
  }, [content]);

  const updateMutation = useMutation({
    mutationFn: async (data) => (await apiClient.put('/content', data)).data,
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const fields = [
    { key: 'heroTitle', label: 'Hero Title' },
    { key: 'heroSubtitle', label: 'Hero Subtitle' },
    { key: 'heroCtaText', label: 'Hero Button Text' },
    { key: 'aboutText', label: 'About Text', multiline: true },
    { key: 'contactEmail', label: 'Contact Email' },
    { key: 'contactPhone', label: 'Contact Phone' },
    { key: 'contactAddress', label: 'Address' },
    { key: 'whatsappNumber', label: 'WhatsApp Number' },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-slate-400">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Content Editor</h1>
      <p className="text-slate-400 text-sm">
        Edit your site content without touching any code
      </p>

      {saved && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
          ✓ Content saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map(({ key, label, multiline }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {label}
            </label>
            {multiline ? (
              <textarea
                value={formData[key] || ''}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                rows="4"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-400 outline-none transition resize-none"
              />
            ) : (
              <input
                type="text"
                value={formData[key] || ''}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-400 outline-none transition"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-slate-900 font-semibold py-2 rounded-lg transition"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
}