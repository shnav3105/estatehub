"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Building = {
  id: string
  name: string
  total_floors: number
  flats_per_floor: number
  created_at: string
}

export default function BuildingsPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.companyId as string

  const [buildings, setBuildings] = useState<Building[]>([])
  const [name, setName] = useState("")
  const [floors, setFloors] = useState(1)
  const [flats, setFlats] = useState(1)

  useEffect(() => {
    fetchBuildings()
  }, [])

  async function fetchBuildings() {
    const { data, error } = await supabase
      .from("buildings")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setBuildings(data || [])
  }

  async function createBuilding() {
    if (!name.trim()) return

    const { data, error } = await supabase
      .from("buildings")
      .insert({
        name,
        total_floors: floors,
        flats_per_floor: flats,
        company_id: companyId
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      return
    }

    await generateUnits(data.id, floors, flats)

    setName("")
    setFloors(1)
    setFlats(1)

    fetchBuildings()
  }

  async function generateUnits(
    buildingId: string,
    totalFloors: number,
    flatsPerFloor: number
  ) {
    const units = []

    for (let floor = 1; floor <= totalFloors; floor++) {
      for (let i = 0; i < flatsPerFloor; i++) {
        units.push({
          building_id: buildingId,
          floor_number: floor,
          unit_number: `${floor * 100 + i}`,
          status: "available"
        })
      }
    }

    await supabase.from("units").insert(units)
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Buildings</h1>

      {/* Create Building Form */}
      <div className="flex gap-4 items-center">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Building Name"
          className="border p-2 rounded"
        />

        <input
          type="number"
          value={floors}
          onChange={(e) => setFloors(Number(e.target.value))}
          placeholder="Floors"
          className="border p-2 rounded w-24"
        />

        <input
          type="number"
          value={flats}
          onChange={(e) => setFlats(Number(e.target.value))}
          placeholder="Flats"
          className="border p-2 rounded w-24"
        />

        <button
          onClick={createBuilding}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Buildings List */}
      <div className="space-y-3">
        {buildings.map((building) => (
          <div
            key={building.id}
            onClick={() =>
              router.push(
                `/companies/${companyId}/buildings/${building.id}/units`
              )
            }
            className="border p-4 rounded cursor-pointer hover:bg-gray-100 transition"
          >
            <p className="font-semibold">{building.name}</p>
            <p className="text-sm text-gray-500">
              Floors: {building.total_floors} | Flats per floor: {building.flats_per_floor}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}