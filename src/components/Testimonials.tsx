import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    stars: 5,
    quote: '"Queen Homes made my first land purchase completely stress-free. The documentation was clean and my title is undisputed. I recommend them to everyone."',
    name: 'Adebayo Babatunde',
    role: 'Land Owner, Akala Express',
    initials: 'AB',
    color: '#1B5E20',
  },
  {
    stars: 5,
    quote: '"The site inspection was so professional. They walked us through everything — the survey, the neighbours, even the drainage. No surprises at all."',
    name: 'Folake Ogunlade',
    role: 'Property Investor, Lagos',
    initials: 'FO',
    color: '#C9963A',
  },
  {
    stars: 5,
    quote: '"I bought on an installment plan and they were incredibly patient throughout. The deed came through in record time. 10 out of 10 experience."',
    name: 'Chukwuemeka Ugo',
    role: 'Buyer, Oluyole Extension',
    initials: 'CU',
    color: '#2E8B57',
  },
  {
    stars: 5,
    quote: '"As a diaspora buyer, I was worried about purchasing land in Nigeria remotely. Queen Homes handled everything and sent me video evidence of every step."',
    name: 'Rotimi Adeyemi',
    role: 'Diaspora Buyer, UK',
    initials: 'RA',
    color: '#1B5E20',
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const visible = 3;
  const max = testimonials.length - visible;

  function slide(dir: number) {
    setIdx((prev) => Math.max(0, Math.min(prev + dir, max)));
  }

  return (
    <section id="testimonials" className="bg-gray-950 py-24 px-6 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-px bg-amber-500" />
          <span className="text-amber-500 text-xs font-semibold uppercase tracking-widest">Client Stories</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          What Our Clients Say
        </h2>

        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(calc(-${idx * (100 / visible)}% - ${idx * 24 / visible}px))` }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[calc(33.333%-1rem)] bg-white/4 border border-white/7 rounded-xl p-7"
              >
                <div className="text-amber-500 text-sm tracking-widest mb-4">{'★'.repeat(t.stars)}</div>
                <p className="text-white/80 text-lg italic leading-relaxed mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white/75 font-medium text-sm">{t.name}</div>
                    <div className="text-white/35 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => slide(-1)}
            disabled={idx === 0}
            className="w-11 h-11 rounded-full bg-white/7 border border-white/12 text-white flex items-center justify-center hover:bg-green-800 hover:border-green-700 transition-all disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => slide(1)}
            disabled={idx >= max}
            className="w-11 h-11 rounded-full bg-white/7 border border-white/12 text-white flex items-center justify-center hover:bg-green-800 hover:border-green-700 transition-all disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
