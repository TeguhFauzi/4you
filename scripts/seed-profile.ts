import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../lib/schema';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seedProfile() {
  console.log('Seeding profile data for admin user...');
  try {
    const email = 'useradmin@mail.com';
    const adminUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });

    if (!adminUser) {
      console.log('Admin user not found. Please run seed-admin.ts first.');
      return;
    }

    const userId = adminUser.id;

    // 1. Seed Addresses
    await db.insert(schema.userAddresses).values([
      { id: crypto.randomUUID(), userId, label: 'Rumah', fullAddress: 'Jl. Merdeka No. 1, Jakarta Selatan', isPrimary: true },
      { id: crypto.randomUUID(), userId, label: 'Kantor', fullAddress: 'Gedung Sudirman Lt. 10, Jakarta Pusat', isPrimary: false }
    ]);
    console.log('- Inserted Addresses');

    // 2. Seed Wallet
    await db.insert(schema.userWallets).values({
      id: crypto.randomUUID(),
      userId,
      balance: 150000
    });
    console.log('- Inserted Wallet Balance');

    // 3. Seed Vouchers
    await db.insert(schema.userVouchers).values([
      { id: crypto.randomUUID(), userId, code: 'BERSIH10', discountAmount: 10000, isUsed: false },
      { id: crypto.randomUUID(), userId, code: 'NEWUSER50', discountAmount: 50000, isUsed: true }
    ]);
    console.log('- Inserted Vouchers');

    // 4. Seed Notifications
    await db.insert(schema.notifications).values([
      { id: crypto.randomUUID(), userId, title: 'Promo Spesial', message: 'Diskon 20% untuk cuci AC hari ini!', isRead: false },
      { id: crypto.randomUUID(), userId, title: 'Pesanan Selesai', message: 'Pembersihan Kamar Tidur telah selesai.', isRead: true },
      { id: crypto.randomUUID(), userId, title: 'Selamat Datang', message: 'Terima kasih telah bergabung dengan Jasa Bersih.', isRead: false }
    ]);
    console.log('- Inserted Notifications');

    // 5. Seed Settings
    await db.insert(schema.userSettings).values({
      userId,
      language: 'ID',
      marketingEmails: true
    });
    console.log('- Inserted Settings');

    console.log('Profile data seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding profile data:', error);
    process.exit(1);
  }
}

seedProfile();
