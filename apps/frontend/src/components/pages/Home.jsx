// apps/frontend/src/components/pages/Home.jsx
// Home page with hero section, services overview, featured projects, testimonials

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import HeroSection from '../sections/HeroSection';
import ServicesOverview from '../sections/ServicesOverview';
import FeaturedProjects from '../sections/FeaturedProjects';
import TestimonialsPreview from '../sections/TestimonialsPreview';
import CTASection from '../sections/CTASection';
import WhatsAppButton from '../sections/WhatsAppButton';
import { useGetSiteContent } from '../../hooks/useDataHooks';

function Home() {
  const { data: content, isLoading } = useGetSiteContent();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <HeroSection content={content?.hero} />

        {/* Services Overview */}
        <ServicesOverview services={content?.services} />

        {/* Featured Projects */}
        <FeaturedProjects />

        {/* Testimonials */}
        <TestimonialsPreview />

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton phoneNumber="8822322905" />
    </motion.div>
  );
}

export default Home;
