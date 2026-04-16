"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Crown, MapPin, Star, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

export default function TopCafesPage() {
  const [topCafes, setTopCafes] = useState<any[]>([])

  useEffect(() => {
    const fetchTopCafes = async () => {
      const { data, error } = await supabase
        .from("cafes")
        .select("*")
        .order("boosts", { ascending: false })

      if (error) {
        console.log(error)
        return
      }

      if (data) {
        setTopCafes(data)
      }
    }

    fetchTopCafes()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm text-accent-foreground">
            <Crown className="h-4 w-4" />
            <span>Most Loved</span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Top Cafes</h1>
          <p className="text-muted-foreground">The most boosted cafes by our community</p>
        </div>

        <div className="space-y-4">
          {topCafes.map((cafe, index) => (
            <Link key={cafe.id ?? cafe.name} href={`/cafe/${cafe.id}`}>
              <Card className="overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
                      index === 0
                        ? "bg-accent text-accent-foreground"
                        : index === 1
                        ? "bg-muted text-muted-foreground"
                        : index === 2
                        ? "bg-primary/20 text-primary"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={cafe.image || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb"}
                      alt={cafe.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground">{cafe.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {cafe.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        {cafe.rating || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
                    <Zap className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold text-primary">{cafe.boosts || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}