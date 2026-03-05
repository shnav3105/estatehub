"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type Company = {
  id: string
  name: string
  category: string
  created_at: string
}

const CATEGORY_COLOR: Record<string, string> = {
  Normal: "#7A8A6A",
  Residential: "#9A7B4F",
  Commercial: "#4A7A8A",
  "Mixed Use": "#6B5B95",
  Luxury: "#B07D50",
}

const CATEGORY_BG: Record<string, string> = {
  Normal: "#F2F5EF",
  Residential: "#FAF5EC",
  Commercial: "#EEF5F8",
  "Mixed Use": "#F3F0FA",
  Luxury: "#FBF3EC",
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [name, setName] = useState("")
  const [category, setCategory] = useState("Normal")
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => { fetchCompanies() }, [])

  async function fetchCompanies() {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) { console.error(error); return }
    setCompanies(data || [])
  }

  async function createCompany() {
    if (!name.trim()) return
    setLoading(true)
    const { error } = await supabase.from("companies").insert({ name, category })
    if (error) { console.error(error); setLoading(false); return }
    setName("")
    setCategory("Normal")
    setShowModal(false)
    setLoading(false)
    fetchCompanies()
  }

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Google Fonts */}
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
      `}</style>

      {/* PAGE WRAPPER — forces light bg regardless of layout */}
      <div style={{
        minHeight: "100vh",
        background: "#F8F4EE",
        fontFamily: "'Raleway', sans-serif",
        color: "#2C2416",
        padding: "36px 48px 60px",
      }}>

        {/* ── TOP BAR ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 0 }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "#9A7B4F", marginBottom: 10, fontFamily: "'Raleway', sans-serif" }}>
              Portfolio Management
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: "#1E1810", lineHeight: 1.1 }}>
              Your <em style={{ fontStyle: "italic", color: "#9A7B4F" }}>Companies</em>
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#C4B49A", fontSize: 15, pointerEvents: "none" }}>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                style={{
                  background: "#fff", border: "1px solid #E0D6C8", borderRadius: 3,
                  padding: "11px 16px 11px 40px", color: "#2C2416",
                  fontFamily: "'Raleway', sans-serif", fontSize: 12, letterSpacing: 0.5,
                  width: 220, outline: "none", boxShadow: "0 1px 4px #00000008",
                }}
              />
            </div>

            {/* Add button */}
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#9A7B4F", color: "#fff", border: "none",
                padding: "11px 24px", fontFamily: "'Raleway', sans-serif",
                fontSize: 11, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase",
                cursor: "pointer", borderRadius: 3, boxShadow: "0 2px 12px #9A7B4F30",
                transition: "all 0.2s",
              }}
            >
              + Add Company
            </button>
          </div>
        </div>

        {/* ── ORNAMENT DIVIDER ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "28px 0 32px" }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #E0D6C8, transparent)" }} />
          <div style={{ width: 5, height: 5, background: "#9A7B4F", transform: "rotate(45deg)", opacity: 0.5 }} />
          <span style={{ fontSize: 9.5, letterSpacing: 3, color: "#C4B49A", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {filtered.length} {filtered.length === 1 ? "Company" : "Companies"}
          </span>
          <div style={{ width: 5, height: 5, background: "#9A7B4F", transform: "rotate(45deg)", opacity: 0.5 }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, #E0D6C8, transparent)" }} />
        </div>

        {/* ── GRID ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#C4B49A" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: "#A89880", marginBottom: 8 }}>No companies yet</p>
            <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Add your first company to get started</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filtered.map((company, i) => {
              const accent = CATEGORY_COLOR[company.category] || "#9A7B4F"
              const bg = CATEGORY_BG[company.category] || "#FAF5EC"
              const isHovered = hoveredCard === company.id
              const joined = new Date(company.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

              return (
                <div
                  key={company.id}
                  onClick={() => router.push(`/companies/${company.id}/buildings`)}
                  onMouseEnter={() => setHoveredCard(company.id)}
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
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${accent}, ${accent}44)` }} />

                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: "50%",
                      border: `1px solid ${accent}44`, background: bg, color: accent,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400,
                    }}>
                      {company.name.charAt(0)}
                    </div>
                    <span style={{
                      fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                      border: `1px solid ${accent}44`, padding: "4px 11px", borderRadius: 20,
                      color: accent, background: bg, fontWeight: 500,
                    }}>
                      {company.category}
                    </span>
                  </div>

                  {/* Name & date */}
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 23, fontWeight: 400, color: "#1E1810", marginBottom: 6, lineHeight: 1.2 }}>
                    {company.name}
                  </h3>
                  <p style={{ fontSize: 10, letterSpacing: 1.5, color: "#C4B49A", textTransform: "uppercase", marginBottom: 0 }}>
                    Est. {joined}
                  </p>

                  {/* Divider */}
                  <div style={{ height: 1, background: "linear-gradient(to right, #EDE6DA, transparent)", margin: "20px 0" }} />

                  {/* Stats */}
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: accent, lineHeight: 1 }}>—</div>
                      <div style={{ fontSize: 8.5, letterSpacing: 2, color: "#B4A48A", textTransform: "uppercase", marginTop: 4 }}>Buildings</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: accent, lineHeight: 1 }}>—</div>
                      <div style={{ fontSize: 8.5, letterSpacing: 2, color: "#B4A48A", textTransform: "uppercase", marginTop: 4 }}>Units</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{
                    border: `1px solid ${isHovered ? accent : "#E0D6C8"}`,
                    color: isHovered ? accent : "#A89880",
                    background: isHovered ? bg : "transparent",
                    padding: "11px 0", borderRadius: 3,
                    fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "all 0.3s",
                    fontFamily: "'Raleway', sans-serif",
                  }}>
                    View Portfolio <span style={{ fontSize: 14, transform: isHovered ? "translateX(4px)" : "none", transition: "transform 0.3s", display: "inline-block" }}>→</span>
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
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: "#1E1810", marginBottom: 6 }}>New Company</h2>
            <p style={{ fontSize: 9.5, letterSpacing: 2.5, color: "#C4B49A", textTransform: "uppercase", marginBottom: 36 }}>Add to your portfolio</p>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "#A89880", marginBottom: 9, fontWeight: 500 }}>Company Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createCompany()}
                placeholder="e.g. Aurelia Properties"
                style={{
                  width: "100%", background: "#FAF8F4", border: "1px solid #E0D6C8",
                  borderRadius: 3, padding: "13px 16px", color: "#2C2416",
                  fontFamily: "'Raleway', sans-serif", fontSize: 13, outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "#A89880", marginBottom: 9, fontWeight: 500 }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%", background: "#FAF8F4", border: "1px solid #E0D6C8",
                  borderRadius: 3, padding: "13px 16px", color: "#2C2416",
                  fontFamily: "'Raleway', sans-serif", fontSize: 13, outline: "none",
                  appearance: "none", boxSizing: "border-box",
                }}
              >
                <option value="Normal">Normal</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixed Use">Mixed Use</option>
                <option value="Luxury">Luxury</option>
              </select>
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
                onClick={createCompany}
                disabled={loading || !name.trim()}
                style={{
                  flex: 2, background: loading || !name.trim() ? "#C4B49A" : "#9A7B4F",
                  border: "none", color: "#fff", padding: 13,
                  fontFamily: "'Raleway', sans-serif", fontSize: 11,
                  fontWeight: 500, letterSpacing: 2, textTransform: "uppercase",
                  cursor: loading || !name.trim() ? "not-allowed" : "pointer",
                  borderRadius: 3, boxShadow: "0 2px 12px #9A7B4F30",
                }}
              >
                {loading ? "Creating..." : "Create Company"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}