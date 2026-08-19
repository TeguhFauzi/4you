import Link from 'next/link';
import { ArrowLeft, Clock, Grid, MessageCircle } from 'lucide-react';
import styles from './detail.module.css';
import BottomNav from '@/components/BottomNav/BottomNav';
import BookingForm from './BookingForm';
import { decryptId } from '@/lib/encryption';
export default async function ServiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const originalId = decryptId(id) || id;
  const service = {
    id: originalId,
    name: 'Kamar Tidur',
    description: 'Bersih kamar tidur standar',
    price: 120000,
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80'
  };
  return (
    <main className={styles.main}>
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <img src={service.imageUrl} alt={service.name} className={styles.heroImage} />
        <div className={styles.topBar}>
          <Link href="/layanan" className={styles.backBtn}>
            <ArrowLeft size={24} color="#171717" />
          </Link>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.iconBox}>
            <BedIcon />
          </div>
          <h1 className={styles.heroTitle}>{service.name}</h1>
          <p className={styles.heroSubtitle}>{service.description}</p>
        </div>
      </div>
      <div className={styles.bottomSheet}>
        <div className={styles.dragIndicator}></div>
        <h2 className={styles.sheetTitle}>Pilih Cara Pesan</h2>
        <p className={styles.sheetSubtitle}>Pilih cara pemesanan yang sesuai dengan kebutuhanmu</p>
        <div className={styles.optionsList}>
          <div className={styles.optionCard}>
            <div className={styles.optionHeader}>
              <div className={`${styles.optionIcon} ${styles.iconBlue}`}>
                <Grid size={24} color="#3B82F6" />
              </div>
              <div className={styles.optionTitleRow}>
                <h3>Per Ruangan</h3>
                <span className={styles.popularBadge}>Paling Populer</span>
              </div>
            </div>
            <p className={styles.optionType}>Harga tetap</p>
            <p className={styles.optionDesc}>Bayar sesuai paket per ruangan. Total pasti tahu di muka.</p>
            <div className={styles.priceTag}>Mulai Rp 120.000</div>
          </div>
          <div className={styles.optionCard}>
            <div className={styles.optionHeader}>
              <div className={`${styles.optionIcon} ${styles.iconIndigo}`}>
                <Clock size={24} color="#4F46E5" />
              </div>
              <div className={styles.optionTitleRow}>
                <h3>Per Jam</h3>
              </div>
            </div>
            <p className={styles.optionType}>Fleksibel sesuai durasi</p>
            <p className={styles.optionDesc}>Pilih durasi 2-8 jam. Cleaner kerjain apapun dalam waktu itu sesuai prioritas kamu.</p>
            <div className={styles.priceTag}>Mulai Rp 75.000/jam</div>
          </div>
          <div className={styles.optionCard}>
            <div className={styles.optionHeader}>
              <div className={`${styles.optionIcon} ${styles.iconGreen}`}>
                <MessageCircle size={24} color="#10B981" />
              </div>
              <div className={styles.optionTitleRow}>
                <h3>Diskusikan Kebutuhan</h3>
              </div>
            </div>
            <p className={`${styles.optionType} ${styles.textGreen}`}>Untuk kebutuhan yang perlu penyesuaian</p>
            <p className={styles.optionDesc}>Cocok untuk properti besar, pasca renovasi, atau kebutuhan khusus. Tim kami bantu cek kebutuhan dan siapkan penawaran yang sesuai.</p>
          </div>
        </div>
        <div className={styles.tipsBox}>
          <div className={styles.tipsHeader}>
            <span>💡</span> <strong>Tips memilih</strong>
          </div>
          <p className={styles.tipsContent}>
            <strong>Per Ruangan</strong> cocok untuk kebutuhan dengan lingkup kerja yang jelas dan harga tetap di awal. <strong>Per Jam</strong> cocok kalau kamu butuh durasi kerja yang lebih fleksibel. <strong>Diskusikan Kebutuhan</strong> cocok untuk properti besar, pasca renovasi, atau kebutuhan yang perlu penyesuaian dulu.
          </p>
        </div>
        <BookingForm serviceId={service.id} serviceName={service.name} price={service.price} />
      </div>
    </main>
  );
}
function BedIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
    </svg>
  );
}
