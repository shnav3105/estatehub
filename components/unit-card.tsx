'use client'

import { Bed, Bath, Maximize2, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface UnitCardProps {
  unit: {
    id: string
    name: string
    building: string
    floor: number
    status: 'available' | 'rented' | 'sold'
    price: number
    area: number
    bedrooms: number
    bathrooms: number
  }
}

export default function UnitCard({ unit }: UnitCardProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-400 dark:bg-green-500/20 dark:text-green-400'
      case 'rented':
        return 'bg-purple-500/20 text-purple-400 dark:bg-purple-500/20 dark:text-purple-400'
      case 'sold':
        return 'bg-amber-500/20 text-amber-400 dark:bg-amber-500/20 dark:text-amber-400'
      default:
        return 'bg-gray-500/20 text-gray-400 dark:bg-gray-500/20 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatPrice = (price: number) => {
    if (unit.status === 'sold') {
      return `$${price.toLocaleString()}`
    }
    return `$${price.toLocaleString()}/mo`
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group h-full flex flex-col">
      <div className="p-4 space-y-3 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {unit.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{unit.building}</span>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyles(
              unit.status
            )}`}
          >
            {getStatusLabel(unit.status)}
          </span>
        </div>

        {/* Price */}
        <div className="border-t border-b border-border py-2">
          <p className="text-sm text-muted-foreground mb-1">Price</p>
          <p className="text-lg font-bold text-primary">{formatPrice(unit.price)}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="flex flex-col items-center gap-1">
            <Bed className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{unit.bedrooms}</span>
            <span className="text-muted-foreground">Beds</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{unit.bathrooms}</span>
            <span className="text-muted-foreground">Baths</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{unit.area}</span>
            <span className="text-muted-foreground">sqft</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-border mt-auto">
          <p className="text-xs text-muted-foreground">Floor {unit.floor}</p>
        </div>
      </div>
    </Card>
  )
}
