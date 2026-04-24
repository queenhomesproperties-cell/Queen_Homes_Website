import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '#about', label: 'About' },
  { href: '#how-to-buy', label: 'How to Buy' },
  { href: '#properties', label: 'Properties' },
  { href: '#enquiry', label: 'Book a Session' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollTo(href: string) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
          scrolled ? 'bg-gray-950/97 backdrop-blur-md shadow-lg shadow-black/20' : ''
        }`}
      >
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="Queen Homes & Properties" className="h-12 w-auto" />
        </button>

        {/* Desktop Links */}
        <ul className="hidden lg:flex gap-8 list-none">
          {links.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => scrollTo(l.href)}
                className="text-white/70 hover:text-green-400 text-sm font-medium tracking-wide transition-colors duration-200 relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-green-400 group-hover:w-full transition-all duration-300" />
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => scrollTo('#enquiry')}
          className="hidden lg:inline-flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white px-5 py-2.5 rounded text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-900/30"
        >
          Free Consultation
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-gray-950 flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <img src="/logo.jpeg" alt="Queen Homes & Properties" className="h-16 w-auto mb-4" />
        {links.map((l) => (
          <button
            key={l.href}
            onClick={() => scrollTo(l.href)}
            className="text-white font-semibold text-2xl hover:text-green-400 transition-colors"
          >
            {l.label}
          </button>
        ))}
        <button
          onClick={() => scrollTo('#enquiry')}
          className="mt-4 bg-gradient-to-r from-green-700 to-green-600 text-white px-8 py-3 rounded font-semibold"
        >
          Book Free Session
        </button>
      </div>
    </>
  );
}
