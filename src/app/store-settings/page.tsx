'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DashboardLayout } from '@/components/shared/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/useStore'
import { vendorApi } from '@/lib/api/client'
import { toast } from 'sonner'
import { Settings, Store, Loader2, Save } from 'lucide-react'

const storeSettingsSchema = z.object({
  name: z.string().min(1, 'Store name is required'),
  description: z.string().optional(),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>

export default function StoreSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { store, updateStore } = useAuthStore()

  const form = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      name: store?.name || '',
      description: store?.description || '',
      logoUrl: store?.logoUrl || '',
    },
  })

  const onSubmit = async (data: StoreSettingsFormData) => {
    setIsLoading(true)
    
    try {
      const response = await vendorApi.updateProfile(data)
      
      // Update store in auth state
      updateStore(data)
      
      toast.success('Store settings updated successfully!')
    } catch (error: any) {
      console.error('Update store settings error:', error)
      toast.error(error.message || 'Failed to update store settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
          <p className="text-muted-foreground">
            Manage your store information and preferences
          </p>
        </div>

        {/* Store Information */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Information
            </CardTitle>
            <CardDescription>
              Update your store details that customers will see
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Store Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Store Name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tell customers about your store..."
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Logo URL */}
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/logo.png"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Current Store Status */}
        {store && (
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Current Store Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <p className="text-sm font-medium">Store Name</p>
                  <p className="text-sm text-muted-foreground">{store.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{store.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={store.isActive ? 'default' : 'secondary'}>
                    {store.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Settings */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Additional account management options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="mb-4">
                For security reasons, some account settings like password changes and 
                account deletion require additional verification.
              </p>
              <div className="space-y-2">
                <div>• To change your password, use the "Change Password" option in the user menu</div>
                <div>• For account deletion or major changes, please contact support</div>
                <div>• Business information changes may require verification</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
