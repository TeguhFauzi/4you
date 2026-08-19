'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, LogIn, CheckCircle } from 'lucide-react';
import { setEncryptedItem } from '@/lib/client-encryption';
import styles from './login.module.css';
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        await setEncryptedItem('user', JSON.stringify(data.user));
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/profil');
        }, 1800);
      } else {
        setErrorMsg(data.error || 'Login gagal, periksa email dan kata sandi Anda.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className={styles.container}>
      {showSuccess && (
        <div className={styles.successOverlay}>
          <div className={styles.successPopup}>
            <div className={styles.successIconCircle}>
              <CheckCircle size={48} color="#fff" />
            </div>
            <h2 className={styles.successTitle}>Login Berhasil!</h2>
            <p className={styles.successText}>Selamat datang kembali 👋</p>
            <div className={styles.successBar}></div>
          </div>
        </div>
      )}
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <ArrowLeft size={20} />
        </button>
        <h1 className={styles.title}>Selamat Datang</h1>
        <p className={styles.subtitle}>
          Masuk ke akun Anda untuk mengakses layanan kebersihan terbaik dari kami.
        </p>
      </header>
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <div className={styles.inputWrapper}>
            <div className={styles.inputIcon}>
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              className={styles.input}
              placeholder="Masukkan email Anda" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Kata Sandi</label>
          <div className={styles.inputWrapper}>
            <div className={styles.inputIcon}>
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              className={styles.input}
              placeholder="Masukkan kata sandi" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
        <Link href="#" className={styles.forgotPassword}>Lupa Kata Sandi?</Link>
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Memproses...' : (
            <>Masuk <LogIn size={18} style={{ marginLeft: '8px' }} /></>
          )}
        </button>
      </form>
      <div className={styles.divider}>ATAU</div>
      <div className={styles.socialLogin}>
        <button type="button" className={styles.socialBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
      </div>
      <footer className={styles.footer}>
        Belum punya akun? <Link href="#" className={styles.registerLink}>Daftar Sekarang</Link>
      </footer>
    </main>
  );
}
