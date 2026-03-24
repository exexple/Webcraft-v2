import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-cyan-400 mb-3">
              Webcraft<span className="text-white">Studio</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Full-service digital studio building modern web experiences,
              apps, and brands.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Services', path: '/services' },
                { label: 'Portfolio', path: '/portfolio' },
                { label: 'Book a Project', path: '/booking' },
                { label: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-cyan-400 text-sm transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>📧 webcraft1130@gmail.com</li>
              <li>
                <a
                  href="https://wa.me/918822322905"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-400 transition"
                >
                  💬 WhatsApp: +91 8822322905
                </a>
              </li>
              <li>📍 Guwahati, Assam, India</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Webcraft Studio. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs">
            Built with ❤️ by Manas
          </p>
        </div>
      </div>
    </footer>
  );
}