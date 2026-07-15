import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Upload, Trash2, Eye, EyeOff, Plus, Image } from 'lucide-react';

const API = '/api/banners';
const token = () => localStorage.getItem('vstore_token');

const inp = { background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, width: '100%', outline: 'none', colorScheme: 'dark' };

const BannerAdminPage = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const fileRef = useRef();
    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({ title: '', subtitle: '', link: '/', badgeText: '', order: 0 });

    const load = async () => {
        setLoading(true);
        const { data } = await axios.get(`${API}/all`, { headers: { Authorization: `Bearer ${token()}` } });
        setBanners(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fileRef.current.files[0]) { alert('Please select an image'); return; }
        setUploading(true);
        const fd = new FormData();
        fd.append('image', fileRef.current.files[0]);
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        await axios.post(API, fd, { headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'multipart/form-data' } });
        setUploading(false);
        setShowForm(false);
        setPreview(null);
        setForm({ title: '', subtitle: '', link: '/', badgeText: '', order: 0 });
        load();
    };

    const toggleActive = async (b) => {
        await axios.put(`${API}/${b._id}`, { isActive: !b.isActive }, { headers: { Authorization: `Bearer ${token()}` } });
        load();
    };

    const deleteBanner = async (id) => {
        if (!confirm('Delete this banner?')) return;
        await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
        load();
    };

    return (
        <div style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Homepage Banners</h2>
                    <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Upload promotional banners shown on the main page hero section</p>
                </div>
                <button onClick={() => setShowForm(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f57224', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    <Plus size={16} /> Upload Banner
                </button>
            </div>

            {/* Upload Form */}
            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 28, marginBottom: 28 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 20 }}>New Banner</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={{ fontSize: 11, color: '#bbb', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Title</label>
                            <input style={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Eid Sale" />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, color: '#bbb', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subtitle</label>
                            <input style={inp} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="e.g. Up to 50% off on electronics" />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, color: '#bbb', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Link (on click)</label>
                            <input style={inp} value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="/category/electronics" />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, color: '#bbb', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Badge Text</label>
                            <input style={inp} value={form.badgeText} onChange={e => setForm(f => ({ ...f, badgeText: e.target.value }))} placeholder="e.g. LIMITED TIME" />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, color: '#bbb', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Display Order</label>
                            <input style={inp} type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} placeholder="0" />
                        </div>
                    </div>

                    {/* Image upload */}
                    <div
                        onClick={() => fileRef.current.click()}
                        style={{ border: '2px dashed #1e1e1e', borderRadius: 10, padding: 32, textAlign: 'center', cursor: 'pointer', marginBottom: 16, background: '#0d0d0d', position: 'relative', overflow: 'hidden', minHeight: 160 }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#f57224'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
                    >
                        {preview
                            ? <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
                            : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: '#aaa' }}>
                                <Image size={36} />
                                <p style={{ fontSize: 13, color: '#ccc' }}>Click to upload banner image</p>
                                <p style={{ fontSize: 11, color: '#888' }}>Recommended: 1200×500px, JPG/PNG, max 5MB</p>
                            </div>
                        }
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <button type="submit" disabled={uploading} style={{ background: '#f57224', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                            {uploading ? 'Uploading...' : <><Upload size={14} style={{ display: 'inline', marginRight: 6 }} />Upload Banner</>}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setPreview(null); }} style={{ background: 'transparent', color: '#888', border: '1px solid #1e1e1e', borderRadius: 8, padding: '10px 20px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            )}

            {/* Banner List */}
            {loading ? <p style={{ color: '#888' }}>Loading...</p> : banners.length === 0
                ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
                        <Image size={40} style={{ margin: '0 auto 16px', color: '#666' }} />
                        <p style={{ fontSize: 14, color: '#ccc' }}>No banners yet. Upload your first banner above.</p>
                    </div>
                )
                : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {banners.map(b => (
                            <div key={b._id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#111', border: `1px solid ${b.isActive ? '#1e1e1e' : '#0d0d0d'}`, borderRadius: 10, padding: '12px 16px', opacity: b.isActive ? 1 : 0.5 }}>
                                <img src={`http://localhost:5000${b.imageUrl}`} alt={b.title} style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{b.title || 'Untitled'}</p>
                                    <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{b.subtitle}</p>
                                    <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                                        {b.badgeText && <span style={{ fontSize: 10, background: 'rgba(245,114,36,0.1)', color: '#f57224', border: '1px solid rgba(245,114,36,0.2)', borderRadius: 4, padding: '2px 8px', fontWeight: 600 }}>{b.badgeText}</span>}
                                        <span style={{ fontSize: 10, color: '#888' }}>→ {b.link}</span>
                                        <span style={{ fontSize: 10, color: '#888' }}>Order: {b.order}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => toggleActive(b)} title={b.isActive ? 'Deactivate' : 'Activate'} style={{ width: 36, height: 36, borderRadius: 8, background: b.isActive ? 'rgba(34,197,94,0.1)' : '#0d0d0d', border: `1px solid ${b.isActive ? 'rgba(34,197,94,0.3)' : '#1e1e1e'}`, color: b.isActive ? '#22c55e' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {b.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                                    </button>
                                    <button onClick={() => deleteBanner(b._id)} style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
};

export default BannerAdminPage;
