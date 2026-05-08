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
      {/* Hero Section */}
<section className="relative isolate overflow-hidden px-4 pb-24 pt-20 md:pb-32 md:pt-32">
  {/* animated gradient blobs */}
  <div className="absolute inset-0 -z-20 overflow-hidden">
    <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] animate-pulse rounded-full bg-primary/10 blur-3xl" />

    <div className="absolute bottom-[-20%] right-[-10%] h-[450px] w-[450px] animate-pulse rounded-full bg-emerald-300/10 blur-3xl" />

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_40%)]" />
  </div>

  {/* grid background */}
  <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(34,197,94,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.08)_1px,transparent_1px)] bg-[size:60px_60px]" />

  <div className="mx-auto max-w-6xl">
    <div className="mx-auto max-w-4xl text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-medium text-primary backdrop-blur">
        <Sparkles className="h-4 w-4" />
        Discover your next favorite spot
      </div>

      <h1 className="mb-6 text-5xl font-black leading-[0.95] tracking-tight text-foreground md:text-7xl">
        Cafe hopping,
        <br />
        <span className="bg-gradient-to-r from-primary via-green-500 to-emerald-400 bg-clip-text text-transparent">
          reimagined
        </span>
      </h1>

      <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
        Discover aesthetic cafes, hidden study spots, and trending places around Melbourne —
        all powered by community reviews and boosts.
      </p>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          size="lg"
          asChild
          className="h-14 rounded-2xl px-8 text-base shadow-lg shadow-primary/20"
        >
          <Link href="/explore" className="gap-2">
            Explore Cafes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          size="lg"
          variant="outline"
          asChild
          className="h-14 rounded-2xl border-border/60 bg-background/70 px-8 text-base backdrop-blur"
        >
          <Link href="/random" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Surprise Me
          </Link>
        </Button>
      </div>
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
     {/* Features */}
<section className="relative overflow-hidden px-4 py-20 md:py-28">
  <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.08),transparent_35%)]" />

  <div className="mx-auto max-w-6xl">
    <div className="mb-14 text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" />
        How Hoppr works
      </div>

      <h2 className="mb-4 text-4xl font-black tracking-tight text-foreground md:text-5xl">
        Discover cafes
        <span className="text-primary"> differently</span>
      </h2>

      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        Built for cafe lovers who care about vibes, aesthetics, study spots,
        and discovering hidden gems around Melbourne.
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      {/* card 1 */}
      <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 p-8 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

        <div className="relative z-10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <MapPin className="h-7 w-7" />
          </div>

          <h3 className="mb-3 text-2xl font-bold text-foreground">
            Discover
          </h3>

          <p className="leading-relaxed text-muted-foreground">
            Explore aesthetic cafes, hidden gems, and trending spots curated
            by the community.
          </p>
        </div>
      </div>

      {/* card 2 */}
      <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 p-8 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

        <div className="relative z-10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Zap className="h-7 w-7" />
          </div>

          <h3 className="mb-3 text-2xl font-bold text-foreground">
            Boost
          </h3>

          <p className="leading-relaxed text-muted-foreground">
            Push your favorite cafes higher and help others discover the best
            places worth visiting.
          </p>
        </div>
      </div>

      {/* card 3 */}
      <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 p-8 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

        <div className="relative z-10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="h-7 w-7" />
          </div>

          <h3 className="mb-3 text-2xl font-bold text-foreground">
            Random Pick
          </h3>

          <p className="leading-relaxed text-muted-foreground">
            Can’t decide where to go? Let Hoppr instantly choose your next cafe
            adventure.
          </p>
        </div>
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
