'use client'

import { useState } from 'react'
import UnitCard from '@/components/unit-card'

interface Unit {
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

const MOCK_UNITS: Unit[] = [
  {
    id: '1',
    name: 'Unit 101',
    building: 'Metropolitan Tower',
    floor: 1,
    status: 'rented',
    price: 2500,
    area: 850,
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: '2',
    name: 'Unit 102',
    building: 'Metropolitan Tower',
    floor: 1,
    status: 'available',
    price: 2800,
    area: 950,
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: '3',
    name: 'Unit 201',
    building: 'Metropolitan Tower',
    floor: 2,
    status: 'rented',
    price: 3000,
    area: 1000,
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: '4',
    name: 'Unit 202',
    building: 'Metropolitan Tower',
    floor: 2,
    status: 'sold',
    price: 550000,
    area: 1000,
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: '5',
    name: 'Unit 301',
    building: 'Riverside Plaza',
    floor: 3,
    status: 'available',
    price: 1900,
    area: 700,
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: '6',
    name: 'Unit 302',
    building: 'Riverside Plaza',
    floor: 3,
    status: 'rented',
    price: 2000,
    area: 750,
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: '7',
    name: 'Unit 401',
    building: 'Riverside Plaza',
    floor: 4,
    status: 'available',
    price: 2200,
    area: 800,
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    id: '8',
    name: 'Unit 402',
    building: 'Riverside Plaza',
    floor: 4,
    status: 'sold',
    price: 420000,
    area: 800,
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    id: '9',
    name: 'Penthouse',
    building: 'Park Residences',
    floor: 15,
    status: 'rented',
    price: 5000,
    area: 2500,
    bedrooms: 4,
    bathrooms: 3,
  },
  {
    id: '10',
    name: 'Unit 501',
    building: 'Park Residences',
    floor: 5,
    status: 'available',
    price: 3200,
    area: 1200,
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: '11',
    name: 'Unit 502',
    building: 'Park Residences',
    floor: 5,
    status: 'rented',
    price: 3100,
    area: 1150,
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: '12',
    name: 'Unit 601',
    building: 'Tech Hub Center',
    floor: 6,
    status: 'sold',
    price: 650000,
    area: 1400,
    bedrooms: 3,
    bathrooms: 2,
  },
]

export default function UnitsPage() {
  const [units] = useState<Unit[]>(MOCK_UNITS)
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'rented' | 'sold'>('all')

  const filteredUnits =
    statusFilter === 'all' ? units : units.filter((unit) => unit.status === statusFilter)

  const stats = {
    total: units.length,
    available: units.filter((u) => u.status === 'available').length,
    rented: units.filter((u) => u.status === 'rented').length,
    sold: units.filter((u) => u.status === 'sold').length,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Units</h1>
        <p className="text-muted-foreground">Browse and manage individual units across all buildings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Units"
          value={stats.total}
          color="bg-blue-100 text-blue-800"
        />
        <StatCard
          label="Available"
          value={stats.available}
          color="bg-green-100 text-green-800"
        />
        <StatCard
          label="Rented"
          value={stats.rented}
          color="bg-purple-100 text-purple-800"
        />
        <StatCard
          label="Sold"
          value={stats.sold}
          color="bg-amber-100 text-amber-800"
        />
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {(['all', 'available', 'rented', 'sold'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === filter
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUnits.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>

      {filteredUnits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No units found</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <span className={`inline-block w-8 h-8 rounded-lg ${color}`} />
      </div>
    </div>
  )
}
