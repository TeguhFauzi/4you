'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav/BottomNav';
import { LogIn, LogOut, ArrowRight, Briefcase, MapPin, Wallet, Tag, Bell, Globe, Shield, User } from 'lucide-react';
import { getEncryptedItem, removeEncryptedItem } from '@/lib/client-encryption';
import styles from './profil.module.css';
interface UserData {
  id: string;
  email: string;
  role: string;
}
export default function Profil() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    async function validateSession() {
      try {
        const sessionRes = await fetch('/api/session');
        const sessionData = await sessionRes.json();
        
        if (!sessionData.authenticated) {
          removeEncryptedItem('user');
          setUser(null);
          setProfileData(null);
          setIsLoading(false);
          return;
        }

        // Fetch profile dynamic data
        try {
          const profileRes = await fetch('/api/user/profile-data');
          if (profileRes.ok) {
            const profData = await profileRes.json();
            setProfileData(profData.data);
          }
        } catch (e) {
          console.error('Failed to fetch profile data', e);
        }

        const storedEncrypted = await getEncryptedItem('user');
        if (storedEncrypted) {
          const parsed = JSON.parse(storedEncrypted);
          if (parsed.email === sessionData.user.email) {
            setUser(parsed);
          } else {
            removeEncryptedItem('user');
            setUser(null);
          }
        } else {
          setUser(sessionData.user);
        }
      } catch {
        setUser(null);
        setProfileData(null);
      } finally {
        setIsLoading(false);
      }
    }
    validateSession();
  }, []);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await fetch('/api/logout', { method: 'POST' });
    removeEncryptedItem('user');
    setUser(null);
    setProfileData(null);
    router.refresh();
  };

  return (
    <>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Profil</h1>
        </header>
        {isLoading ? (
          <div className={styles.loginBanner} style={{ background: '#e2e8f0', justifyContent: 'center' }}>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Memuat...</div>
          </div>
        ) : user ? (
          <div className={styles.loginBanner} style={{ background: 'linear-gradient(135deg, #047857 0%, #10B981 100%)' }}>
            <div className={styles.loginContent}>
              <div className={styles.loginIcon} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
                <User size={24} color="#fff" />
              </div>
              <div className={styles.loginText}>
                <h2>{user.email}</h2>
                <p style={{ textTransform: 'capitalize' }}>{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'white', fontSize: '12px', fontWeight: 600 }}
            >
              <LogOut size={18} color="white" />
            </button>
          </div>
        ) : (
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <div className={styles.loginBanner}>
              <div className={styles.loginContent}>
                <div className={styles.loginIcon}>
                  <LogIn size={24} color="#2563EB" />
                </div>
                <div className={styles.loginText}>
                  <h2>Login / Daftar</h2>
                  <p>Akses pesanan, alamat, dan promo</p>
                </div>
              </div>
              <ArrowRight size={20} color="white" />
            </div>
          </Link>
        )}
        <div className={styles.scrollContent}>
          <div className={styles.mitraCard}>
            <div className={styles.mitraLeft}>
              <div className={styles.mitraIconBox}>
                <Briefcase size={20} color="#3B82F6" />
              </div>
              <div>
                <h3>Jadi Mitra Cleaner</h3>
                <p>Kerja fleksibel, payout harian</p>
              </div>
            </div>
            <ArrowRight size={16} color="#94A3B8" />
          </div>
          <section className={styles.menuSection}>
            <h4 className={styles.sectionTitle}>AKUN</h4>
            <div className={styles.menuCard}>
              <div className={styles.menuItem}>
                <div className={styles.menuIconBox}>
                  <MapPin size={20} color="#475569" />
                </div>
                <span className={styles.menuLabel}>Alamat Tersimpan</span>
                {profileData?.addressCount !== undefined && <span className={styles.menuValue}>{profileData.addressCount} Alamat</span>}
                <ArrowRight size={16} color="#CBD5E1" />
              </div>
              <div className={styles.menuItem}>
                <div className={styles.menuIconBox}>
                  <Wallet size={20} color="#475569" />
                </div>
                <span className={styles.menuLabel}>Saldo Saya</span>
                {profileData?.walletBalance !== undefined && <span className={styles.menuValue}>Rp {profileData.walletBalance.toLocaleString('id-ID')}</span>}
                <ArrowRight size={16} color="#CBD5E1" />
              </div>
              <Link href="/voucher" className={styles.menuItem} style={{ textDecoration: 'none' }}>
                <div className={styles.menuIconBox}>
                  <Tag size={20} color="#475569" />
                </div>
                <span className={styles.menuLabel}>Voucher Saya</span>
                {profileData?.activeVouchers !== undefined && <span className={styles.menuValue}>{profileData.activeVouchers > 0 ? `${profileData.activeVouchers} Aktif` : '0'}</span>}
                <ArrowRight size={16} color="#CBD5E1" />
              </Link>
              <Link href="/notifikasi" className={styles.menuItem} style={{ textDecoration: 'none' }}>
                <div className={styles.menuIconBox}>
                  <Bell size={20} color="#475569" />
                </div>
                <span className={styles.menuLabel}>Notifikasi</span>
                {profileData?.unreadNotifications !== undefined && <span className={styles.menuValue} style={{ color: profileData.unreadNotifications > 0 ? '#EF4444' : 'var(--text-muted)' }}>{profileData.unreadNotifications > 0 ? `${profileData.unreadNotifications} Baru` : 'Kosong'}</span>}
                <ArrowRight size={16} color="#CBD5E1" />
              </Link>
            </div>
          </section>
          <section className={styles.menuSection}>
            <h4 className={styles.sectionTitle}>LAINNYA</h4>
            <div className={styles.menuCard}>
              <div className={styles.menuItem}>
                <div className={styles.menuIconBox}>
                  <Globe size={20} color="#475569" />
                </div>
                <span className={styles.menuLabel}>Bahasa</span>
                {profileData?.language && <span className={styles.menuValue} style={{ color: 'var(--text-muted)' }}>{profileData.language}</span>}
                <ArrowRight size={16} color="#CBD5E1" />
              </div>
              <div className={styles.menuItem}>
                <div className={styles.menuIconBox}>
                  <Shield size={20} color="#475569" />
                </div>
                <span className={styles.menuLabel}>Keamanan & Privasi</span>
                <ArrowRight size={16} color="#CBD5E1" />
              </div>
            </div>
          </section>
        </div>
        <BottomNav />
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Keluar dari Akun?</h3>
            <p>Anda harus login kembali untuk mengakses data pesanan dan alamat tersimpan.</p>
            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setShowLogoutModal(false)}>
                Batal
              </button>
              <button className={styles.btnLogout} onClick={handleLogout}>
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
