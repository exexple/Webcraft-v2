import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../config/apiClient';

const FALLBACK_SERVICES = [
  {
    group: '🎨 Design',
    options: [
      { value: 'web-design', label: 'Web Design' },
      { value: 'ui-ux-design', label: 'UI/UX Design' },
      { value: 'logo-branding', label: 'Logo & Branding' },
      { value: 'graphic-design', label: 'Graphic Design' },
      { value: 'motion-graphics', label: 'Motion Graphics' },
    ],
  },
  {
    group: '💻 Development',
    options: [
      { value: 'web-development', label: 'Web Development' },
      { value: 'mobile-app', label: 'Mobile App Development' },
      { value: 'ecommerce', label: 'E-Commerce Store' },
      { value: 'custom-webapp', label: 'Custom Web App' },
      { value: 'api-backend', label: 'API / Backend Development' },
      { value: 'cms-integration', label: 'CMS Integration' },
    ],
  },
  {
    group: '📢 Digital Marketing',
    options: [
      { value: 'seo', label: 'SEO Optimization' },
      { value: 'social-media', label: 'Social Media Management' },
      { value: 'content-writing', label: 'Content Writing' },
      { value: 'email-marketing', label: 'Email Marketing' },
      { value: 'paid-ads', label: 'Paid Ads (Google/Meta)' },
    ],
  },
  {
    group: '⚙️ Other',
    options: [
      { value: 'maintenance', label: 'Website Maintenance' },
      { value: 'consulting', label: 'Digital Consulting' },
      { value: 'other', label: 'Something Else' },
    ],
  },
];

const emptyForm = {
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  serviceType: '',
  budget: '',
  projectDescription: '',
  preferredDate: '',
};

export default function Booking() {
  const [formData, setFormData] = useState(emptyForm);
  const [success, setSuccess] = useState(false);

  // Fetch service types from content API (microservices)
  const { data: serviceGroups = FALLBACK_SERVICES } = useQuery({
    queryKey: ['service-types'],
    queryFn: async () => {
      const response = await apiClient.get('/content/service-types');
      return response.data ?? FALLBACK_SERVICES;
    },
    // If API fails, silently fall back to static list
    onError: () => FALLBACK_SERVICES,
  });

  const bookingMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/bookings', data);
      return response.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setFormData(emptyForm);
      setTimeout(() => setSuccess(false), 5000);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    bookingMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Book a Project</h1>
        <p className="text-slate-400 mb-8">
          Tell us about your project and we'll get back to you within 24 hours.
        </p>

        {success && (
          <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 mb-8">
            ✓ Booking submitted successfully! We'll contact you soon.
          </div>
        )}

        {bookingMutation.isError && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 mb-8">
            ✗ Something went wrong. Please try again or contact us directly.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              required
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition"
            />
          </div>

          {/* Service Type — fetched from API */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Service Type <span className="text-red-400">*</span>
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-400 outline-none transition"
            >
              <option value="" disabled>
                Select a service...
              </option>
              {serviceGroups.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Budget Range
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-400 outline-none transition"
            >
              <option value="">Prefer not to say</option>
              <option value="under-5k">Under ₹5,000</option>
              <option value="5k-15k">₹5,000 – ₹15,000</option>
              <option value="15k-50k">₹15,000 – ₹50,000</option>
              <option value="50k-1l">₹50,000 – ₹1,00,000</option>
              <option value="above-1l">Above ₹1,00,000</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Project Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Describe your project, goals, and any specific requirements..."
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition resize-none"
            />
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Preferred Start Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-400 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={bookingMutation.isPending}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-slate-900 font-semibold py-3 rounded-lg transition text-lg"
          >
            {bookingMutation.isPending ? 'Submitting...' : '🚀 Submit Booking'}
          </button>

          <p className="text-center text-slate-500 text-xs">
            We'll respond within 24 hours. Or reach us directly on{' '}
            <a
              href="https://wa.me/918822322905"
              target="_blank"
              rel="noreferrer"
              className="text-green-400 hover:underline"
            >
              WhatsApp
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}