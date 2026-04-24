export default function CtaBand() {
  return (
    <section className="bg-gradient-to-r from-green-800 via-green-700 to-green-800 py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Ready to Own Property in Ibadan?
          </h2>
          <p className="text-white/65 text-base">
            Speak with a Queen Homes agent today — free consultation, no obligations, verified properties only.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-4">
          <div>
            <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Call Us Now</div>
            <a
              href="tel:09069734908"
              className="text-amber-400 font-bold text-4xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              09069734908
            </a>
          </div>
          <a
            href="tel:09069734908"
            className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white px-6 py-3 rounded font-semibold text-sm transition-all hover:-translate-y-0.5"
          >
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
