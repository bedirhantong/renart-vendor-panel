import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  weight: z.number().positive('Weight must be a positive number'),
  popularityScore: z.number().min(0).max(10, 'Popularity score must be between 0 and 10'),
  colors: z.array(z.enum(['yellow', 'white', 'rose'])).min(1, 'At least one color is required'),
})

export type ProductFormData = z.infer<typeof productSchema>

// Store settings schema
export const storeSettingsSchema = z.object({
  name: z.string().min(1, 'Store name is required'),
  description: z.string().optional(),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>
