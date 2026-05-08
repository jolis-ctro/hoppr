"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function CafeCard({ cafe }: { cafe: any }) {
  const images =
    cafe.images && cafe.images.length > 0
      ? cafe.images
      : cafe.image
        ? [cafe.image]
        : ["/placeholder.jpg"]

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Link href={`/cafe/${cafe.id}`} className="block h-full">
      <Card className="group h-full overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={images[currentIndex]}
            alt={cafe.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          <div className="absolute left-4 right-4 top-4 flex justify-between gap-2">
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black shadow-sm">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {cafe.rating ?? "0.0"}
            </div>

            <div className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
              <Zap className="h-3.5 w-3.5" />
              {cafe.boosts ?? 0}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="line-clamp-1 text-2xl font-bold drop-shadow">
              {cafe.name}
            </h3>

            <div className="mt-1 flex items-center gap-1 text-sm text-white/90">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{cafe.location}</span>
            </div>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {cafe.tags?.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}