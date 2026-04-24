import { useEffect, useRef } from 'react';

const steps = [
  {
    num: '01',
    tag: 'Initial Contact',
    title: 'Book a Free Consultation',
    text: 'Call us or use our online booking form to schedule a free, no-obligation consultation with one of our licensed property agents in Ibadan. We\'ll understand your budget, location preference, and property goals.',
  },
  {
    num: '02',
    tag: 'Site Visit',
    title: 'Inspect the Property',
    text: 'We arrange an accompanied site inspection at a time convenient for you. Our agent will walk you through the property, explain the survey, title type, and neighborhood advantages — no pressure, just facts.',
  },
  {
    num: '03',
    tag: 'Documentation',
    title: 'Review Title & Documents',
    text: 'We provide full documentation for your review — Survey Plan, Deed of Assignment, Receipt of Payment, and where applicable, a Governor\'s Consent or Certificate of Occupancy (C of O). You may involve your personal lawyer.',
  },
  {
    num: '04',
    tag: 'Payment',
    title: 'Make Payment & Secure Your Plot',
    text: 'Pay the agreed sum (outright or installment, subject to plan) into our corporate account. A receipted Offer Letter is issued immediately. Flexible payment plans are available for qualifying properties.',
  },
  {
    num: '05',
    tag: 'Handover',
    title: 'Receive Your Deed & Take Possession',
    text: 'Upon full payment, your Deed of Assignment is executed and all title documents are transferred to your name. We stake your land and hand over physical possession — your property is now legally yours.',
  },
];

export default function HowToBuy() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const delay = parseInt((e.target as HTMLElement).dataset.delay || '0');
          setTimeout(() => e.target.classList.add('visible'), delay);
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.step-item').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(href: string) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section id="how-to-buy" ref={sectionRef} className="bg-gray-950 py-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-px bg-amber-500" />
          <span className="text-amber-500 text-xs font-semibold uppercase tracking-widest">Land Acquisition Guide</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          How to Buy Land from Queen Homes
        </h2>
        <p className="text-white/50 max-w-xl leading-relaxed mb-12">
          Our acquisition process is designed to be transparent, legally sound, and stress-free — even for first-time land buyers.
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-7 top-0 bottom-0 w-px bg-amber-900/40 hidden sm:block" />

          <div className="space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="step-item flex gap-6 py-8 opacity-0 -translate-x-5 transition-all duration-700"
                data-delay={String(i * 120)}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-amber-900/20 border border-amber-800/40 flex items-center justify-center z-10">
                  <span
                    className="text-amber-500 text-lg font-bold"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {step.num}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="inline-block text-amber-500 text-xs font-semibold uppercase tracking-widest border border-amber-800/40 px-3 py-1 rounded-sm mb-3">
                    {step.tag}
                  </span>
                  <h3 className="text-white text-xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => scrollTo('#enquiry')}
          className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white px-7 py-3 rounded font-semibold text-sm tracking-wide transition-all duration-200 hover:-translate-y-0.5"
        >
          Start the Process Today
        </button>
      </div>
    </section>
  );
}
