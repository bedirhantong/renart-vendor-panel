import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, TrendingUp } from 'lucide-react'

interface TopProductsCardProps {
  topProducts: Array<{
    id: string
    name: string
    favoriteCount: number
  }>
}

export function TopProductsCard({ topProducts }: TopProductsCardProps) {
  if (!topProducts || topProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Products
          </CardTitle>
          <CardDescription>
            Most favorited products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">
              No products with favorites yet
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Products
        </CardTitle>
        <CardDescription>
          Most favorited products by customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {product.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {product.favoriteCount}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
