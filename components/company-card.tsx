'use client'

import { Mail, Phone, MapPin, Building } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface CompanyCardProps {
  company: {
    id: string
    name: string
    email: string
    phone: string
    address: string
    buildings: number
    createdAt: string
  }
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {company.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Joined {new Date(company.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span className="truncate">{company.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{company.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{company.address}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Buildings</span>
            <span className="text-lg font-bold text-primary">{company.buildings}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
