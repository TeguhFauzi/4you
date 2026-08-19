import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../lib/schema';
import { hashPassword } from '../lib/auth';
import { v4 as uuidv4 } from 'uuid'; 
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });
async function seed() {
  console.log('Seeding admin user...');
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'changeme123';
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email)
    });
    if (existingUser) {
      console.log('Admin user already exists!');
      return;
    }
    const hashedPassword = hashPassword(password);
    await db.insert(schema.users).values({
      id: Date.now().toString(),
      email: email,
      passwordHash: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user seeded successfully!');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}
seed().catch(console.error);
