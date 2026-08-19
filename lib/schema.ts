import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
export const services = pgTable('services', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  imageUrl: text('image_url').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  serviceId: text('service_id').references(() => services.id).notNull(),
  serviceName: text('service_name').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  address: text('address').notNull(),
  scheduledDate: text('scheduled_date').notNull(),
  totalPrice: integer('total_price').notNull(),
  status: text('status').default('upcoming').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const donations = pgTable('donations', {
  id: text('id').primaryKey(),
  donorName: text('donor_name').notNull(),
  donorType: text('donor_type').notNull(),
  amount: integer('amount').notNull(),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const adminSettings = pgTable('admin_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userAddresses = pgTable('user_addresses', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  label: text('label').notNull(),
  fullAddress: text('full_address').notNull(),
  isPrimary: boolean('is_primary').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userWallets = pgTable('user_wallets', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).unique().notNull(),
  balance: integer('balance').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userVouchers = pgTable('user_vouchers', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  code: text('code').notNull(),
  discountAmount: integer('discount_amount').notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userSettings = pgTable('user_settings', {
  userId: text('user_id').references(() => users.id).primaryKey(),
  language: text('language').default('ID').notNull(),
  marketingEmails: boolean('marketing_emails').default(true).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
