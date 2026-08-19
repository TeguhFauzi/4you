import BottomNav from '@/components/BottomNav/BottomNav';
import LocationHeader from '@/components/LocationHeader/LocationHeader';
import { Sparkles, ChevronRight, BedDouble, Bath, UtensilsCrossed, Sofa, Briefcase, Zap } from 'lucide-react';
import styles from './page.module.css';
import Link from 'next/link';
import { db } from '@/lib/db';
import { services } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import React from 'react';
import { encryptId } from '@/lib/encryption';

const iconMap: Record<string, { icon: React.ReactNode, color: string }> = {
  'Pembersihan Kamar Tidur': { icon: <BedDouble size={24} />, color: '#EBF5FF' },
  'Pembersihan Kamar Mandi': { icon: <Bath size={24} />, color: '#F0FDF4' },
  'Pembersihan Dapur': { icon: <UtensilsCrossed size={24} />, color: '#FFFBEB' },
  'Pembersihan Ruang Tamu': { icon: <Sofa size={24} />, color: '#F8FAFC' },
  'Paket Bersih Rumah Full': { icon: <Sparkles size={24} />, color: '#F0F9FF' },
};

const defaultIcon = { icon: <Briefcase size={24} />, color: '#FEF2F2' };

export default async function Home() {
  // Fetch active services from DB
  const dbServices = await db.query.services.findMany({
    where: eq(services.isActive, true),
    orderBy: (services, { desc }) => [desc(services.createdAt)]
  });

  return (
    <main className={styles.main}>
      <LocationHeader />
      
      <section className={styles.bannerSection}>
        <div className={styles.bannerCard}>
          <div className={styles.bannerContent}>
            <h2>Bersih Full Custom</h2>
            <p>Pilih sendiri layanan & jumlahnya, bayar sesuai pakai</p>
            <button className={styles.primaryBtn}>PESAN SEKARANG</button>
          </div>
          <div className={styles.bannerIcon}>
            <div className={styles.bucketDecor}></div>
          </div>
        </div>
      </section>
      
      <section className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <h3>Pilih Layanan</h3>
          <p>Tap untuk lihat detail & pesan</p>
        </div>
        <div className={styles.gridContainer}>
          {dbServices.map((service) => {
            const mapped = iconMap[service.name] || defaultIcon;
            return (
              <Link href={`/layanan/${encryptId(service.id)}`} key={service.id} className={styles.categoryItem}>
                <div className={styles.iconBox} style={{ backgroundColor: mapped.color }}>
                  {mapped.icon}
                </div>
                <span>{service.name.replace('Pembersihan ', '')}</span>
              </Link>
            );
          })}
          <Link href="/layanan" className={styles.categoryItem}>
            <div className={styles.iconBox} style={{ backgroundColor: '#F1F5F9' }}>
              <ChevronRight size={24} color="#3B82F6" />
            </div>
            <span>Lihat Semua</span>
          </Link>
        </div>
      </section>
      
      <section className={styles.packagesSection}>
        <div className={styles.sectionHeaderLine}>
          <h3>Paket Lengkap</h3>
          <span className={styles.badge}>HEMAT</span>
        </div>
        <p className={styles.sectionDesc}>Pilihan paket praktis untuk rumah, properti besar, dan kebutuhan berkala</p>
        <div className={styles.carousel}>
          <div className={styles.packageCard}>
            <div className={styles.packageImg}>
              <span className={styles.packageTag}>PAKET</span>
              <span className={styles.favoriteTag}>PILIHAN FAVORIT</span>
              <div className={styles.imgOverlay}>
                <h4>Berlangganan Bulanan</h4>
              </div>
            </div>
            <div className={styles.packageDetails}>
              <p>Paket berkala 3-6x kunjungan/bulan dengan harga lebih hemat.</p>
              <div className={styles.priceRow}>
                <div>
                  <span className={styles.priceLabel}>HARGA PAKET</span>
                  <p className={styles.priceValue}>Rp 450.000</p>
                </div>
                <button className={styles.textBtn}>Lihat Detail</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <BottomNav />
    </main>
  );
}
