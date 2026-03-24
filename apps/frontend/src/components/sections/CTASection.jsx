import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-24 px-4 bg-slate-900">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Something{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Amazing?
            </span>
          </h2>
          <p className="text-slate-400 text-xl mb-10">
            Let's turn your idea into a digital reality. Get in touch today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold rounded-xl transition text-lg"
            >
              🚀 Start Your Project
            </Link>
            <a
              href="https://wa.me/918822322905"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold rounded-xl transition text-lg border border-green-500/30"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}