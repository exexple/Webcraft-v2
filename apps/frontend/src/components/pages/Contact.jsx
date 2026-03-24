import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../config/apiClient';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);

  const contactMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/inquiries', data);
      return response.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Get In Touch</h1>
        <p className="text-slate-400 mb-8">We'd love to hear from you</p>

        {success && (
          <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 mb-8">
            ✓ Message sent successfully! We'll be in touch soon.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-400 outline-none transition resize-none"
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            disabled={contactMutation.isPending}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-slate-900 font-semibold py-2 rounded-lg transition"
          >
            {contactMutation.isPending ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Contact Info</h2>
          <div className="space-y-2 text-slate-400">
            <p>📧 webcraft1130@gmail.com</p>
            <p>📱 +91 8822322905</p>
            <p>📍 Guwahati, Assam, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}