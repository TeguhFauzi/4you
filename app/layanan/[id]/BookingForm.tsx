'use client';
import { useState } from 'react';
import { Calendar, MapPin, User, Phone, FileText, CheckCircle } from 'lucide-react';
interface BookingFormProps {
  serviceId: string;
  serviceName: string;
  price: number;
}
export default function BookingForm({ serviceId, serviceName, price }: BookingFormProps) {
  const [date, setDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState('');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !customerName || !customerPhone || !address) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          serviceName,
          customerName,
          customerPhone,
          address,
          scheduledDate: date,
          totalPrice: price,
          notes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBooked(true);
      } else {
        setError(data.error || 'Gagal membuat pesanan');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  if (booked) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#ecfdf5', borderRadius: '16px', marginTop: '24px' }}>
        <CheckCircle size={48} color="#16a34a" style={{ marginBottom: '12px' }} />
        <h3 style={{ color: '#059669', marginBottom: '8px', fontWeight: 'bold', fontSize: '18px' }}>Pesanan Berhasil!</h3>
        <p style={{ color: '#065f46', fontSize: '14px', marginBottom: '16px', lineHeight: 1.5 }}>
          Jadwal <strong>{serviceName}</strong> telah dikonfirmasi untuk tanggal{' '}
          <strong>{new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
        </p>
        <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
          <p style={{ fontWeight: '700', color: '#111827', fontSize: '18px' }}>Total: Rp {price.toLocaleString('id-ID')}</p>
          <p style={{ fontSize: '13px', color: '#dc2626', marginTop: '8px', fontWeight: '600' }}>
            * Pembayaran dilakukan secara tunai/langsung kepada Cleaning Service di lokasi.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#111827' }}>Buat Pesanan</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
            <User size={14} /> Nama Lengkap
          </label>
          <input
            type="text" required
            value={customerName} onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama Anda"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit', fontSize: '14px' }}
          />
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
            <Phone size={14} /> No. HP / WhatsApp
          </label>
          <input
            type="tel" required
            value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit', fontSize: '14px' }}
          />
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
            <MapPin size={14} /> Alamat Lengkap
          </label>
          <textarea
            required rows={2}
            value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder="Jl. Contoh No. 1, RT/RW, Kecamatan, Kota"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit', fontSize: '14px', resize: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
            <Calendar size={14} /> Tanggal Pengerjaan (Min. H+1)
          </label>
          <input
            type="date" required min={minDate}
            value={date} onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit', fontSize: '14px' }}
          />
        </div>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
            <FileText size={14} /> Catatan (opsional)
          </label>
          <textarea
            rows={2}
            value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Lantai 2, tolong bawa vacuum sendiri"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit', fontSize: '14px', resize: 'none' }}
          />
        </div>
        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Total Pembayaran</p>
          <p style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Rp {price.toLocaleString('id-ID')}</p>
          <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '6px', fontWeight: 600 }}>
            * Bayar tunai/langsung ke petugas di lokasi
          </p>
        </div>
        {error && (
          <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px', color: '#dc2626', fontSize: '13px', fontWeight: 500 }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !date || !customerName || !customerPhone || !address}
          style={{
            width: '100%', padding: '16px',
            backgroundColor: loading || !date || !customerName || !customerPhone || !address ? '#94a3b8' : '#2563EB',
            color: 'white', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '16px',
            cursor: loading ? 'wait' : 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {loading ? 'Memproses...' : 'Konfirmasi Pesanan'}
        </button>
      </form>
    </div>
  );
}
