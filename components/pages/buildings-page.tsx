'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BuildingCard from '@/components/building-card'
import AddBuildingModal from '@/components/modals/add-building-modal'

interface Building {
  id: string
  name: string
  address: string
  company: string
  type: string
  units: number
  occupancy: number
  createdAt: string
}

const MOCK_BUILDINGS: Building[] = [
  {
    id: '1',
    name: 'Metropolitan Tower',
    address: '123 Main St, New York, NY',
    company: 'Downtown Properties',
    type: 'Commercial',
    units: 45,
    occupancy: 38,
    createdAt: '2023-05-10',
  },
  {
    id: '2',
    name: 'Riverside Plaza',
    address: '456 River Rd, New York, NY',
    company: 'Downtown Properties',
    type: 'Mixed Use',
    units: 32,
    occupancy: 28,
    createdAt: '2023-08-15',
  },
  {
    id: '3',
    name: 'Park Residences',
    address: '789 Park Ave, Los Angeles, CA',
    company: 'Metro Real Estate',
    type: 'Residential',
    units: 60,
    occupancy: 52,
    createdAt: '2023-03-20',
  },
  {
    id: '4',
    name: 'Tech Hub Center',
    address: '321 Innovation Dr, San Francisco, CA',
    company: 'Metro Real Estate',
    type: 'Commercial',
    units: 50,
    occupancy: 45,
    createdAt: '2023-11-05',
  },
  {
    id: '5',
    name: 'The Skyline',
    address: '654 Sky Dr, Chicago, IL',
    company: 'Skyline Developments',
    type: 'Residential',
    units: 28,
    occupancy: 24,
    createdAt: '2024-01-12',
  },
]

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>(MOCK_BUILDINGS)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddBuilding = (newBuilding: Omit<Building, 'id' | 'createdAt' | 'occupancy'>) => {
    const building: Building = {
      ...newBuilding,
      id: Date.now().toString(),
      occupancy: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setBuildings([...buildings, building])
    setIsModalOpen(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-foreground">Buildings</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Building
          </Button>
        </div>
        <p className="text-muted-foreground">Monitor your properties and occupancy rates</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings.map((building) => (
          <BuildingCard key={building.id} building={building} />
        ))}
      </div>

      {/* Modal */}
      <AddBuildingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddBuilding}
      />
    </div>
  )
}
