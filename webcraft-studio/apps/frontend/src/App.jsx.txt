import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './config/queryClient';

// Auth
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Home from './components/pages/Home';
import Portfolio from './components/pages/Portfolio';
import Services from './components/pages/Services';
import Booking from './components/pages/Booking';
import Contact from './components/pages/Contact';
import Reviews from './components/pages/Reviews';
import NotFound from './components/pages/NotFound';
import AdminLogin from './components/pages/AdminLogin';

// Admin Pages
import Dashboard from './components/admin/Dashboard';
import ProjectManager from './components/admin/ProjectManager';
import BookingManager from './components/admin/BookingManager';
import InquiryManager from './components/admin/InquiryManager';
import ReviewManager from './components/admin/ReviewManager';
import ContentEditor from './components/admin/ContentEditor';
import SettingsPanel from './components/admin/SettingsPanel';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews" element={<Reviews />} />

          {/* Auth Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectManager />} />
            <Route path="bookings" element={<BookingManager />} />
            <Route path="inquiries" element={<InquiryManager />} />
            <Route path="reviews" element={<ReviewManager />} />
            <Route path="content" element={<ContentEditor />} />
            <Route path="settings" element={<SettingsPanel />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
