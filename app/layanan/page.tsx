"use client";
import { useQuery } from '@tanstack/react-query';
import BottomNav from '@/components/BottomNav/BottomNav';
import ServiceCard from '@/components/ServiceCard/ServiceCard';
import { Search } from 'lucide-react';
import styles from './layanan.module.css';
interface Service {
  id: string;
  encryptedId?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
export default function Layanan() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });
  const services: Service[] = data?.data || [];
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Layanan</h1>
        <p className={styles.subtitle}>Pilih layanan sesuai kebutuhanmu</p>
      </header>
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <Search size={20} color="#94A3B8" />
          <input 
            type="text" 
            placeholder="Cari layanan..." 
            className={styles.searchInput}
          />
        </div>
      </div>
      <div className={styles.listContainer}>
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={`${styles.skeletonImage} skeleton`}></div>
              <div className={styles.skeletonContent}>
                <div className={`${styles.skeletonTitle} skeleton`}></div>
                <div className={`${styles.skeletonDesc} skeleton`}></div>
                <div className={`${styles.skeletonPrice} skeleton`}></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className={styles.error}>Gagal memuat layanan.</div>
        ) : (
          services.map(service => (
            <ServiceCard 
              key={service.id}
              id={service.encryptedId || service.id}
              name={service.name}
              description={service.description}
              price={service.price}
              imageUrl={service.imageUrl}
            />
          ))
        )}
      </div>
      <BottomNav />
    </main>
  );
}
