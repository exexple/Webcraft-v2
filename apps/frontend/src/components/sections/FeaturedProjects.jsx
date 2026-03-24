import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGetProjects } from '../../hooks/useDataHooks';

export default function FeaturedProjects() {
const { data, isLoading } = useGetProjects();
const projects = data?.projects || data || [];
const featured = projects.slice(0, 3);
  

  return (
    <section className="py-24 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Featured Work</h2>
          <p className="text-slate-400 text-lg">Some of our best projects</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
          </div>
        ) : featured.length === 0 ? (
          <p className="text-center text-slate-400">Projects coming soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-400/50 transition group"
              >
                <div className="h-44 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 overflow-hidden">
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold mb-1">{project.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {project.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/portfolio"
            className="px-6 py-3 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition"
          >
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
