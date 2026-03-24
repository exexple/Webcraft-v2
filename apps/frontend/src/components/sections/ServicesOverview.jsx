import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DEFAULT_SERVICES = [
  { icon: '🎨', title: 'Web Design', desc: 'Beautiful, conversion-focused designs' },
  { icon: '💻', title: 'Web Development', desc: 'Fast, scalable web applications' },
  { icon: '📱', title: 'Mobile Apps', desc: 'Native & cross-platform apps' },
  { icon: '📢', title: 'Digital Marketing', desc: 'SEO, social media & paid ads' },
  { icon: '🏷️', title: 'Branding', desc: 'Logo, identity & brand strategy' },
  { icon: '🛒', title: 'E-Commerce', desc: 'Online stores that convert' },
];

export default function ServicesOverview({ services }) {
  const list = services?.length ? services : DEFAULT_SERVICES;

  return (
    <section className="py-24 px-4 bg-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold text-white mb-4">What We Do</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            End-to-end digital solutions for businesses of all sizes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-cyan-400/50 transition group"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition">
                {service.title}
              </h3>
              <p className="text-slate-400 text-sm">{service.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/services"
            className="px-6 py-3 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition"
          >
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  );
}