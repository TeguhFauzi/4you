import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/lib/schema';
import { verifySessionToken } from '@/lib/session';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import styles from './voucher.module.css';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export default async function VoucherPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (!sessionCookie?.value) {
    redirect('/login');
  }
  
  const sessionData = await verifySessionToken(sessionCookie.value);
  if (!sessionData) {
    redirect('/login');
  }

  const userId = sessionData.userId;

  // Fetch Vouchers for the user
  const vouchers = await db.query.userVouchers.findMany({
    where: eq(schema.userVouchers.userId, userId),
    orderBy: (vouchers, { asc }) => [asc(vouchers.isUsed), asc(vouchers.createdAt)]
  });

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/profil" className={styles.backBtn}>
          <ArrowLeft size={24} />
        </Link>
        <h1 className={styles.title}>Voucher Saya</h1>
      </header>

      <div className={styles.content}>
        {vouchers.length === 0 ? (
          <div className={styles.emptyState}>
            <Tag size={48} color="#CBD5E1" />
            <h3>Belum ada voucher</h3>
            <p>Anda belum memiliki kode promo atau voucher diskon saat ini.</p>
          </div>
        ) : (
          <div className={styles.voucherList}>
            {vouchers.map((voucher) => (
              <div key={voucher.id} className={`${styles.voucherCard} ${voucher.isUsed ? styles.voucherUsed : ''}`}>
                <div className={styles.voucherLeft}>
                  <span className={styles.discountAmount}>{(voucher.discountAmount / 1000)}K</span>
                  <span className={styles.discountLabel}>POTONGAN</span>
                </div>
                <div className={styles.voucherRight}>
                  <h3 className={styles.voucherTitle}>
                    {voucher.isUsed ? 'Voucher Telah Dipakai' : 'Voucher Diskon Layanan'}
                  </h3>
                  <span className={styles.voucherCode}>{voucher.code}</span>
                  <div className={`${styles.statusBadge} ${voucher.isUsed ? styles.statusUsed : styles.statusActive}`}>
                    {voucher.isUsed ? 'SUDAH DIPAKAI' : 'MASIH AKTIF'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
