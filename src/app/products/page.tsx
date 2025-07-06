'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/shared/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/useStore'
import { vendorApi } from '@/lib/api/client'
import { toast } from 'sonner'
import { 
  PlusCircle, 
  Package, 
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  weight: number
  popularity_score: number
  is_active: boolean
  created_at: string
  calculatedPrice: {
    usd: number
    try: number
  }
  product_images: Array<{
    id: string
    color: string
    image_url: string
  }>
}

interface ProductsData {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function ProductsPage() {
  const [productsData, setProductsData] = useState<ProductsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  const fetchProducts = async (params: Record<string, any> = {}) => {
    try {
      setIsLoading(true)
      const queryParams = {
        page: 1,
        limit: 10,
        ...params
      }

      if (search) {
        queryParams.search = search
      }

      if (filter !== 'all') {
        queryParams.isActive = filter === 'active'
      }

      const response = await vendorApi.getProducts(queryParams)
      setProductsData(response.data || response.message)
    } catch (error: any) {
      console.error('Products fetch error:', error)
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [search, filter])

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await vendorApi.deleteProduct(productId)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error: any) {
      console.error('Delete product error:', error)
      toast.error('Failed to delete product')
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">
                Manage your jewelry products
              </p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-0 pb-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your jewelry products and inventory
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link href="/products/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
            <Button variant="outline" onClick={() => fetchProducts()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('active')}
                >
                  Active
                </Button>
                <Button
                  variant={filter === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('inactive')}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {productsData && productsData.products.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productsData.products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>
                        Weight: {product.weight}g • Score: {product.popularity_score}/10
                      </CardDescription>
                    </div>
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Product Image */}
                  {product.product_images && product.product_images.length > 0 && (
                    <div className="mb-4">
                      <img
                        src={product.product_images[0].image_url}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}

                  {/* Price */}
                  {product.calculatedPrice && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-lg font-semibold">
                        ${product.calculatedPrice.usd}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₺{product.calculatedPrice.try}
                      </p>
                    </div>
                  )}

                  {/* Colors */}
                  {product.product_images && product.product_images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Available Colors</p>
                      <div className="flex gap-1">
                        {product.product_images.map((image) => (
                          <Badge key={image.id} variant="outline" className="text-xs">
                            {image.color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/products/${product.id}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/products/${product.id}/edit`}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Package className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {search || filter !== 'all' 
                  ? "No products match your current filters."
                  : "You haven't added any products yet."
                }
              </p>
              <Button asChild>
                <Link href="/products/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {productsData && productsData.pagination.pages > 1 && (
          <Card>
            <CardContent className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {productsData.pagination.page} of {productsData.pagination.pages}
                </span>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
