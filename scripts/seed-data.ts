import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../lib/schema';
import crypto from 'crypto';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const { services, orders, donations } = schema;

async function seed() {
  console.log('Seeding data...');

  // Seed Services
  const newServices = [
    { id: crypto.randomUUID(), name: 'Pembersihan Kamar Tidur', description: 'Pembersihan menyeluruh untuk kamar tidur termasuk debu dan vakum.', price: 150000, imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80', isActive: true },
    { id: crypto.randomUUID(), name: 'Pembersihan Kamar Mandi', description: 'Sikat kerak, lantai, dan disinfeksi toilet.', price: 120000, imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80', isActive: true },
    { id: crypto.randomUUID(), name: 'Pembersihan Dapur', description: 'Pembersihan area kompor, sink, dan meja dapur.', price: 200000, imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80', isActive: true },
    { id: crypto.randomUUID(), name: 'Pembersihan Ruang Tamu', description: 'Vakum sofa, pel lantai, dan bersihkan perabotan.', price: 180000, imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80', isActive: true },
    { id: crypto.randomUUID(), name: 'Paket Bersih Rumah Full', description: 'Pembersihan semua ruangan dalam rumah (Max 100m2).', price: 600000, imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80', isActive: true },
  ];
  await db.insert(services).values(newServices);
  console.log('5 Services seeded.');

  // Seed Orders
  const serviceId1 = newServices[0].id;
  const serviceId2 = newServices[1].id;
  const newOrders = [
    { id: crypto.randomUUID(), serviceId: serviceId1, serviceName: newServices[0].name, customerName: 'Budi Santoso', customerPhone: '081234567890', address: 'Jl. Merdeka No. 1, Jakarta', scheduledDate: '2026-08-25', totalPrice: 150000, status: 'upcoming', notes: 'Bawa vakum sendiri' },
    { id: crypto.randomUUID(), serviceId: serviceId2, serviceName: newServices[1].name, customerName: 'Ani Yudhoyono', customerPhone: '081298765432', address: 'Jl. Sudirman No. 10, Bandung', scheduledDate: '2026-08-26', totalPrice: 120000, status: 'completed', notes: '' },
    { id: crypto.randomUUID(), serviceId: serviceId1, serviceName: newServices[0].name, customerName: 'Cakra Khan', customerPhone: '085612341234', address: 'Perumahan Indah, Surabaya', scheduledDate: '2026-08-27', totalPrice: 150000, status: 'upcoming', notes: 'Rumah di ujung jalan' },
    { id: crypto.randomUUID(), serviceId: newServices[4].id, serviceName: newServices[4].name, customerName: 'Dina Lorenza', customerPhone: '089912312312', address: 'Jl. Pahlawan No. 45, Semarang', scheduledDate: '2026-08-28', totalPrice: 600000, status: 'cancelled', notes: 'Batal karena jadwal bentrok' },
    { id: crypto.randomUUID(), serviceId: newServices[2].id, serviceName: newServices[2].name, customerName: 'Eko Patrio', customerPhone: '087766554433', address: 'Jl. Ahmad Yani, Medan', scheduledDate: '2026-08-29', totalPrice: 200000, status: 'upcoming', notes: 'Fokus kompor yang banyak noda minyak' },
  ];
  await db.insert(orders).values(newOrders);
  console.log('5 Orders seeded.');

  // Seed Donations
  const newDonations = [
    { id: crypto.randomUUID(), donorName: 'Fajar Alfian', donorType: 'customer', amount: 50000, message: 'Semangat terus kerjanya!' },
    { id: crypto.randomUUID(), donorName: 'Ginting', donorType: 'customer', amount: 100000, message: 'Terima kasih bersih-bersihnya luar biasa.' },
    { id: crypto.randomUUID(), donorName: 'Hendra Setiawan', donorType: 'customer', amount: 25000, message: 'Buat beli kopi mas.' },
    { id: crypto.randomUUID(), donorName: 'Iqbal', donorType: 'cleaner', amount: 10000, message: 'Sedekah jumat' },
    { id: crypto.randomUUID(), donorName: 'Jonatan Christie', donorType: 'customer', amount: 75000, message: 'Sangat memuaskan pelayanannya.' },
  ];
  await db.insert(donations).values(newDonations);
  console.log('5 Donations seeded.');

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding data:', error);
  process.exit(1);
});
