'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ClipboardList, User, Heart } from 'lucide-react';
import styles from './BottomNav.module.css';
const navItems = [
  { href: '/', icon: Home, label: 'Beranda' },
  { href: '/layanan', icon: Search, label: 'Layanan' },
  { href: '/donasi', icon: Heart, label: 'Donasi' },
  { href: '/pesanan', icon: ClipboardList, label: 'Pesanan' },
  { href: '/profil', icon: User, label: 'Profil' },
];
export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <Icon size={24} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
