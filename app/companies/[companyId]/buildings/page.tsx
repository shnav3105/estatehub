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
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => { fetchBuildings() }, [])

  async function fetchBuildings() {
    const { data, error } = await supabase
      .from("buildings")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
    if (error) { console.error(error); return }
    setBuildings(data || [])
  }

  async function createBuilding() {
    if (!name.trim()) return
    setLoading(true)

    const { data, error } = await supabase
      .from("buildings")
      .insert({ name, total_floors: floors, flats_per_floor: flats, company_id: companyId })
      .select()
      .single()

    if (error) { console.error(error); setLoading(false); return }

    await generateUnits(data.id, floors, flats)

    setName("")
    setFloors(1)
    setFlats(1)
    setShowModal(false)
    setLoading(false)
    fetchBuildings()
  }

  async function generateUnits(buildingId: string, totalFloors: number, flatsPerFloor: number) {
    const units = []
    for (let floor = 1; floor <= totalFloors; floor++) {
      for (let i = 0; i < flatsPerFloor; i++) {
        units.push({
          building_id: buildingId,
          floor_number: floor,
          unit_number: `${floor * 100 + i}`,
          status: "available",
        })
      }
    }
    await supabase.from("units").insert(units)
  }

  const filtered = buildings.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalUnits = (b: Building) => b.total_floors * b.flats_per_floor

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500&family=Raleway:wght@300;400;500&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 1; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#F8F4EE",
        fontFamily: "'Raleway', sans-serif",
        color: "#2C2416",
        padding: "36px 48px 60px",
      }}>

        {/* ── TOP BAR ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 0 }}>
          {/* Back + Title */}
          <div>
            <button
              onClick={() => router.push("/companies")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
                color: "#9A7B4F", fontFamily: "'Raleway', sans-serif",
                display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
                padding: 0,
              }}
            >
              ← Companies
            </button>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: "#1E1810", lineHeight: 1.1 }}>
              Your <em style={{ fontStyle: "italic", color: "#9A7B4F" }}>Buildings</em>
            </h1>
          </div>

          {/* Search + Add */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#C4B49A", fontSize: 15, pointerEvents: "none" }}>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search buildings..."
                style={{
                  background: "#fff", border: "1px solid #E0D6C8", borderRadius: 3,
                  padding: "11px 16px 11px 40px", color: "#2C2416",
                  fontFamily: "'Raleway', sans-serif", fontSize: 12, letterSpacing: 0.5,
                  width: 220, outline: "none", boxShadow: "0 1px 4px #00000008",
                }}
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#9A7B4F", color: "#fff", border: "none",
                padding: "11px 24px", fontFamily: "'Raleway', sans-serif",
                fontSize: 11, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase",
                cursor: "pointer", borderRadius: 3, boxShadow: "0 2px 12px #9A7B4F30",
              }}
            >
              + Add Building
            </button>
          </div>
        </div>

        {/* ── ORNAMENT DIVIDER ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "28px 0 32px" }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #E0D6C8, transparent)" }} />
          <div style={{ width: 5, height: 5, background: "#9A7B4F", transform: "rotate(45deg)", opacity: 0.5 }} />
          <span style={{ fontSize: 9.5, letterSpacing: 3, color: "#C4B49A", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {filtered.length} {filtered.length === 1 ? "Building" : "Buildings"}
          </span>
          <div style={{ width: 5, height: 5, background: "#9A7B4F", transform: "rotate(45deg)", opacity: 0.5 }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, #E0D6C8, transparent)" }} />
        </div>

        {/* ── GRID ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#C4B49A" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: "#A89880", marginBottom: 8 }}>No buildings yet</p>
            <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Add your first building to get started</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filtered.map((building, i) => {
              const isHovered = hoveredCard === building.id
              const units = totalUnits(building)
              const created = new Date(building.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

              return (
                <div
                  key={building.id}
                  onClick={() => router.push(`/companies/${companyId}/buildings/${building.id}/units`)}
                  onMouseEnter={() => setHoveredCard(building.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: "#fff",
                    border: `1px solid ${isHovered ? "#D4C8B4" : "#EDE6DA"}`,
                    borderRadius: 4,
                    padding: 28,
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                    boxShadow: isHovered ? "0 16px 48px #00000014" : "0 2px 12px #00000008",
                    transition: "all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
                    animation: `fadeUp 0.55s ease ${i * 120}ms both`,
                  }}
                >
                  {/* Top accent line */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right, #9A7B4F, #9A7B4F44)" }} />

                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    {/* Building icon monogram */}
                    <div style={{
                      width: 46, height: 46, borderRadius: "50%",
                      border: "1px solid #9A7B4F44", background: "#FAF5EC", color: "#9A7B4F",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400,
                    }}>
                      {building.name.charAt(0)}
                    </div>
                    {/* Floors badge */}
                    <span style={{
                      fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                      border: "1px solid #9A7B4F44", padding: "4px 11px", borderRadius: 20,
                      color: "#9A7B4F", background: "#FAF5EC", fontWeight: 500,
                    }}>
                      {building.total_floors} {building.total_floors === 1 ? "Floor" : "Floors"}
                    </span>
                  </div>

                  {/* Name & date */}
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 23, fontWeight: 400, color: "#1E1810", marginBottom: 6, lineHeight: 1.2 }}>
                    {building.name}
                  </h3>
                  <p style={{ fontSize: 10, letterSpacing: 1.5, color: "#C4B49A", textTransform: "uppercase" }}>
                    Added {created}
                  </p>

                  {/* Divider */}
                  <div style={{ height: 1, background: "linear-gradient(to right, #EDE6DA, transparent)", margin: "20px 0" }} />

                  {/* Stats */}
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: "#9A7B4F", lineHeight: 1 }}>
                        {building.total_floors}
                      </div>
                      <div style={{ fontSize: 8.5, letterSpacing: 2, color: "#B4A48A", textTransform: "uppercase", marginTop: 4 }}>Floors</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: "#9A7B4F", lineHeight: 1 }}>
                        {building.flats_per_floor}
                      </div>
                      <div style={{ fontSize: 8.5, letterSpacing: 2, color: "#B4A48A", textTransform: "uppercase", marginTop: 4 }}>Per Floor</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: "#9A7B4F", lineHeight: 1 }}>
                        {units}
                      </div>
                      <div style={{ fontSize: 8.5, letterSpacing: 2, color: "#B4A48A", textTransform: "uppercase", marginTop: 4 }}>Total Units</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{
                    border: `1px solid ${isHovered ? "#9A7B4F" : "#E0D6C8"}`,
                    color: isHovered ? "#9A7B4F" : "#A89880",
                    background: isHovered ? "#FAF5EC" : "transparent",
                    padding: "11px 0", borderRadius: 3,
                    fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "all 0.3s",
                    fontFamily: "'Raleway', sans-serif",
                  }}>
                    View Units <span style={{ fontSize: 14, transform: isHovered ? "translateX(4px)" : "none", transition: "transform 0.3s", display: "inline-block" }}>→</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          style={{
            position: "fixed", inset: 0, background: "#1E181066",
            backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 1000,
          }}
        >
          <div style={{
            background: "#fff", border: "1px solid #EDE6DA", borderTop: "2px solid #9A7B4F",
            width: 480, padding: 44, borderRadius: 4,
            boxShadow: "0 24px 80px #00000020",
            animation: "modalIn 0.3s ease",
            fontFamily: "'Raleway', sans-serif",
          }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: "#1E1810", marginBottom: 6 }}>New Building</h2>
            <p style={{ fontSize: 9.5, letterSpacing: 2.5, color: "#C4B49A", textTransform: "uppercase", marginBottom: 36 }}>Configure your building</p>

            {/* Building Name */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "#A89880", marginBottom: 9, fontWeight: 500 }}>Building Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createBuilding()}
                placeholder="e.g. Tower A"
                style={{
                  width: "100%", background: "#FAF8F4", border: "1px solid #E0D6C8",
                  borderRadius: 3, padding: "13px 16px", color: "#2C2416",
                  fontFamily: "'Raleway', sans-serif", fontSize: 13, outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Floors + Flats side by side */}
            <div style={{ display: "flex", gap: 16, marginBottom: 22 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "#A89880", marginBottom: 9, fontWeight: 500 }}>Total Floors</label>
                <input
                  type="number"
                  min={1}
                  value={floors}
                  onChange={(e) => setFloors(Number(e.target.value))}
                  style={{
                    width: "100%", background: "#FAF8F4", border: "1px solid #E0D6C8",
                    borderRadius: 3, padding: "13px 16px", color: "#2C2416",
                    fontFamily: "'Raleway', sans-serif", fontSize: 13, outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "#A89880", marginBottom: 9, fontWeight: 500 }}>Flats Per Floor</label>
                <input
                  type="number"
                  min={1}
                  value={flats}
                  onChange={(e) => setFlats(Number(e.target.value))}
                  style={{
                    width: "100%", background: "#FAF8F4", border: "1px solid #E0D6C8",
                    borderRadius: 3, padding: "13px 16px", color: "#2C2416",
                    fontFamily: "'Raleway', sans-serif", fontSize: 13, outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Unit preview pill */}
            <div style={{
              background: "#FAF5EC", border: "1px solid #E0D6C8", borderRadius: 3,
              padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#A89880" }}>Total units to generate</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: "#9A7B4F" }}>
                {floors * flats}
              </span>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1, background: "transparent", border: "1px solid #E0D6C8",
                  color: "#A89880", padding: 13, fontFamily: "'Raleway', sans-serif",
                  fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                  cursor: "pointer", borderRadius: 3,
                }}
              >
                Cancel
              </button>
              <button
                onClick={createBuilding}
                disabled={loading || !name.trim()}
                style={{
                  flex: 2,
                  background: loading || !name.trim() ? "#C4B49A" : "#9A7B4F",
                  border: "none", color: "#fff", padding: 13,
                  fontFamily: "'Raleway', sans-serif", fontSize: 11,
                  fontWeight: 500, letterSpacing: 2, textTransform: "uppercase",
                  cursor: loading || !name.trim() ? "not-allowed" : "pointer",
                  borderRadius: 3, boxShadow: "0 2px 12px #9A7B4F30",
                }}
              >
                {loading ? "Creating..." : "Create Building"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}