'use client'

import { MapPin, Grid2x2, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface BuildingCardProps {
  building: {
    id: string
    name: string
    address: string
    company: string
    type: string
    units: number
    occupancy: number
    createdAt: string
  }
}

export default function BuildingCard({ building }: BuildingCardProps) {
  const occupancyPercentage = (building.occupancy / building.units) * 100

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500/20 text-green-400 dark:bg-green-500/20 dark:text-green-400'
    if (percentage >= 70) return 'bg-blue-500/20 text-blue-400 dark:bg-blue-500/20 dark:text-blue-400'
    if (percentage >= 50) return 'bg-amber-500/20 text-amber-400 dark:bg-amber-500/20 dark:text-amber-400'
    return 'bg-red-500/20 text-red-400 dark:bg-red-500/20 dark:text-red-400'
  }

  const getStatusLabel = (percentage: number) => {
    if (percentage >= 90) return 'Excellent'
    if (percentage >= 70) return 'Good'
    if (percentage >= 50) return 'Moderate'
    return 'Low'
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {building.name}
            </h3>
            <p className="text-xs text-muted-foreground">{building.company}</p>
          </div>
          <span className="px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
            {building.type}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{building.address}</span>
        </div>

        {/* Occupancy Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Occupancy</span>
            <span className="font-semibold text-foreground">{occupancyPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Grid2x2 className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Units</p>
              <p className="font-semibold text-foreground">{building.units}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Occupied</p>
              <p className="font-semibold text-foreground">{building.occupancy}</p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="pt-4 border-t border-border">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              occupancyPercentage
            )}`}
          >
            {getStatusLabel(occupancyPercentage)} Occupancy
          </span>
        </div>
      </div>
    </Card>
  )
}
