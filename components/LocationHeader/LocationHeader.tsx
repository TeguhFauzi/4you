"use client";

import { useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import styles from './LocationHeader.module.css';

export default function LocationHeader() {
  const [address, setAddress] = useState<string>('Belum ada alamat');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch address');
          }
          
          const data = await response.json();
          const shortAddress = data.address?.road || data.address?.suburb || data.address?.city || data.display_name.split(',')[0];
          setAddress(shortAddress);
        } catch (error) {
          console.error("Error getting address:", error);
          setErrorMsg("Gagal mendapatkan nama alamat dari koordinat.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error details:", error.message, error.code);
        setIsLoading(false);
        switch (error.code) {
          case 1:
            setErrorMsg("Izin lokasi ditolak oleh browser/pengguna. Silakan izinkan akses lokasi di pengaturan browser Anda.");
            break;
          case 2:
            setErrorMsg("Informasi lokasi tidak tersedia atau GPS tidak aktif.");
            break;
          case 3:
            setErrorMsg("Permintaan lokasi timeout. Koneksi mungkin terlalu lambat.");
            break;
          default:
            setErrorMsg("Terjadi kesalahan yang tidak diketahui saat mengambil lokasi: " + error.message);
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.locationWrapper} onClick={handleGetLocation}>
          <div className={styles.locationIcon}>
            <MapPin size={20} color="#64748B" />
          </div>
          <div className={styles.locationText}>
            <p className={styles.locationLabel}>
              {address !== 'Belum ada alamat' ? 'Lokasi Anda' : 'Belum ada alamat'}
            </p>
            {isLoading ? (
              <p className={styles.loadingText}>Mencari lokasi...</p>
            ) : (
              <p className={styles.locationAction}>
                {address !== 'Belum ada alamat' ? address : 'Tap untuk tambah alamat'} <ChevronRight size={16} />
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Modern Popup Modal */}
      {errorMsg && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Akses Lokasi Gagal</h3>
            <p>{errorMsg}</p>
            <button className={styles.closeBtn} onClick={() => setErrorMsg(null)}>Tutup</button>
          </div>
        </div>
      )}
    </>
  );
}
