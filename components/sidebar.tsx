"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Unit = {
  id: string
  floor_number: number
  unit_number: string
  status: string
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  available: { color: "#3A7D5A", bg: "#EDF7F2", border: "#B2DECA", label: "Available" },
  sold:      { color: "#9A3A3A", bg: "#FAF0F0", border: "#E8BEBE", label: "Sold" },
  rented:    { color: "#8A6A1A", bg: "#FBF6E8", border: "#E0CFA0", label: "Rented" },
}

export default function UnitsPage() {
  const params = useParams()
  const router = useRouter()
  const buildingId = params.buildingId as string
  const companyId = params.companyId as string

  const [units, setUnits] = useState<Unit[]>([])
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null)

  useEffect(() => { fetchUnits() }, [])

  async function fetchUnits() {
    const { data, error } = await supabase
      .from("units")
      .select("*")
      .eq("building_id", buildingId)
    if (error) { console.error(error); return }
    setUnits(data || [])
  }

  async function toggleStatus(unitId: string, currentStatus: string) {
    const newStatus =
      currentStatus === "available" ? "sold" :
      currentStatus === "sold" ? "rented" : "available"

    await supabase.from("units").update({ status: newStatus }).eq("id", unitId)
    fetchUnits()
  }

  const groupedUnits = units.reduce((acc, unit) => {
    if (!acc[unit.floor_number]) acc[unit.floor_number] = []
    acc[unit.floor_number].push(unit)
    return acc
  }, {} as Record<number, Unit[]>)

  const sortedFloors = Object.keys(groupedUnits).map(Number).sort((a, b) => b - a)

  const counts = {
    available: units.filter((u) => u.status === "available").length,
    sold: units.filter((u) => u.status === "sold").length,
    rented: units.filter((u) => u.status === "rented").length,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500&family=Raleway:wght@300;400;500&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#F8F4EE",
        fontFamily: "'Raleway', sans-serif",
        color: "#2C2416",
        padding: "36px 48px 60px",
      }}>

        {/* ── TOP BAR ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <button
              onClick={() => router.push(`/companies/${companyId}/buildings`)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
                color: "#9A7B4F", fontFamily: "'Raleway', sans-serif",
                display: "flex", alignItems: "center", gap: 6, marginBottom: 10, padding: 0,
              }}
            >
              ← Buildings
            </button>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: "#1E1810", lineHeight: 1.1 }}>
              Floor <em style={{ fontStyle: "italic", color: "#9A7B4F" }}>Units</em>
            </h1>
          </div>

          {/* Summary pills */}
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            {(["available", "sold", "rented"] as const).map((s) => (
              <div key={s} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: STATUS_CONFIG[s].bg,
                border: `1px solid ${STATUS_CONFIG[s].border}`,
                borderRadius: 20, padding: "7px 16px",
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_CONFIG[s].color }} />
                <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: STATUS_CONFIG[s].color, fontWeight: 500 }}>
                  {STATUS_CONFIG[s].label}
                </span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 400, color: STATUS_CONFIG[s].color, lineHeight: 1 }}>
                  {counts[s]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ORNAMENT DIVIDER ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "28px 0 32px" }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #E0D6C8, transparent)" }} />
          <div style={{ width: 5, height: 5, background: "#9A7B4F", transform: "rotate(45deg)", opacity: 0.5 }} />
          <span style={{ fontSize: 9.5, letterSpacing: 3, color: "#C4B49A", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {units.length} Total Units · {sortedFloors.length} Floors
          </span>
          <div style={{ width: 5, height: 5, background: "#9A7B4F", transform: "rotate(45deg)", opacity: 0.5 }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, #E0D6C8, transparent)" }} />
        </div>

        {/* ── HINT ── */}
        <p style={{ fontSize: 10, letterSpacing: 1.5, color: "#C4B49A", textTransform: "uppercase", marginBottom: 32 }}>
          Click any unit to cycle its status
        </p>

        {/* ── FLOORS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {sortedFloors.map((floor, fi) => (
            <div
              key={floor}
              style={{ animation: `fadeUp 0.5s ease ${fi * 80}ms both` }}
            >
              {/* Floor label */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{
                  background: "#fff", border: "1px solid #EDE6DA", borderRadius: 3,
                  padding: "5px 14px", display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 1px 4px #00000008",
                }}>
                  <span style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "#9A7B4F", fontWeight: 500 }}>Floor</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: "#1E1810", lineHeight: 1 }}>{floor}</span>
                </div>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #EDE6DA, transparent)" }} />
                <span style={{ fontSize: 9, letterSpacing: 2, color: "#C4B49A", textTransform: "uppercase" }}>
                  {groupedUnits[floor].length} units
                </span>
              </div>

              {/* Units grid */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {groupedUnits[floor].map((unit) => {
                  const cfg = STATUS_CONFIG[unit.status] || STATUS_CONFIG.available
                  const isHovered = hoveredUnit === unit.id

                  return (
                    <div
                      key={unit.id}
                      onClick={() => toggleStatus(unit.id, unit.status)}
                      onMouseEnter={() => setHoveredUnit(unit.id)}
                      onMouseLeave={() => setHoveredUnit(null)}
                      style={{
                        width: 72, height: 72,
                        background: isHovered ? cfg.bg : "#fff",
                        borderTop: `2px solid ${cfg.color}`,
                        borderRight: `1px solid ${isHovered ? cfg.color : cfg.border}`,
                        borderBottom: `1px solid ${isHovered ? cfg.color : cfg.border}`,
                        borderLeft: `1px solid ${isHovered ? cfg.color : cfg.border}`,
                        borderRadius: 4,
                        cursor: "pointer",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 4,
                        transform: isHovered ? "translateY(-3px)" : "none",
                        boxShadow: isHovered ? `0 8px 24px ${cfg.color}22` : "0 1px 4px #00000008",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 16, fontWeight: 400,
                        color: isHovered ? cfg.color : "#2C2416",
                        lineHeight: 1,
                      }}>
                        {unit.unit_number}
                      </span>
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: cfg.color, opacity: 0.7,
                      }} />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── EMPTY STATE ── */}
        {units.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#C4B49A" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: "#A89880", marginBottom: 8 }}>No units found</p>
            <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>This building has no units yet</p>
          </div>
        )}

      </div>
    </>
  )
}