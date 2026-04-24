import { useEffect, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { supabase, Property } from '../lib/supabase';

const FILTERS = [
  { value: 'all', label: 'All Properties' },
  { value: 'land', label: 'Land' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
];

function BadgePill({ badge }: { badge: string }) {
  if (!badge) return null;
  const cls =
    badge === 'hot'
      ? 'bg-red-600 text-white'
      : badge === 'new'
      ? 'bg-green-700 text-white'
      : badge === 'sold'
      ? 'bg-gray-600 text-white/60'
      : 'bg-amber-500 text-gray-900';
  return (
    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm ${cls}`}>
      {badge === 'hot' ? 'Hot Deal' : badge === 'new' ? 'New' : badge.charAt(0).toUpperCase() + badge.slice(1)}
    </span>
  );
}

function PropertyModal({ prop, onClose }: { prop: Property; onClose: () => void }) {
  function scrollTo(href: string) {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={prop.image_url}
            alt={prop.name}
            className="w-full h-56 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
          <div className="absolute top-3 left-3">
            <BadgePill badge={prop.badge} />
          </div>
        </div>
        <div className="p-6">
          <div className="text-green-700 text-xs font-bold uppercase tracking-widest mb-1 capitalize">{prop.category}</div>
          <h3 className="text-gray-900 text-2xl font-bold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {prop.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
            <MapPin size={14} />
            {prop.location}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">{prop.description}</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-50 rounded p-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Size</div>
              <div className="font-semibold text-gray-800 text-sm">{prop.size}</div>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Title</div>
              <div className="font-semibold text-gray-800 text-sm">{prop.title_type}</div>
            </div>
            <div className="bg-gray-50 rounded p-3 col-span-2">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Price</div>
              <div className="font-bold text-green-700 text-lg">{prop.price}</div>
            </div>
          </div>
          {prop.features.length > 0 && (
            <div className="mb-5">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Features</div>
              <div className="flex flex-wrap gap-2">
                {prop.features.map((f) => (
                  <span key={f} className="bg-green-50 text-green-800 text-xs px-3 py-1 rounded-full border border-green-200">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => scrollTo('#enquiry')}
            className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white py-3 rounded font-semibold text-sm tracking-wide transition-all"
          >
            Book a Viewing
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProperties((data as Property[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = filter === 'all' ? properties : properties.filter((p) => p.category === filter);

  function scrollTo(href: string) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <section id="properties" className="bg-gray-50 py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-px bg-green-600" />
                <span className="text-green-700 text-xs font-semibold uppercase tracking-widest">Our Listings</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Available Properties in Ibadan
              </h2>
            </div>
            <button
              onClick={() => scrollTo('#enquiry')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white px-6 py-3 rounded font-semibold text-sm transition-all hover:-translate-y-0.5"
            >
              Request Full Catalogue
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  filter === f.value
                    ? 'bg-gradient-to-r from-green-700 to-green-600 border-green-600 text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => setSelected(prop)}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={prop.image_url}
                      alt={prop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <BadgePill badge={prop.badge} />
                    </div>
                    {prop.status === 'sold' && (
                      <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                        <span className="text-white font-bold text-xl tracking-widest">SOLD</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-green-700 text-xs font-bold uppercase tracking-widest mb-1.5 capitalize">{prop.category}</div>
                    <h3 className="text-gray-900 font-bold text-lg mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {prop.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
                      <MapPin size={13} />
                      {prop.location}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-green-700 font-bold text-base">{prop.price}</span>
                      <div className="flex gap-3 text-gray-400 text-xs">
                        <span>{prop.size}</span>
                        <span>{prop.title_type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Enquiry CTA card */}
              <div
                onClick={() => scrollTo('#enquiry')}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-green-900/30 to-gray-900">
                  <div className="text-5xl">🏠</div>
                </div>
                <div className="p-5">
                  <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1.5">More Available</div>
                  <div className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Off-Plan &amp; Coming Soon
                  </div>
                  <div className="text-gray-400 text-sm mb-3">Contact us for exclusive listings</div>
                  <span className="text-green-400 font-semibold text-sm">Enquire Now →</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {selected && <PropertyModal prop={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
