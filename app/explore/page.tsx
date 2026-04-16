"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { CafeCard } from "@/components/cafe-card"

const filters = ["All", "WiFi", "Quiet", "Aesthetic", "Work-friendly", "Late night"]

export default function ExplorePage() {
  const [cafes, setCafes] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")

  useEffect(() => {
    const fetchCafes = async () => {
      const { data, error } = await supabase.from("cafes").select("*")

      console.log("cafes data:", data)
      console.log("cafes error:", error)

      if (error) return
      if (data) setCafes(data)
    }

    fetchCafes()
  }, [])

  const filteredCafes = cafes.filter((cafe) => {
    const matchesSearch =
      cafe.name?.toLowerCase().includes(search.toLowerCase()) ||
      cafe.location?.toLowerCase().includes(search.toLowerCase()) ||
      cafe.tags?.some((tag: string) =>
        tag.toLowerCase().includes(search.toLowerCase())
      )

    if (activeFilter === "All") return matchesSearch

    const filterMap: Record<string, (cafe: any) => boolean> = {
      WiFi: (c) => c.wifi,
      Quiet: (c) => c.tags?.includes("quiet") || c.tags?.includes("minimalist"),
      Aesthetic: (c) => c.tags?.includes("aesthetic") || c.tags?.includes("artsy"),
      "Work-friendly": (c) => c.wifi && c.outlets,
      "Late night": (c) =>
        c.hours?.includes("pm") &&
        (c.hours?.includes("10pm") || c.hours?.includes("2am")),
    }

    return matchesSearch && filterMap[activeFilter]?.(cafe)
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Explore Cafes</h1>
          <p className="text-muted-foreground">Find your perfect cafe spot</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or vibe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                size="sm"
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {filteredCafes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCafes.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-muted/30 py-16 text-center">
            <p className="text-muted-foreground">No cafes found. Try a different search or filter.</p>
          </div>
        )}
      </main>
    </div>
  )
}