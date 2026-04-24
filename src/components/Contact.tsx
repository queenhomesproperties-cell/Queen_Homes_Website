import { useState } from 'react';
import { MapPin, Phone, Clock, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [interest, setInterest] = useState('Buying Land');
  const [budget, setBudget] = useState('Under ₦5 Million');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (!name.trim() || !phone.trim()) { setErr('Please enter your name and phone number.'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('enquiries').insert({
      first_name: name,
      last_name: '',
      phone,
      email: emailVal,
      interest: `${interest} — Budget: ${budget}`,
      preferred_date: null,
      preferred_time: '',
      session_type: 'Contact Form',
      notes: message,
      status: 'pending',
      ref_code: 'QHP-CF-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    });
    setSubmitting(false);
    if (error) { setErr('Submission failed. Please call us directly.'); return; }
    setSubmitted(true);
  }

  return (
    <section id="contact" className="bg-gray-50 py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Info */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-px bg-green-600" />
            <span className="text-green-700 text-xs font-semibold uppercase tracking-widest">Visit or Call Us</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Get in Touch with Queen Homes
          </h2>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-green-700" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Office Address</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  No. 1 Irepodun Bus Stop, Opposite NNPC Filling Station<br />
                  Along Akala Express Way, Oluyole Extension<br />
                  <strong>Ibadan, Oyo State, Nigeria</strong>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-green-700" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Phone</h4>
                <a href="tel:09069734908" className="text-gray-600 text-sm hover:text-green-700 transition-colors">09069734908</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-green-700" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Working Hours</h4>
                <p className="text-gray-600 text-sm">Monday – Saturday: 8:00 AM – 6:00 PM<br />Sunday: By Appointment</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Building2 size={16} className="text-green-700" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Company Registration</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  CAC Reg. No.: 9387434<br />
                  TIN: 2623082879658<br />
                  Incorporated: 4th March, 2026
                </p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div
            className="h-44 rounded-xl overflow-hidden relative"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1524813686514-a57563d77965?w=600&q=70')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gray-900/55 flex items-center justify-center">
              <a
                href="https://maps.google.com/?q=Akala+Express+Way,+Oluyole+Extension,+Ibadan"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-700 hover:bg-green-600 text-white px-6 py-2.5 rounded font-semibold text-sm transition-colors"
              >
                View on Google Maps ↗
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-7 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-px bg-green-600" />
            <span className="text-green-700 text-xs font-semibold uppercase tracking-widest">Send a Message</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            We'll Reply Within 2 Hours
          </h3>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Message Sent!</h4>
              <p className="text-gray-500 text-sm">Our team will contact you at {phone} within 2 hours during working hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">{err}</div>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone *</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white" placeholder="0801 234 5678" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                <input value={emailVal} onChange={(e) => setEmailVal(e.target.value)} type="email" className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white" placeholder="your@email.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Property Interest</label>
                  <select value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white">
                    <option>Buying Land</option>
                    <option>Buying a Home</option>
                    <option>Property Investment</option>
                    <option>Property Management</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Budget Range</label>
                  <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white">
                    <option>Under ₦5 Million</option>
                    <option>₦5M – ₦10M</option>
                    <option>₦10M – ₦25M</option>
                    <option>₦25M – ₦50M</option>
                    <option>Above ₦50M</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:bg-white resize-none" placeholder="Tell us what you're looking for…" />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white py-3 rounded font-semibold text-sm tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : 'Send Message →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
