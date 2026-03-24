import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeroSection({ content }) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <span className="inline-block px-4 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full border border-cyan-500/30 mb-6">
            ✦ Full-Service Digital Studio
          </span>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {content?.heroTitle || 'We Build'}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {' '}Digital
            </span>
            <br />Experiences
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
            {content?.heroSubtitle ||
              'Websites, apps, branding & marketing — everything your business needs to grow online.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold rounded-xl transition text-lg"
            >
              {content?.heroCtaText || '🚀 Start a Project'}
            </Link>
            <Link
              to="/portfolio"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition text-lg"
            >
              View Our Work
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { value: '50+', label: 'Projects Done' },
            { value: '30+', label: 'Happy Clients' },
            { value: '3+', label: 'Years Experience' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}