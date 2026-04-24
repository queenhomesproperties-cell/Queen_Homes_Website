import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Property } from '../lib/supabase';

type Props = {
  initial?: Partial<Property>;
  onSave: (data: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
};

const EMPTY: Omit<Property, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  category: 'land',
  location: '',
  price: '',
  size: '',
  title_type: '',
  features: [],
  image_url: '',
  status: 'available',
  badge: '',
  description: '',
};

export default function PropertyForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [newFeature, setNewFeature] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(field: string, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addFeature() {
    const f = newFeature.trim();
    if (!f) return;
    set('features', [...(form.features || []), f]);
    setNewFeature('');
  }

  function removeFeature(i: number) {
    set('features', form.features.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.location.trim() || !form.price.trim()) {
      setError('Name, location, and price are required.');
      return;
    }
    setSaving(true);
    try {
      await onSave(form as Omit<Property, 'id' | 'created_at' | 'updated_at'>);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    }
    setSaving(false);
  }

  const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/15';
  const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="bg-gray-900 rounded-xl border border-white/8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/8">
          <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {initial?.id ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-900/30 border border-red-700/40 text-red-300 text-sm px-4 py-3 rounded">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Property Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} placeholder="Queen Gardens Phase I" />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                <option value="land">Land</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Location *</label>
              <input value={form.location} onChange={(e) => set('location', e.target.value)} className={inputCls} placeholder="Akala Express Area, Ibadan" />
            </div>
            <div>
              <label className={labelCls}>Price *</label>
              <input value={form.price} onChange={(e) => set('price', e.target.value)} className={inputCls} placeholder="₦4,500,000" />
            </div>
            <div>
              <label className={labelCls}>Size</label>
              <input value={form.size} onChange={(e) => set('size', e.target.value)} className={inputCls} placeholder="500 sqm" />
            </div>
            <div>
              <label className={labelCls}>Title Type</label>
              <input value={form.title_type} onChange={(e) => set('title_type', e.target.value)} className={inputCls} placeholder="C of O" />
            </div>
            <div>
              <label className={labelCls}>Badge</label>
              <select value={form.badge} onChange={(e) => set('badge', e.target.value)} className={inputCls}>
                <option value="">None</option>
                <option value="new">New</option>
                <option value="hot">Hot Deal</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Image URL</label>
              <input value={form.image_url} onChange={(e) => set('image_url', e.target.value)} className={inputCls} placeholder="https://images.unsplash.com/..." />
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="mt-2 h-24 w-full object-cover rounded border border-white/10" />
              )}
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Description</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Describe this property..." />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Features</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.features.map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-green-900/40 border border-green-700/40 text-green-300 text-xs px-3 py-1 rounded-full">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)} className="text-green-400/60 hover:text-green-300">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className={`${inputCls} flex-1`}
                  placeholder="Add feature (press Enter)"
                />
                <button type="button" onClick={addFeature} className="bg-green-800 hover:bg-green-700 text-white px-3 rounded transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="bg-gray-800 hover:bg-gray-700 text-white/70 px-5 py-2.5 rounded text-sm font-semibold transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white px-6 py-2.5 rounded text-sm font-semibold transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</> : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
