'use client';
import { useState } from 'react';
import BottomNav from '@/components/BottomNav/BottomNav';
import { Heart, Gift, Send, CheckCircle } from 'lucide-react';
const presetAmounts = [10000, 20000, 50000, 100000];
export default function DonasiPage() {
  const [donorName, setDonorName] = useState('');
  const [donorType, setDonorType] = useState<'customer' | 'cleaner'>('customer');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !amount) return;
    setLoading(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorName, donorType, amount: Number(amount), message }),
      });
      if (res.ok) {
        setSuccess(true);
        setDonorName('');
        setAmount('');
        setMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return (
      <main style={{ paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '24px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <CheckCircle size={40} color="#16a34a" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Terima Kasih!</h2>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5, marginBottom: '24px' }}>
            Donasi Anda telah dicatat. Semoga menjadi berkah dan bermanfaat bagi banyak orang.
          </p>
          <button
            onClick={() => setSuccess(false)}
            style={{ padding: '14px 32px', backgroundColor: '#2563EB', color: 'white', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
          >
            Donasi Lagi
          </button>
        </div>
        <BottomNav />
      </main>
    );
  }
  return (
    <main style={{ paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ background: 'linear-gradient(135deg, #2563EB, #7c3aed)', padding: '32px 24px 40px', color: 'white', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Donasi Seikhlasnya</h1>
        <p style={{ opacity: 0.9, fontSize: '14px', lineHeight: 1.5 }}>
          Berikan apresiasi untuk petugas kebersihan atau bantu sesama melalui program kami.
        </p>
      </div>
      <div style={{ padding: '24px', marginTop: '-16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '4px', display: 'flex', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => setDonorType('customer')}
            style={{
              flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer',
              backgroundColor: donorType === 'customer' ? '#2563EB' : 'transparent',
              color: donorType === 'customer' ? 'white' : '#64748b',
              transition: 'all 0.2s',
            }}
          >
            Saya Pelanggan
          </button>
          <button
            onClick={() => setDonorType('cleaner')}
            style={{
              flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer',
              backgroundColor: donorType === 'cleaner' ? '#2563EB' : 'transparent',
              color: donorType === 'cleaner' ? 'white' : '#64748b',
              transition: 'all 0.2s',
            }}
          >
            Saya Cleaner
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Nama Anda</label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Masukkan nama"
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Pilih Nominal</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {presetAmounts.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setAmount(String(preset))}
                    style={{
                      padding: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                      border: amount === String(preset) ? '2px solid #2563EB' : '1px solid #e2e8f0',
                      backgroundColor: amount === String(preset) ? '#eff6ff' : 'white',
                      color: amount === String(preset) ? '#2563EB' : '#0f172a',
                      transition: 'all 0.2s',
                    }}
                  >
                    Rp {preset.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Atau nominal lainnya (Rp)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Masukkan jumlah"
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Pesan / Doa (opsional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Semoga berkah..."
                rows={3}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'none' }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !donorName || !amount}
            style={{
              width: '100%', padding: '16px', borderRadius: '14px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer',
              backgroundColor: loading || !donorName || !amount ? '#94a3b8' : '#2563EB',
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background-color 0.2s',
            }}
          >
            <Send size={18} />
            {loading ? 'Mengirim...' : 'Kirim Donasi'}
          </button>
        </form>
        <div style={{ marginTop: '20px', backgroundColor: '#eff6ff', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #3b82f6' }}>
          <p style={{ fontSize: '13px', color: '#1e40af', lineHeight: 1.5 }}>
            <strong>ℹ️ Info:</strong> Donasi ini dicatat sebagai niat baik. Pembayaran dilakukan secara langsung (transfer / tunai) sesuai kesepakatan.
          </p>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
