'use client';
import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav/BottomNav';
import { ClipboardList, Clock, MapPin, ChevronRight } from 'lucide-react';
type TabType = 'upcoming' | 'completed';
interface Order {
  id: string;
  serviceName: string;
  scheduledDate: string;
  status: string;
  totalPrice: number;
  address: string;
  customerName: string;
}
export default function PesananPage() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders?status=${activeTab}`);
        const json = await res.json();
        setOrders(json.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [activeTab]);
  return (
    <main style={{ paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <header style={{ padding: '24px 20px 16px', backgroundColor: 'white' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Pesanan</h1>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Riwayat dan jadwal kebersihan kamu</p>
      </header>
      <div style={{ display: 'flex', padding: '0 20px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            flex: 1, padding: '12px 0', fontSize: '14px', fontWeight: 600,
            color: activeTab === 'upcoming' ? '#2563EB' : '#94a3b8',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: `2px solid ${activeTab === 'upcoming' ? '#2563EB' : 'transparent'}`,
            transition: 'all 0.2s',
          }}
        >
          Akan Datang
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          style={{
            flex: 1, padding: '12px 0', fontSize: '14px', fontWeight: 600,
            color: activeTab === 'completed' ? '#2563EB' : '#94a3b8',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: `2px solid ${activeTab === 'completed' ? '#2563EB' : 'transparent'}`,
            transition: 'all 0.2s',
          }}
        >
          Selesai
        </button>
      </div>
      <div style={{ padding: '16px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <p style={{ color: '#94a3b8' }}>Memuat data...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <ClipboardList size={48} color="#cbd5e1" />
            <p style={{ marginTop: '16px', fontSize: '15px', fontWeight: 600, color: '#475569' }}>
              {activeTab === 'upcoming' ? 'Belum ada pesanan mendatang' : 'Belum ada riwayat pesanan'}
            </p>
            <p style={{ marginTop: '6px', fontSize: '13px', color: '#94a3b8' }}>
              Pesanan yang kamu buat akan muncul di sini
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: 'white', borderRadius: '16px', padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>{order.id}</span>
                  <span
                    style={{
                      fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px',
                      backgroundColor: order.status === 'upcoming' ? '#dbeafe' : '#dcfce7',
                      color: order.status === 'upcoming' ? '#2563EB' : '#16a34a',
                    }}
                  >
                    {order.status === 'upcoming' ? 'Terjadwal' : 'Selesai'}
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{order.serviceName}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} color="#94a3b8" />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      {new Date(order.scheduledDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color="#94a3b8" />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{order.address}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>TOTAL BAYAR</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#2563EB' }}>
                      Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                    </p>
                    <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '2px' }}>* Bayar tunai ke petugas</p>
                  </div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563EB', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                    Detail <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
