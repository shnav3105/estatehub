'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CompanyCard from '@/components/company-card'
import AddCompanyModal from '@/components/modals/add-company-modal'

interface Company {
  id: string
  name: string
  email: string
  phone: string
  address: string
  buildings: number
  createdAt: string
}

const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Downtown Properties',
    email: 'contact@downtown.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY',
    buildings: 8,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Metro Real Estate',
    email: 'info@metro.com',
    phone: '+1 (555) 987-6543',
    address: '456 Park Ave, Los Angeles, CA',
    buildings: 12,
    createdAt: '2023-06-20',
  },
  {
    id: '3',
    name: 'Skyline Developments',
    email: 'hello@skyline.com',
    phone: '+1 (555) 456-7890',
    address: '789 Sky Dr, Chicago, IL',
    buildings: 5,
    createdAt: '2024-02-10',
  },
]

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddCompany = (newCompany: Omit<Company, 'id' | 'createdAt' | 'buildings'>) => {
    const company: Company = {
      ...newCompany,
      id: Date.now().toString(),
      buildings: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setCompanies([...companies, company])
    setIsModalOpen(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-foreground">Companies</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Company
          </Button>
        </div>
        <p className="text-muted-foreground">Manage your real estate companies and portfolios</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {/* Modal */}
      <AddCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCompany}
      />
    </div>
  )
}
