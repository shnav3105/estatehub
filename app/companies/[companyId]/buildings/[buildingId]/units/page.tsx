"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Unit = {
  id: string
  floor_number: number
  unit_number: string
  status: string
}

export default function UnitsPage() {
  const params = useParams()
  const buildingId = params.buildingId as string

  const [units, setUnits] = useState<Unit[]>([])

  useEffect(() => {
    fetchUnits()
  }, [])

  async function fetchUnits() {
    const { data, error } = await supabase
      .from("units")
      .select("*")
      .eq("building_id", buildingId)

    if (error) {
      console.error(error)
      return
    }

    setUnits(data || [])
  }

  async function toggleStatus(unitId: string, currentStatus: string) {
    const newStatus =
      currentStatus === "available"
        ? "sold"
        : currentStatus === "sold"
        ? "rented"
        : "available"

    await supabase
      .from("units")
      .update({ status: newStatus })
      .eq("id", unitId)

    fetchUnits()
  }

  const groupedUnits = units.reduce((acc, unit) => {
    if (!acc[unit.floor_number]) {
      acc[unit.floor_number] = []
    }
    acc[unit.floor_number].push(unit)
    return acc
  }, {} as Record<number, Unit[]>)

  const sortedFloors = Object.keys(groupedUnits)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Units</h1>

      {sortedFloors.map((floor) => (
        <div key={floor}>
          <h2 className="font-semibold mb-2">Floor {floor}</h2>

          <div className="flex gap-3 flex-wrap">
            {groupedUnits[floor].map((unit) => (
              <div
                key={unit.id}
                onClick={() => toggleStatus(unit.id, unit.status)}
                className={`px-4 py-2 rounded border cursor-pointer
                  ${
                    unit.status === "available"
                      ? "bg-green-100"
                      : unit.status === "sold"
                      ? "bg-red-100"
                      : "bg-yellow-100"
                  }
                `}
              >
                {unit.unit_number}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}