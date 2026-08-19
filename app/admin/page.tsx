'use client';
import { useState, useEffect } from 'react';
export default function AdminPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const fetchServices = async () => {
    setLoading(true);
    const res = await fetch('/api/services');
    const json = await res.json();
    setServices(json.data || []);
    setLoading(false);
  };
  useEffect(() => {
    fetchServices();
  }, []);
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        name,
        description,
        price
      })
    });
    setName('');
    setDescription('');
    setPrice('');
    fetchServices();
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Hapus layanan ini?')) return;
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete',
        id
      })
    });
    fetchServices();
  };
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Kelola Layanan</h2>
      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Tambah Layanan Baru</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Nama Layanan (contoh: Kamar Tidur)" 
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            required
          />
          <input 
            type="text" 
            placeholder="Deskripsi Singkat" 
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
          <input 
            type="number" 
            placeholder="Harga (Rp)" 
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            required
          />
          <button type="submit" style={{ backgroundColor: '#2563EB', color: 'white', padding: '12px', borderRadius: '6px', fontWeight: '600' }}>
            Simpan Layanan
          </button>
        </form>
      </div>
      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Daftar Layanan Aktif</h3>
        {loading ? (
          <p style={{ color: '#64748b' }}>Memuat data...</p>
        ) : services.length === 0 ? (
          <p style={{ color: '#64748b' }}>Belum ada layanan.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {services.map(svc => (
              <div key={svc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#0f172a' }}>{svc.name}</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>Rp {Number(svc.price).toLocaleString('id-ID')}</p>
                </div>
                <button 
                  onClick={() => handleDelete(svc.id)}
                  style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '8px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
