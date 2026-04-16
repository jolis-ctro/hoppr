'use client'
import Link from "next/link"
import { ArrowRight, Coffee, MapPin, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { CafeCard } from "@/components/cafe-card"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"


export default function HomePage() {
  const [cafes, setCafes] = useState<any[]>([])
  const [reviewCount, setReviewCount] = useState(0)
  const [boostCount, setBoostCount] = useState(0)
  

useEffect(() => {
  const fetchStats = async () => {
    const [{ data: cafesData }, { count }] = await Promise.all([
      supabase.from("cafes").select("id, boosts, name, image, location"),
      supabase.from("reviews").select("*", { count: "exact", head: true }),
    ])

    if (cafesData) {
      setCafes(cafesData)

      const totalBoosts = cafesData.reduce(
        (acc, cafe) => acc + (cafe.boosts || 0),
        0
      )

      setBoostCount(totalBoosts)
    }

    setReviewCount(count || 0)
  }

  fetchStats()
}, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(120,180,120,0.1),transparent_50%)]" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Discover your next favorite spot</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
            Cafe hopping,{" "}
            <span className="text-primary">reimagined</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-pretty">
            Find the coziest cafes, leave reviews, boost your favorites, or let fate decide with our random picker.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/explore" className="gap-2">
                Explore Cafes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/random" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Surprise Me
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30 px-4 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mb-1 text-2xl font-bold text-foreground md:text-3xl">{cafes.length}</div>
            <div className="text-sm text-muted-foreground">Cafes Listed</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-2xl font-bold text-foreground md:text-3xl">{reviewCount}</div>
            <div className="text-sm text-muted-foreground">Reviews</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-2xl font-bold text-foreground md:text-3xl">{boostCount}</div>
            <div className="text-sm text-muted-foreground">Boosts</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">How it works</h2>
            <p className="text-muted-foreground">Simple, quick, and made for cafe lovers</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Discover</h3>
              <p className="text-sm text-muted-foreground">Browse through curated cafes with vibes that match yours</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Boost</h3>
              <p className="text-sm text-muted-foreground">Show love to your favorites and help others find the best spots</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Random Pick</h3>
              <p className="text-sm text-muted-foreground">{"Can't decide? Let our picker choose your next adventure"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cafes */}
      <section className="bg-muted/30 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">Trending now</h2>
              <p className="text-muted-foreground">The most boosted cafes this week</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/explore" className="gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cafes.map((cafe) => (
              <CafeCard key={cafe.id || cafe.name} cafe={cafe} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/explore" className="gap-1">
                View all cafes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA for Owners */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-primary p-8 text-center md:p-12">
          <Coffee className="mx-auto mb-4 h-10 w-10 text-primary-foreground" />
          <h2 className="mb-3 text-2xl font-bold text-primary-foreground md:text-3xl">Own a cafe?</h2>
          <p className="mb-6 text-primary-foreground/80">List your cafe and reach thousands of coffee lovers looking for their next spot</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/owner/addcafe">Add Your Cafe</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">hoppr</span>
          </div>
          <p className="text-sm text-muted-foreground">Made with caffeine and love</p>
        </div>
      </footer>
    </div>
  )
}
