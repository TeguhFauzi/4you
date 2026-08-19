import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../lib/schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const { services } = schema;

async function updateImages() {
  console.log('Updating images to be relevant...');

  // 1. Kamar Tidur (Bedroom)
  await db.update(services)
    .set({ imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80' })
    .where(eq(services.name, 'Pembersihan Kamar Tidur'));

  // 2. Kamar Mandi (Bathroom)
  await db.update(services)
    .set({ imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80' })
    .where(eq(services.name, 'Pembersihan Kamar Mandi'));

  // 3. Dapur (Kitchen)
  await db.update(services)
    .set({ imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80' })
    .where(eq(services.name, 'Pembersihan Dapur'));

  // 4. Ruang Tamu (Living Room)
  await db.update(services)
    .set({ imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80' })
    .where(eq(services.name, 'Pembersihan Ruang Tamu'));

  // 5. Rumah Full (Whole House)
  await db.update(services)
    .set({ imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80' })
    .where(eq(services.name, 'Paket Bersih Rumah Full'));

  console.log('Update complete!');
  process.exit(0);
}

updateImages().catch((error) => {
  console.error('Error updating data:', error);
  process.exit(1);
});
