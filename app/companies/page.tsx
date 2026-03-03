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

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [name, setName] = useState("")
  const [category, setCategory] = useState("Normal")

  const router = useRouter()

  useEffect(() => {
    fetchCompanies()
  }, [])

  async function fetchCompanies() {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setCompanies(data || [])
  }

  async function createCompany() {
    if (!name.trim()) return

    const { error } = await supabase
      .from("companies")
      .insert({ name, category })

    if (error) {
      console.error(error)
      return
    }

    setName("")
    setCategory("Normal")
    fetchCompanies()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-gray-400">
            Manage your real estate companies and portfolios
          </p>
        </div>

        <button
          onClick={createCompany}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium"
        >
          + Add Company
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            onClick={() =>
              router.push(`/companies/${company.id}/buildings`)
            }
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition cursor-pointer"
          >
            <h2 className="text-lg font-semibold mb-2">
              {company.name}
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Joined {new Date(company.created_at).toLocaleDateString()}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                Buildings
              </span>
              <span className="text-lg font-bold">
                {/* we will add count later */}
                -
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}