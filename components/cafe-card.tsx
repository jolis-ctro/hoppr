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
    <Link href={`/cafe/${cafe.id}`}>
      <Card className="overflow-hidden transition hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={images[currentIndex]}
            alt={cafe.name}
            fill
            className="object-cover"
            unoptimized
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                {images.map((_: string, index: number) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
              {cafe.name}
            </h3>

            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>{cafe.rating ?? 0}</span>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{cafe.location}</span>
          </div>

          {cafe.description && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {cafe.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {cafe.tags?.slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>{cafe.boosts ?? 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
