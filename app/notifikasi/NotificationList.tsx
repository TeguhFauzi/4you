'use client';

import { useState } from 'react';
import { Bell, MessageSquare, Info, CheckCircle, Tag as TagIcon } from 'lucide-react';
import styles from './notifikasi.module.css';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function getNotificationIcon(title: string, isRead: boolean) {
  const color = isRead ? "#3B82F6" : "#FFFFFF";
  if (title.toLowerCase().includes('selesai')) return <CheckCircle size={24} color={color} />;
  if (title.toLowerCase().includes('promo')) return <TagIcon size={24} color={color} />;
  if (title.toLowerCase().includes('pesan')) return <MessageSquare size={24} color={color} />;
  return <Info size={24} color={color} />;
}

export default function NotificationList({ initialData }: { initialData: Notification[] }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialData);

  const handleMarkAsRead = async (id: string) => {
    const target = notifications.find(n => n.id === id);
    if (!target || target.isRead) return;

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );

    try {
      await fetch('/api/user/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: false } : n)
      );
    }
  };

  return (
    <div className={styles.notificationList}>
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`${styles.notificationCard} ${!notif.isRead ? styles.notificationUnread : ''}`}
          onClick={() => handleMarkAsRead(notif.id)}
          style={{ cursor: !notif.isRead ? 'pointer' : 'default' }}
        >
          <div className={styles.iconWrapper}>
            {getNotificationIcon(notif.title, notif.isRead)}
          </div>
          <div className={styles.textContent}>
            <h3 className={styles.notificationTitle}>
              {notif.title}
              {!notif.isRead && <span className={styles.unreadDot}></span>}
            </h3>
            <p className={styles.notificationMessage}>{notif.message}</p>
            <span className={styles.timestamp}>
              {new Date(notif.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
