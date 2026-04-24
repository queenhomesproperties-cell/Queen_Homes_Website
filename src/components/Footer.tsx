const sections = [
  {
    title: 'Company',
    links: [
      { href: '#about', label: 'About Us' },
      { href: '#how-to-buy', label: 'How to Buy Land' },
      { href: '#properties', label: 'Properties' },
      { href: '#enquiry', label: 'Book a Session' },
      { href: '#contact', label: 'Contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '#properties', label: 'Land Sales' },
      { href: '#properties', label: 'Residential Properties' },
      { href: '#properties', label: 'Commercial Properties' },
      { href: '#enquiry', label: 'Property Consultation' },
      { href: '#contact', label: 'Property Management' },
    ],
  },
];

export default function Footer() {
  function scrollTo(href: string) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <footer className="bg-gray-950 py-14 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-10 border-b border-white/5 mb-8">
          {/* Brand */}
          <div>
            <img src="/logo.jpeg" alt="Queen Homes & Properties" className="h-14 w-auto mb-4" />
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              CAC-registered real estate company delivering premium, verified property in Ibadan, Oyo State. Reg. No. 9387434.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="tel:09069734908" className="w-9 h-9 bg-white/7 hover:bg-green-800 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all text-xs font-bold">
                📞
              </a>
            </div>
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <h5 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-5">{s.title}</h5>
              <div className="flex flex-col gap-2">
                {s.links.map((l) => (
                  <button
                    key={l.label}
                    onClick={() => scrollTo(l.href)}
                    className="text-left text-white/30 hover:text-green-400 text-sm transition-colors"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © 2026 Queen Homes and Properties Nigeria Limited. All rights reserved. Ibadan, Oyo State.
          </p>
          <p className="text-amber-600/50 text-xs tracking-wide">
            CAC Reg. No. 9387434 · CAMA 2020
          </p>
        </div>
      </div>
    </footer>
  );
}
