import { useState } from 'react';
import { CheckCircle, Target, FileText, Car, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];
const UNAVAILABLE = ['10:00 AM', '1:00 PM'];

const perks = [
  { icon: Target, title: 'Personalised Property Matching', text: 'We shortlist properties that match your specific budget and location requirements.' },
  { icon: FileText, title: 'Document Review & Legal Clarity', text: 'Our agents explain every document before you sign. No jargon, no surprises.' },
  { icon: Car, title: 'Free Accompanied Site Visit', text: 'We take you to the property at no cost — inspect before you commit.' },
  { icon: Briefcase, title: 'Flexible Payment Plans', text: 'We offer installment options tailored to your income and investment pace.' },
];

function genRef() {
  return 'QHP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

type Step = 1 | 2 | 3 | 'done';

export default function Enquiry() {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [refCode, setRefCode] = useState('');

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [sessionType, setSessionType] = useState('In-Person (Ibadan Office)');
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  function nextStep(to: Step) {
    setError('');
    if (to === 2) {
      if (!firstName.trim() || !phone.trim()) {
        setError('Please fill in your name and phone number.');
        return;
      }
    }
    if (to === 3) {
      if (!timeSlot) {
        setError('Please select a time slot.');
        return;
      }
    }
    setStep(to);
  }

  async function submit() {
    setError('');
    if (!agreed) { setError('Please agree to be contacted.'); return; }
    setSubmitting(true);
    const ref = genRef();
    const { error: dbErr } = await supabase.from('enquiries').insert({
      first_name: firstName,
      last_name: lastName,
      phone,
      email: email || '',
      interest: interest || 'General Enquiry',
      preferred_date: date || null,
      preferred_time: timeSlot,
      session_type: sessionType,
      notes,
      status: 'pending',
      ref_code: ref,
    });
    setSubmitting(false);
    if (dbErr) { setError('Submission failed. Please try again or call us directly.'); return; }
    setRefCode(ref);
    setStep('done');
  }

  const dotClass = (n: number) =>
    (step === 'done' || (typeof step === 'number' && step > n))
      ? 'bg-amber-500 text-gray-900'
      : step === n
      ? 'bg-green-700 text-white'
      : 'bg-gray-200 text-gray-500';

  const lineClass = (n: number) =>
    (step === 'done' || (typeof step === 'number' && step > n))
      ? 'bg-amber-500'
      : 'bg-gray-200';

  return (
    <section id="enquiry" className="bg-white py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left info */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-px bg-green-600" />
            <span className="text-green-700 text-xs font-semibold uppercase tracking-widest">Free Consultation</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Book a Session with Our Team
          </h2>
          <p className="text-gray-500 leading-relaxed mb-2">
            Whether you're a first-time buyer or a seasoned investor, our consultants are ready to walk you through every option.
            Sessions are free, informal, and tailored to your goals.
          </p>
          <p className="text-gray-500 leading-relaxed mb-8">
            Available Monday – Saturday, 8am – 6pm at our Ibadan office or via phone/video call.
          </p>
          <div className="flex flex-col gap-5">
            {perks.map((p) => (
              <div key={p.title} className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                  <p.icon size={16} className="text-green-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{p.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="bg-gray-50 rounded-xl p-7 border border-gray-100 shadow-sm">
          {/* Progress */}
          {step !== 'done' && (
            <div className="flex items-center gap-2 mb-7">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0 ${dotClass(n)}`}>
                    {(step === 'done' || (typeof step === 'number' && step > n)) ? <CheckCircle size={14} /> : n}
                  </div>
                  {n < 3 && <div className={`h-px flex-1 transition-all duration-300 ${lineClass(n)}`} />}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your Details</h3>
              <p className="text-gray-400 text-sm mb-5">Tell us a little about yourself</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">First Name *</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-white border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10" placeholder="Adebisi" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Last Name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-white border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10" placeholder="Okafor" />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number *</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full bg-white border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10" placeholder="0801 234 5678" />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-white border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10" placeholder="you@example.com" />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">What are you interested in?</label>
                <select value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full bg-white border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10">
                  <option value="">— Select Interest —</option>
                  <option>Buying Land</option>
                  <option>Buying a House / Flat</option>
                  <option>Property Investment</option>
                  <option>Property Management</option>
                  <option>General Enquiry</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button onClick={() => nextStep(2)} className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white px-6 py-2.5 rounded font-semibold text-sm transition-all">
                  Next: Choose Date →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Choose a Date & Time</h3>
              <p className="text-gray-400 text-sm mb-5">Pick a slot that works for you</p>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Preferred Date</label>
                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" min={today} className="w-full bg-white border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Session Type</label>
                <select value={sessionType} onChange={(e) => setSessionType(e.target.value)} className="w-full bg-white border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10">
                  <option>In-Person (Ibadan Office)</option>
                  <option>Phone Call</option>
                  <option>Video Call (WhatsApp / Zoom)</option>
                  <option>Site Visit</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Available Time Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const unavail = UNAVAILABLE.includes(slot);
                    return (
                      <button
                        key={slot}
                        disabled={unavail}
                        onClick={() => setTimeSlot(slot)}
                        className={`py-2 px-2 rounded text-xs font-medium border transition-all duration-200 ${
                          unavail
                            ? 'opacity-30 line-through cursor-not-allowed bg-white border-gray-200 text-gray-400'
                            : timeSlot === slot
                            ? 'bg-gradient-to-r from-green-700 to-green-600 border-green-600 text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-700'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="bg-white border border-gray-200 hover:border-green-500 text-gray-500 hover:text-green-700 px-5 py-2.5 rounded font-semibold text-sm transition-all">
                  ← Back
                </button>
                <button onClick={() => nextStep(3)} className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white px-6 py-2.5 rounded font-semibold text-sm transition-all">
                  Next: Confirm →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Confirm Booking</h3>
              <p className="text-gray-400 text-sm mb-5">Review your session details</p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-gray-700 leading-relaxed space-y-1">
                <div><strong>Name:</strong> {firstName} {lastName}</div>
                <div><strong>Phone:</strong> {phone}</div>
                <div><strong>Interest:</strong> {interest || 'General Enquiry'}</div>
                <div><strong>Date:</strong> {date ? new Date(date).toDateString() : 'Not set'}</div>
                <div><strong>Time:</strong> {timeSlot}</div>
                <div><strong>Session:</strong> {sessionType}</div>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Additional Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-white border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 resize-none" placeholder="e.g. I'm interested in plots around ₦5M with installment plans…" />
              </div>
              <label className="flex items-start gap-2 mb-5 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />
                <span className="text-gray-500 text-xs leading-relaxed">I agree to be contacted by Queen Homes &amp; Properties regarding my enquiry.</span>
              </label>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="bg-white border border-gray-200 hover:border-green-500 text-gray-500 hover:text-green-700 px-5 py-2.5 rounded font-semibold text-sm transition-all">
                  ← Back
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white px-6 py-2.5 rounded font-semibold text-sm transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting...</>
                  ) : 'Confirm Booking ✓'}
                </button>
              </div>
            </div>
          )}

          {/* Success */}
          {step === 'done' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Session Booked!</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Thank you! A Queen Homes agent will confirm your session within 2 business hours via phone or WhatsApp.
              </p>
              <div className="inline-block bg-gradient-to-r from-amber-50 to-green-50 border border-green-200 rounded px-5 py-2 font-bold text-green-800 text-sm mb-4">
                Booking Reference: {refCode}
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Our office: No. 1 Irepodun Bus Stop, Opposite NNPC, Akala Express Way, Oluyole Extension, Ibadan.
              </p>
              <a
                href="tel:09069734908"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-3 rounded font-semibold text-sm"
              >
                Call Us Now
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
