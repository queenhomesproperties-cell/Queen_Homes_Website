import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import HowToBuy from './components/HowToBuy';
import Properties from './components/Properties';
import Enquiry from './components/Enquiry';
import Testimonials from './components/Testimonials';
import CtaBand from './components/CtaBand';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-40 w-11 h-11 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-full shadow-lg flex items-center justify-center font-bold text-lg transition-all duration-300 hover:-translate-y-1 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}

function PublicSite() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <HowToBuy />
      <Properties />
      <Enquiry />
      <Testimonials />
      <CtaBand />
      <Contact />
      <Footer />
      <BackToTop />
    </>
  );
}

function AdminRoute() {
  const { isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAdmin ? <AdminDashboard /> : <AdminLogin />;
}

function Router() {
  const path = window.location.pathname;
  if (path === '/admin' || path === '/admin/') return <AdminRoute />;
  return <PublicSite />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
