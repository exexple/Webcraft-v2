import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useReviews } from '../../hooks/useDataHooks';

export default function TestimonialsPreview() {
  const { data: reviews = [], isLoading } = useReviews();
  const preview = reviews.slice(0, 3);

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
          <h2 className="text-4xl font-bold text-white mb-4">What Clients Say</h2>
          <p className="text-slate-400 text-lg">Real feedback from real clients</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
          </div>
        ) : preview.length === 0 ? (
          <p className="text-center text-slate-400">Reviews coming soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preview.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700"
              >
                <div className="text-yellow-400 mb-3">
                  {'⭐'.repeat(review.rating || 5)}
                </div>
                <p className="text-slate-300 text-sm mb-4 line-clamp-4">
                  "{review.content}"
                </p>
                <div>
                  <p className="text-white font-semibold text-sm">{review.clientName}</p>
                  {review.clientCompany && (
                    <p className="text-slate-400 text-xs">{review.clientCompany}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/reviews"
            className="px-6 py-3 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition"
          >
            Read All Reviews →
          </Link>
        </div>
      </div>
    </section>
  );
}