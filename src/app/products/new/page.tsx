'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DashboardLayout } from '@/components/shared/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { vendorApi } from '@/lib/api/client'
import { toast } from 'sonner'
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  weight: z.number().positive('Weight must be a positive number'),
  popularityScore: z.number().min(0).max(10, 'Popularity score must be between 0 and 10'),
  isActive: z.boolean().optional().default(true),
  colors: z.array(z.enum(['yellow', 'white', 'rose'])).min(1, 'At least one color is required'),
})

type ProductFormData = z.infer<typeof productSchema>

const colorOptions = [
  { value: 'yellow', label: 'Yellow Gold' },
  { value: 'white', label: 'White Gold' },
  { value: 'rose', label: 'Rose Gold' },
]

export default function AddProductPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const router = useRouter()

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      weight: 0,
      popularityScore: 5,
      isActive: true,
      colors: [],
    },
  })

  const toggleColor = (color: string) => {
    let newColors: string[]
    if (selectedColors.includes(color)) {
      newColors = selectedColors.filter(c => c !== color)
    } else {
      newColors = [...selectedColors, color]
    }
    setSelectedColors(newColors)
    form.setValue('colors', newColors as ('yellow' | 'white' | 'rose')[])
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    
    try {
      const response = await vendorApi.createProduct({
        name: data.name,
        weight: data.weight,
        popularityScore: data.popularityScore,
        colors: data.colors,
      })
      
      toast.success('Product created successfully!')
      router.push('/products')
    } catch (error: any) {
      console.error('Create product error:', error)
      toast.error(error.message || 'Failed to create product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
            <p className="text-muted-foreground">
              Create a new jewelry product for your store
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Fill in the information about your new jewelry product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Golden Heart Necklace"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Weight and Popularity Score */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (grams)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="popularityScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Popularity Score (0-10)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="1"
                            placeholder="5"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Colors */}
                <FormField
                  control={form.control}
                  name="colors"
                  render={() => (
                    <FormItem>
                      <FormLabel>Available Colors</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Select the gold colors available for this product
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {colorOptions.map((color) => (
                              <Button
                                key={color.value}
                                type="button"
                                variant={selectedColors.includes(color.value) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleColor(color.value)}
                                disabled={isLoading}
                              >
                                {selectedColors.includes(color.value) && (
                                  <Plus className="mr-1 h-3 w-3 rotate-45" />
                                )}
                                {color.label}
                              </Button>
                            ))}
                          </div>
                          {selectedColors.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {selectedColors.map((color) => (
                                <Badge key={color} variant="secondary">
                                  {colorOptions.find(c => c.value === color)?.label}
                                  <button
                                    type="button"
                                    onClick={() => toggleColor(color)}
                                    className="ml-1 hover:text-destructive"
                                    disabled={isLoading}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Product
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild disabled={isLoading}>
                    <Link href="/products">
                      Cancel
                    </Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Product Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <strong>Product Name:</strong> Use descriptive names that help customers understand what the product is.
            </div>
            <div>
              <strong>Weight:</strong> Enter the weight in grams. This will be used for price calculations.
            </div>
            <div>
              <strong>Popularity Score:</strong> Rate from 0-10 based on how popular you expect this product to be. Higher scores may improve visibility.
            </div>
            <div>
              <strong>Colors:</strong> Select all available gold colors for this product. You can add product images later for each color.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
