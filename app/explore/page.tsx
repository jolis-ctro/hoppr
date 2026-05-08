"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { CafeCard } from "@/components/cafe-card"

const filters = [
  "All",
  "WiFi",
  "Quiet",
  "Aesthetic",
  "Work-friendly",
  "Late night",
]

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

      Quiet: (c) =>
        c.tags?.includes("quiet") ||
        c.tags?.includes("minimalist"),

      Aesthetic: (c) =>
        c.tags?.includes("aesthetic") ||
        c.tags?.includes("artsy"),

      "Work-friendly": (c) => c.wifi && c.outlets,

      "Late night": (c) =>
        c.hours?.includes("pm") &&
        (c.hours?.includes("10pm") ||
          c.hours?.includes("11pm") ||
          c.hours?.includes("12am") ||
          c.hours?.includes("2am")),
    }

    return matchesSearch && filterMap[activeFilter]?.(cafe)
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-10">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
            Explore Cafes
          </h1>

          <p className="text-muted-foreground">
            Discover Melbourne’s best cafes, study spots, and hidden gems.
          </p>
        </div>

        <div className="mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search cafes, locations, or vibes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-2xl border-border/60 pl-11 text-base shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                size="sm"
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className="rounded-full"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {filteredCafes.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCafes.map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </div>

            <p className="mt-12 text-center text-xs text-muted-foreground">
              Hoppr is not affiliated with or endorsed by listed venues.
              Cafe names are shown for identification only.
            </p>
          </>
        ) : (
          <div className="rounded-3xl border border-border bg-muted/20 py-20 text-center">
            <p className="text-muted-foreground">
              No cafes found. Try a different search or filter.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}