import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Zap, CheckCircle } from 'lucide-react';

const inputStyle = {
    background: '#111', border: '1px solid #1e1e1e', borderRadius: 8,
    padding: '10px 14px', color: '#fff', fontSize: 14, width: '100%',
    outline: 'none', colorScheme: 'dark',
};
const labelStyle = { fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, display: 'block' };

const FlashSaleAdminPanel = () => {
    const [isActive, setIsActive] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await axios.get('/api/flash-sale');
                if (res.data) {
                    setIsActive(res.data.isActive || false);
                    setStartTime(res.data.startTime ? res.data.startTime.slice(0, 16) : '');
                    setEndTime(res.data.endTime ? res.data.endTime.slice(0, 16) : '');
                }
            } catch {}
            setLoading(false);
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const token = localStorage.getItem('vstore_token');
            await axios.put('/api/flash-sale', { isActive, startTime, endTime }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Flash Sale configuration updated!');
        } catch {
            setMessage('Failed to update.');
        }
        setSaving(false);
    };

    if (loading) return <div style={{ color: '#888', padding: 32 }}>Loading...</div>;

    return (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 32, maxWidth: 520, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(245,114,36,0.1)', border: '1px solid rgba(245,114,36,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f57224' }}>
                    <Zap size={20} />
                </div>
                <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Flash Sale Management</h2>
                    <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>Configure sale timing and activation</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: '14px 18px' }}>
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Enable Flash Sale</p>
                        <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>Show flash sale timer and badge</p>
                    </div>
                    <div
                        onClick={() => setIsActive(v => !v)}
                        style={{
                            width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                            background: isActive ? '#f57224' : '#1e1e1e', border: `1px solid ${isActive ? '#f57224' : '#333'}`,
                        }}
                    >
                        <div style={{
                            width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute',
                            top: 2, left: isActive ? 22 : 2, transition: 'left 0.2s',
                        }} />
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Sale Start Date & Time</label>
                    <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} style={inputStyle} />
                </div>

                <div>
                    <label style={labelStyle}>Sale End Date & Time</label>
                    <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} style={inputStyle} />
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ background: '#f57224', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
                >
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>

                {message && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22c55e', fontSize: 13, fontWeight: 600 }}>
                        <CheckCircle size={16} /> {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlashSaleAdminPanel;
