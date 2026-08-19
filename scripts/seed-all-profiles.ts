import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../lib/schema';
import crypto from 'crypto';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seedAllProfiles() {
  console.log('Seeding profile data for ALL users...');
  try {
    const allUsers = await db.query.users.findMany();
    
    if (allUsers.length === 0) {
      console.log('No users found in the database.');
      return;
    }

    for (const user of allUsers) {
      const userId = user.id;
      console.log(`Seeding for user: ${user.email}`);

      // Check if data already exists to avoid unique constraint errors (e.g. wallet)
      const existingWallet = await db.query.userWallets.findFirst({ where: (wallets, { eq }) => eq(wallets.userId, userId) });
      
      if (!existingWallet) {
        // 1. Seed Addresses
        await db.insert(schema.userAddresses).values([
          { id: crypto.randomUUID(), userId, label: 'Rumah', fullAddress: 'Jl. Merdeka No. 1, Jakarta Selatan', isPrimary: true },
          { id: crypto.randomUUID(), userId, label: 'Kantor', fullAddress: 'Gedung Sudirman Lt. 10, Jakarta Pusat', isPrimary: false }
        ]);

        // 2. Seed Wallet
        await db.insert(schema.userWallets).values({
          id: crypto.randomUUID(),
          userId,
          balance: 150000
        });

        // 3. Seed Vouchers
        await db.insert(schema.userVouchers).values([
          { id: crypto.randomUUID(), userId, code: 'BERSIH10', discountAmount: 10000, isUsed: false },
          { id: crypto.randomUUID(), userId, code: 'NEWUSER50', discountAmount: 50000, isUsed: true }
        ]);

        // 4. Seed Notifications
        await db.insert(schema.notifications).values([
          { id: crypto.randomUUID(), userId, title: 'Promo Spesial', message: 'Diskon 20% untuk cuci AC hari ini!', isRead: false },
          { id: crypto.randomUUID(), userId, title: 'Pesanan Selesai', message: 'Pembersihan Kamar Tidur telah selesai.', isRead: true },
          { id: crypto.randomUUID(), userId, title: 'Selamat Datang', message: 'Terima kasih telah bergabung dengan Jasa Bersih.', isRead: false }
        ]);

        // 5. Seed Settings
        await db.insert(schema.userSettings).values({
          userId,
          language: 'ID',
          marketingEmails: true
        });
        console.log(`- Data inserted successfully for ${user.email}`);
      } else {
        console.log(`- Data already exists for ${user.email}, skipping.`);
      }
    }

    console.log('Finished seeding all profiles!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding profile data:', error);
    process.exit(1);
  }
}

seedAllProfiles();
