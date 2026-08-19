import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/lib/schema';
import { verifySessionToken } from '@/lib/session';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { ArrowLeft, Bell } from 'lucide-react';
import styles from './notifikasi.module.css';
import NotificationList from './NotificationList';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export default async function NotifikasiPage() {
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

  const notificationsList = await db.query.notifications.findMany({
    where: eq(schema.notifications.userId, userId),
    orderBy: (notifications, { asc, desc }) => [asc(notifications.isRead), desc(notifications.createdAt)]
  });

  const serialized = notificationsList.map(n => ({
    ...n,
    createdAt: n.createdAt.toISOString()
  }));

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/profil" className={styles.backBtn}>
          <ArrowLeft size={24} />
        </Link>
        <h1 className={styles.title}>Notifikasi</h1>
      </header>

      <div className={styles.content}>
        {serialized.length === 0 ? (
          <div className={styles.emptyState}>
            <Bell size={48} color="#CBD5E1" />
            <h3>Tidak ada notifikasi</h3>
            <p>Anda belum memiliki pesan atau pemberitahuan baru.</p>
          </div>
        ) : (
          <NotificationList initialData={serialized} />
        )}
      </div>
    </main>
  );
}
