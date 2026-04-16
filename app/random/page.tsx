  "use client"

  import { supabase } from "@/lib/supabase"
  import { useState, useRef, useEffect } from "react"
  import Link from "next/link"
  import Image from "next/image"
  import { ArrowRight, MapPin, RotateCcw, Sparkles, Star, Zap } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent } from "@/components/ui/card"
  import { Navbar } from "@/components/navbar"

  export default function RandomPickerPage() {
    const [cafes, setCafes] = useState<any[]>([])
    const [selectedCafe, setSelectedCafe] = useState<any | null>(null)
    const [isSpinning, setIsSpinning] = useState(false)
    const [rotation, setRotation] = useState(0)
    const wheelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const fetchCafes = async () => {
        const { data, error } = await supabase.from("cafes").select("*")

        if (error) {
          console.log(error)
          return
        }

        if (data) {
          setCafes(data)
        }
      }

      fetchCafes()
    }, [])

    const colors = [
      "bg-primary",
      "bg-accent",
      "bg-chart-3",
      "bg-chart-4",
      "bg-chart-5",
      "bg-primary/70",
      "bg-accent/70",
      "bg-chart-3/70",
    ]

    const spinWheel = () => {
      if (isSpinning || cafes.length === 0) return

      setIsSpinning(true)
      setSelectedCafe(null)

      const spins = 3 + Math.random() * 2
      const randomIndex = Math.floor(Math.random() * cafes.length)
      const segmentAngle = 360 / cafes.length
      const stopAngle = randomIndex * segmentAngle + segmentAngle / 2
      const totalRotation = rotation + spins * 360 + (360 - stopAngle)

      setRotation(totalRotation)

      setTimeout(() => {
        setSelectedCafe(cafes[randomIndex])
        setIsSpinning(false)
      }, 3000)
    }

    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>{"Can't decide?"}</span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Random Cafe Picker</h1>
            <p className="text-muted-foreground">Let fate decide your next cafe adventure</p>
          </div>

          <div className="flex flex-col items-center">
            {cafes.length > 0 ? (
              <>
                <div className="relative mb-8">
                  <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2">
                    <div className="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-primary" />
                  </div>

                  <div className="relative h-72 w-72 sm:h-80 sm:w-80">
                    <div
                      ref={wheelRef}
                      className="h-full w-full overflow-hidden rounded-full border-4 border-border shadow-lg"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning
                          ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                          : "none",
                      }}
                    >
                      {cafes.map((cafe, index) => {
                        const angle = (360 / cafes.length) * index
                        const skewAngle = 90 - 360 / cafes.length

                        return (
                          <div
                            key={cafe.id ?? cafe.name}
                            className={`absolute left-1/2 top-0 h-1/2 w-1/2 origin-bottom-left ${colors[index % colors.length]}`}
                            style={{
                              transform: `rotate(${angle}deg) skewY(-${skewAngle}deg)`,
                            }}
                          >
                          </div>
                        )
                      })}
                    </div>

                    <button
                      onClick={spinWheel}
                      disabled={isSpinning}
                      className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-primary bg-background shadow-lg transition-transform hover:scale-105 disabled:opacity-70"
                    >
                      {isSpinning ? (
                        <RotateCcw className="h-8 w-8 animate-spin text-primary" />
                      ) : (
                        <span className="text-sm font-bold text-primary">SPIN</span>
                      )}
                    </button>
                  </div>
                </div>

                {selectedCafe && (
                  <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardContent className="p-6">
                      <div className="mb-4 text-center">
                        <Sparkles className="mx-auto mb-2 h-8 w-8 text-primary" />
                        <p className="text-sm text-muted-foreground">Your destiny awaits at...</p>
                      </div>

                      <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                        <Image
                          src={selectedCafe.image || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb"}
                          alt={selectedCafe.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <h2 className="mb-2 text-xl font-bold text-foreground">{selectedCafe.name}</h2>
                      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedCafe.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          {selectedCafe.rating || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          {selectedCafe.boosts || 0} boosts
                        </span>
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground">{selectedCafe.description}</p>

                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={spinWheel}>
                          Spin Again
                        </Button>
                        <Button className="flex-1 gap-2" asChild>
                          <Link href={`/cafe/${selectedCafe.id}`}>
                            View Cafe
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!selectedCafe && !isSpinning && (
                  <p className="text-center text-muted-foreground">
                    Click the wheel or press SPIN to pick a random cafe
                  </p>
                )}
              </>
            ) : (
              <p className="text-center text-muted-foreground">No cafes available yet.</p>
            )}
            
          </div>
        </main>
      </div>
    )
  }