import { useEffect, useRef } from 'react';

const pillars = [
  { title: 'Our Vision', text: 'To be Ibadan\'s most trusted, people-first property company — accessible, ethical, and excellent.' },
  { title: 'Our Mission', text: 'Connecting people with land and homes that are verified, secure, and worth every naira invested.' },
  { title: 'Integrity', text: 'Every property we sell is backed by clean title documents and full disclosure — always.' },
  { title: 'Excellence', text: 'From site inspection to deed signing, we deliver a seamless, professional experience.' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(href: string) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section id="about" ref={sectionRef} className="bg-white py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Images collage */}
        <div className="reveal relative h-[440px] lg:h-[520px]">
          <div
            className="absolute top-0 left-0 right-[18%] bottom-[22%] rounded-lg bg-cover bg-center shadow-xl"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80')` }}
          />
          <div
            className="absolute bottom-0 right-0 left-[28%] top-[60%] rounded-lg bg-cover bg-center border-4 border-white shadow-2xl"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500&q=80')` }}
          />
          {/* Year badge */}
          <div className="absolute top-[36%] -left-6 bg-gray-900 text-white p-5 rounded-lg text-center z-10 shadow-2xl hidden md:block">
            <div className="text-green-400 text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>2026</div>
            <div className="text-white/50 text-xs uppercase tracking-widest mt-1">Incorporated</div>
          </div>
        </div>

        {/* Text */}
        <div className="reveal">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-px bg-green-600" />
            <span className="text-green-700 text-xs font-semibold uppercase tracking-widest">Who We Are</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Building Trust & Property Value Across Ibadan
          </h2>
          <p className="text-gray-500 leading-relaxed mb-4">
            Queen Homes and Properties Nigeria Limited is a duly incorporated real estate company under the
            Companies and Allied Matters Act 2020 (CAC Reg. No. 9387434). We operate with full regulatory
            compliance, delivering transparent property transactions across Ibadan, Oyo State.
          </p>
          <p className="text-gray-500 leading-relaxed mb-6">
            Our mandate is simple: give every Nigerian — from first-time land buyers to seasoned investors —
            access to verified, premium real estate in Ibadan's fastest-growing corridors, with zero title
            disputes and complete documentation.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {pillars.map((p) => (
              <div key={p.title} className="bg-gray-50 p-4 rounded border-t-2 border-green-600">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{p.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollTo('#enquiry')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white px-7 py-3 rounded font-semibold text-sm tracking-wide transition-all duration-200 hover:-translate-y-0.5"
          >
            Book a Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
