import Link from 'next/link';
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', paddingBottom: '40px' }}>
      <header style={{ backgroundColor: '#1e293b', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Jasa Bersih Admin</h1>
        <Link href="/" style={{ fontSize: '14px', color: '#cbd5e1', textDecoration: 'underline' }}>
          Lihat Aplikasi
        </Link>
      </header>
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}
