import { useEffect, useRef } from 'react';
import { Shield, CheckCircle, TrendingUp } from 'lucide-react';

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollTo(href: string) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Parallax BG */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-gray-950/20" />

      {/* Decorative rings */}
      <div className="absolute top-24 right-12 w-72 h-72 rounded-full border border-green-500/15 animate-spin-slow hidden md:block" />
      <div className="absolute top-16 right-6 w-96 h-96 rounded-full border border-green-400/8 hidden md:block" style={{ animation: 'spin 45s linear infinite reverse' }} />

      {/* CAC Badge */}
      <div className="absolute top-24 right-6 md:right-12 z-10 bg-white/95 rounded-lg px-4 py-3 flex items-center gap-3 border-l-4 border-green-600 shadow-xl max-w-xs animate-fade-up">
        <Shield size={20} className="text-green-700 flex-shrink-0" />
        <div>
          <div className="text-xs font-bold text-green-800 uppercase tracking-wide">CAC Certified</div>
          <div className="text-xs text-gray-500 mt-0.5">Reg. No. 9387434 · TIN: 2623082879658</div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 md:px-16 pb-20 md:pb-28">
        <div className="flex items-center gap-4 mb-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-10 h-px bg-green-400" />
          <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">
            Ibadan's Premier Real Estate Company
          </span>
        </div>

        <h1
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-none mb-6 animate-fade-up"
          style={{ animationDelay: '0.4s', fontFamily: "'Cormorant Garamond', serif" }}
        >
          Own Prime Land &<br />
          Property in <span className="italic text-green-400">Ibadan</span>
        </h1>

        <p
          className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed mb-10 animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          Queen Homes &amp; Properties Nigeria Limited — CAC-registered, professionally managed,
          delivering verified, premium real estate across Ibadan, Oyo State.
        </p>

        <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={() => scrollTo('#properties')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white px-7 py-3.5 rounded font-semibold text-sm tracking-wide transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-900/40"
          >
            Explore Properties
          </button>
          <button
            onClick={() => scrollTo('#enquiry')}
            className="inline-flex items-center gap-2 bg-transparent text-white border border-white/25 hover:border-green-400 hover:text-green-400 px-7 py-3.5 rounded font-semibold text-sm tracking-wide transition-all duration-200 hover:-translate-y-0.5"
          >
            Book Free Session
          </button>
        </div>

        {/* Trust Stats */}
        <div
          className="hidden md:flex items-center gap-10 mt-16 animate-fade-up"
          style={{ animationDelay: '1s' }}
        >
          {[
            { icon: Shield, num: 'CAC', label: 'Registered 2026' },
            { icon: CheckCircle, num: '100%', label: 'Verified Titles' },
            { icon: TrendingUp, num: '0', label: 'Disputed Properties' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              {i > 0 && <div className="w-px h-10 bg-white/10" />}
              <div>
                <div
                  className="text-green-400 text-3xl font-bold"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {item.num}
                </div>
                <div className="text-white/40 text-xs uppercase tracking-widest mt-1">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative z-10 bg-green-800 py-3 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap marquee-track">
          {[
            'Real Estate Sales', 'Property Management', 'Estate Development',
            'CAC Registered · Ibadan', 'Verified Land Titles', 'Secure Investment',
            'Oyo State', 'Real Estate Sales', 'Property Management', 'Estate Development',
            'CAC Registered · Ibadan', 'Verified Land Titles', 'Secure Investment', 'Oyo State',
          ].map((item, i) => (
            <span key={i} className="text-white/80 text-xs font-semibold tracking-widest uppercase flex items-center gap-4 shrink-0">
              {item}
              <span className="text-green-400/60">&#9819;</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
