import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Eye, LogOut, Home, MessageSquare, BarChart2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { supabase, Property, Enquiry } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import PropertyForm from './PropertyForm';

type Tab = 'properties' | 'enquiries' | 'overview';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProp, setEditProp] = useState<Property | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function fetchAll() {
    setLoading(true);
    const [{ data: props }, { data: enqs }] = await Promise.all([
      supabase.from('properties').select('*').order('created_at', { ascending: false }),
      supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
    ]);
    setProperties((props as Property[]) || []);
    setEnquiries((enqs as Enquiry[]) || []);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  async function saveProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at'>) {
    if (editProp) {
      const { error } = await supabase.from('properties').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editProp.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from('properties').insert(data);
      if (error) throw new Error(error.message);
    }
    setShowForm(false);
    setEditProp(null);
    fetchAll();
  }

  async function deleteProperty(id: string) {
    await supabase.from('properties').delete().eq('id', id);
    setDeleteId(null);
    fetchAll();
  }

  async function updateEnquiryStatus(id: string, status: Enquiry['status']) {
    await supabase.from('enquiries').update({ status }).eq('id', id);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  const pending = enquiries.filter((e) => e.status === 'pending').length;
  const contacted = enquiries.filter((e) => e.status === 'contacted').length;
  const available = properties.filter((p) => p.status === 'available').length;

  const navItem = (t: Tab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setTab(t)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        tab === t
          ? 'bg-green-800/40 text-green-400 border border-green-700/30'
          : 'text-white/50 hover:text-white/80 hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-gray-900 border-r border-white/8 flex flex-col">
        <div className="p-6 border-b border-white/8">
          <img src="/logo.jpeg" alt="Queen Homes" className="h-10 w-auto mb-1" />
          <p className="text-white/30 text-xs mt-2">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItem('overview', <BarChart2 size={16} />, 'Overview')}
          {navItem('properties', <Home size={16} />, 'Properties')}
          {navItem('enquiries', <MessageSquare size={16} />, 'Enquiries')}
        </nav>
        <div className="p-4 border-t border-white/8">
          <div className="text-white/30 text-xs mb-3 truncate">{user?.email}</div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-white/40 hover:text-red-400 text-sm transition-colors w-full"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gray-900 border-b border-white/8 px-8 py-4 flex items-center justify-between">
          <h1 className="text-white font-bold text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {tab === 'overview' ? 'Dashboard Overview' : tab === 'properties' ? 'Property Management' : 'Enquiries'}
          </h1>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-white/40 hover:text-white/70 text-sm flex items-center gap-1.5 transition-colors"
            >
              <Eye size={14} />
              View Site
            </a>
            {tab === 'properties' && (
              <button
                onClick={() => { setEditProp(null); setShowForm(true); }}
                className="flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white px-4 py-2 rounded text-sm font-semibold transition-all"
              >
                <Plus size={14} />
                Add Property
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {[
                      { label: 'Available Properties', value: available, color: 'text-green-400', sub: `${properties.length} total` },
                      { label: 'Pending Enquiries', value: pending, color: 'text-amber-400', sub: 'need response' },
                      { label: 'Clients Contacted', value: contacted, color: 'text-blue-400', sub: 'this period' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-gray-900 border border-white/8 rounded-xl p-6">
                        <div className={`text-4xl font-bold mb-1 ${stat.color}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {stat.value}
                        </div>
                        <div className="text-white/60 text-sm font-medium">{stat.label}</div>
                        <div className="text-white/25 text-xs mt-0.5">{stat.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent enquiries */}
                  <div className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-white/8 flex items-center justify-between">
                      <h3 className="text-white font-semibold">Recent Enquiries</h3>
                      <button onClick={() => setTab('enquiries')} className="text-green-400 text-sm hover:underline">View all</button>
                    </div>
                    <div className="divide-y divide-white/5">
                      {enquiries.slice(0, 5).map((e) => (
                        <div key={e.id} className="px-5 py-4 flex items-center justify-between">
                          <div>
                            <div className="text-white text-sm font-medium">{e.first_name} {e.last_name}</div>
                            <div className="text-white/40 text-xs">{e.phone} · {e.interest}</div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            e.status === 'pending' ? 'bg-amber-900/30 text-amber-400' :
                            e.status === 'contacted' ? 'bg-blue-900/30 text-blue-400' :
                            'bg-gray-700 text-gray-400'
                          }`}>
                            {e.status}
                          </span>
                        </div>
                      ))}
                      {enquiries.length === 0 && (
                        <div className="px-5 py-8 text-center text-white/30 text-sm">No enquiries yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PROPERTIES */}
              {tab === 'properties' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {properties.map((prop) => (
                      <div key={prop.id} className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden group">
                        <div className="relative h-40">
                          {prop.image_url ? (
                            <img src={prop.image_url} alt={prop.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white/20 text-3xl">🏠</div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditProp(prop); setShowForm(true); }}
                              className="w-8 h-8 bg-gray-900/90 hover:bg-green-800 rounded flex items-center justify-center text-white transition-colors"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteId(prop.id)}
                              className="w-8 h-8 bg-gray-900/90 hover:bg-red-800 rounded flex items-center justify-center text-white transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded ${
                            prop.status === 'available' ? 'bg-green-700 text-white' :
                            prop.status === 'sold' ? 'bg-gray-600 text-white/60' :
                            'bg-amber-600 text-white'
                          }`}>
                            {prop.status}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="text-green-400 text-xs font-bold uppercase tracking-wide mb-1 capitalize">{prop.category}</div>
                          <div className="text-white font-semibold text-sm mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{prop.name}</div>
                          <div className="text-white/40 text-xs mb-2">{prop.location}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-400 font-bold text-sm">{prop.price}</span>
                            <span className="text-white/30 text-xs">{prop.size}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add new card */}
                    <button
                      onClick={() => { setEditProp(null); setShowForm(true); }}
                      className="bg-gray-900 border border-dashed border-white/15 rounded-xl h-full min-h-[220px] flex flex-col items-center justify-center gap-3 hover:border-green-700 hover:bg-green-900/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-green-800/40 flex items-center justify-center transition-colors">
                        <Plus size={18} className="text-white/30 group-hover:text-green-400" />
                      </div>
                      <span className="text-white/30 group-hover:text-green-400 text-sm font-medium transition-colors">Add New Property</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ENQUIRIES */}
              {tab === 'enquiries' && (
                <div className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/8">
                          <th className="text-left px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wide">Client</th>
                          <th className="text-left px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wide">Contact</th>
                          <th className="text-left px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wide">Interest</th>
                          <th className="text-left px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wide">Session</th>
                          <th className="text-left px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wide">Date</th>
                          <th className="text-left px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wide">Status</th>
                          <th className="text-left px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wide">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {enquiries.map((e) => (
                          <tr key={e.id} className="hover:bg-white/2 transition-colors">
                            <td className="px-5 py-4">
                              <div className="text-white text-sm font-medium">{e.first_name} {e.last_name}</div>
                              <div className="text-white/30 text-xs">{e.ref_code}</div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="text-white/70 text-sm">{e.phone}</div>
                              <div className="text-white/30 text-xs">{e.email}</div>
                            </td>
                            <td className="px-5 py-4 text-white/60 text-sm max-w-[160px] truncate">{e.interest}</td>
                            <td className="px-5 py-4 text-white/50 text-xs">{e.session_type || '—'}</td>
                            <td className="px-5 py-4 text-white/40 text-xs whitespace-nowrap">
                              {e.preferred_date ? new Date(e.preferred_date).toLocaleDateString() : '—'}<br />
                              {e.preferred_time}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                                e.status === 'pending' ? 'bg-amber-900/30 text-amber-400' :
                                e.status === 'contacted' ? 'bg-blue-900/30 text-blue-400' :
                                'bg-gray-700/50 text-gray-400'
                              }`}>
                                {e.status === 'pending' ? <Clock size={10} /> : e.status === 'contacted' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                {e.status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                {e.status !== 'contacted' && (
                                  <button
                                    onClick={() => updateEnquiryStatus(e.id, 'contacted')}
                                    className="text-xs bg-blue-900/30 hover:bg-blue-900/60 text-blue-400 px-2 py-1 rounded transition-colors"
                                  >
                                    Mark Contacted
                                  </button>
                                )}
                                {e.status !== 'closed' && (
                                  <button
                                    onClick={() => updateEnquiryStatus(e.id, 'closed')}
                                    className="text-xs bg-gray-700/50 hover:bg-gray-700 text-gray-400 px-2 py-1 rounded transition-colors"
                                  >
                                    Close
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {enquiries.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-5 py-12 text-center text-white/30 text-sm">
                              No enquiries yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Property Form Modal */}
      {showForm && (
        <PropertyForm
          initial={editProp || undefined}
          onSave={saveProperty}
          onCancel={() => { setShowForm(false); setEditProp(null); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/8 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Delete Property?</h3>
            <p className="text-white/50 text-sm mb-6">This action cannot be undone. The property listing will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white/70 py-2.5 rounded font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProperty(deleteId)}
                className="flex-1 bg-red-800 hover:bg-red-700 text-white py-2.5 rounded font-semibold text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
