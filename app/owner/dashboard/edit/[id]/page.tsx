"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock3,
  DollarSign,
  MapPin,
  Plug,
  Star,
  Wifi,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Cafe = {
  id: string
  name: string
  location?: string
  description?: string
  image?: string
  images?: string[] | string
  rating?: number
  boosts?: number
  review_count?: number
  reviews_count?: number
  hours?: string
  price?: string
  wifi?: boolean
  outlets?: boolean
}

export default function CafePage() {
  const params = useParams()
  const id = params.id as string

  const [cafe, setCafe] = useState<Cafe | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const fetchCafe = async () => {
      const { data, error } = await supabase
        .from("cafes")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.log(error)
        setLoading(false)
        return
      }

      setCafe(data)
      setLoading(false)
      setCurrentImage(0)
    }

    if (id) fetchCafe()
  }, [id])

  const images = useMemo(() => {
    if (!cafe) return ["/placeholder.jpg"]

    if (Array.isArray(cafe.images) && cafe.images.length > 0) {
      return cafe.images.filter(Boolean)
    }

    if (typeof cafe.images === "string" && cafe.images.trim() !== "") {
      try {
        const parsed = JSON.parse(cafe.images)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(Boolean)
        }
      } catch {
        return [cafe.images]
      }
    }

    if (cafe.image) return [cafe.image]

    return ["/placeholder.jpg"]
  }, [cafe])

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const reviewCount = cafe?.review_count ?? cafe?.reviews_count ?? 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </div>
    )
  }

  if (!cafe) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Link
            href="/explore"
            className="mb-8 inline-flex items-center gap-2 text-foreground hover:opacity-70"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Explore</span>
          </Link>

          <p className="mt-8 text-muted-foreground">Cafe not found.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/explore"
          className="mb-8 inline-flex items-center gap-2 text-foreground hover:opacity-70"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Explore</span>
        </Link>

        <div className="mb-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-muted">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={images[currentImage]}
                alt={`${cafe.name} image ${currentImage + 1}`}
                fill
                className="object-cover"
                unoptimized
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentImage(index)}
                        className={`h-2.5 w-2.5 rounded-full ${
                          index === currentImage ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImage(index)}
                  className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border-2 ${
                    index === currentImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${cafe.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-3 text-4xl font-bold text-foreground">{cafe.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {cafe.location || "No location yet"}
              </span>

              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {(cafe.rating ?? 0).toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>
          </div>

          <Button variant="outline" className="gap-2 self-start md:self-auto">
            <Zap className="h-4 w-4" />
            Boost ({cafe.boosts ?? 0})
          </Button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <Clock3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Hours</p>
                <p className="font-medium text-foreground">{cafe.hours || "Not listed"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium text-foreground">{cafe.price || "Not listed"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <Wifi className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">WiFi</p>
                <p className="font-medium text-foreground">
                  {cafe.wifi ? "Available" : "No WiFi listed"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <Plug className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Outlets</p>
                <p className="font-medium text-foreground">
                  {cafe.outlets ? "Available" : "No outlets listed"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-3 text-xl font-semibold text-foreground">About</h2>
            <p className="leading-7 text-muted-foreground">
              {cafe.description || "No description yet."}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}