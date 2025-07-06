import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Eye, 
  EyeOff, 
  Heart, 
  TrendingUp, 
  Clock,
  DollarSign 
} from 'lucide-react'

interface StatsCardsProps {
  statistics: {
    products: {
      total: number
      active: number
      inactive: number
      recent: number
    }
    favorites: {
      total: number
    }
  }
}

export function StatsCards({ statistics }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Products',
      value: statistics.products.total,
      icon: Package,
      description: 'All products in your store',
      badge: null,
    },
    {
      title: 'Active Products',
      value: statistics.products.active,
      icon: Eye,
      description: 'Visible to customers',
      badge: {
        text: 'Live',
        variant: 'default' as const,
      },
    },
    {
      title: 'Inactive Products',
      value: statistics.products.inactive,
      icon: EyeOff,
      description: 'Hidden from customers',
      badge: statistics.products.inactive > 0 ? {
        text: 'Needs attention',
        variant: 'secondary' as const,
      } : null,
    },
    {
      title: 'Total Favorites',
      value: statistics.favorites.total,
      icon: Heart,
      description: 'Customer favorites',
      badge: null,
    },
    {
      title: 'Recent Products',
      value: statistics.products.recent,
      icon: Clock,
      description: 'Added in last 30 days',
      badge: statistics.products.recent > 0 ? {
        text: 'New',
        variant: 'outline' as const,
      } : null,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {card.badge && (
                <Badge variant={card.badge.variant}>
                  {card.badge.text}
                </Badge>
              )}
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
