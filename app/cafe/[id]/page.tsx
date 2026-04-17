"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Wifi,
  Zap,
  Plug,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/navbar"

export default function CafeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [cafe, setCafe] = useState<any | null | undefined>(undefined)
  const [boosts, setBoosts] = useState(0)
  const [boosted, setBoosted] = useState(false)
  const [newReview, setNewReview] = useState("")
  const [userRating, setUserRating] = useState(5)
  const [reviews, setReviews] = useState<any[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [currentImage, setCurrentImage] = useState(0)

  const [reviewImages, setReviewImages] = useState<string[]>([])
  const [uploadingReviewImages, setUploadingReviewImages] = useState(false)
  const [postingReview, setPostingReview] = useState(false)

  const normaliseImages = (value: any): string[] => {
    if (!value) return []

    if (Array.isArray(value)) {
      return value.filter(Boolean)
    }

    if (typeof value === "string") {
      const trimmed = value.trim()
      if (!trimmed) return []

      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) return parsed.filter(Boolean)
        if (typeof parsed === "string" && parsed.trim()) return [parsed]
      } catch {
        return [trimmed]
      }
    }

    return []
  }

  const fetchCafe = async () => {
    const { data, error } = await supabase
      .from("cafes")
      .select("*")
      .eq("id", Number(id))
      .single()

    console.log("cafe data:", data)
    console.log("cafe error:", error)

    if (data) {
      setCafe(data)
      setBoosts(data.boosts ?? 0)
      setCurrentImage(0)
    } else {
      setCafe(null)
    }
  }

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles(full_name)")
      .eq("cafe_id", Number(id))
      .order("id", { ascending: false })

    console.log("reviews data:", data)
    console.log("reviews error:", error)

    if (data) {
      const cleanedReviews = data.map((review) => ({
        ...review,
        images: normaliseImages(review.images),
      }))

      setReviews(cleanedReviews)
      setReviewCount(cleanedReviews.length)

      const avg =
        cleanedReviews.reduce(
          (sum, review) => sum + (Number(review.rating) || 0),
          0
        ) / cleanedReviews.length || 0

      setAvgRating(avg)
    }
  }

  useEffect(() => {
    fetchCafe()
    fetchReviews()
  }, [id])

  const handleReviewImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploadingReviewImages(true)
    const uploadedUrls: string[] = []

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`

      const filePath = `reviews/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("review-images")
        .upload(filePath, file)

      if (uploadError) {
        console.log("review image upload error:", uploadError)
        continue
      }

      const { data } = supabase.storage
        .from("review-images")
        .getPublicUrl(filePath)

      console.log("uploaded public url:", data?.publicUrl)

      if (data?.publicUrl) {
        uploadedUrls.push(data.publicUrl)
      }
    }

    setReviewImages((prev) => [...prev, ...uploadedUrls])
    setUploadingReviewImages(false)
  }

  const removeReviewImage = (indexToRemove: number) => {
    setReviewImages((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleBoost = async () => {
    const newBoosts = boosts + 1

    const { data, error } = await supabase
      .from("cafes")
      .update({ boosts: newBoosts })
      .eq("id", Number(id))
      .select()

    console.log("boost data:", data)
    console.log("boost error:", error)

    if (error) {
      alert(error.message)
      return
    }

    setBoosts(newBoosts)
    setBoosted(true)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newReview.trim()) return

    if (uploadingReviewImages) {
      alert("wait for images to finish uploading first")
      return
    }

    setPostingReview(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("login first")
      setPostingReview(false)
      return
    }

    console.log("reviewImages being saved:", reviewImages)

    const payload = {
      cafe_id: Number(id),
      user_id: user.id,
      rating: userRating,
      content: newReview,
      images: reviewImages,
    }

    console.log("review insert payload:", payload)

    const { error } = await supabase.from("reviews").insert([payload])

    console.log("review insert error:", error)

    if (error) {
      alert(error.message)
      setPostingReview(false)
      return
    }

    setNewReview("")
    setUserRating(5)
    setReviewImages([])
    setPostingReview(false)

    await fetchReviews()
  }

  if (cafe === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Loading...</h1>
        </div>
      </div>
    )
  }

  if (cafe === null) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Cafe not found</h1>
          <Button asChild>
            <Link href="/explore">Back to Explore</Link>
          </Button>
        </div>
      </div>
    )
  }

  const images =
    Array.isArray(cafe.images) && cafe.images.length > 0
      ? cafe.images
      : cafe.image
        ? [cafe.image]
        : ["/placeholder.jpg"]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/explore" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>
        </Button>

        <div className="mb-6">
          <div className="relative mb-3 aspect-video overflow-hidden rounded-2xl">
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
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {images.map((_: string, index: number) => (
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

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImage(index)}
                  className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
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

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">{cafe.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{cafe.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm">({reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            variant={boosted ? "default" : "outline"}
            className="gap-2"
            onClick={handleBoost}
          >
            <Zap className={`h-5 w-5 ${boosted ? "fill-current" : ""}`} />
            Boost ({boosts})
          </Button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Hours</p>
                <p className="text-sm font-medium text-foreground">{cafe.hours}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-sm font-medium text-foreground">{cafe.price_range}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Wifi
                className={`h-5 w-5 ${
                  cafe.wifi ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <div>
                <p className="text-xs text-muted-foreground">WiFi</p>
                <p className="text-sm font-medium text-foreground">
                  {cafe.wifi ? "Available" : "No"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Plug
                className={`h-5 w-5 ${
                  cafe.outlets ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <div>
                <p className="text-xs text-muted-foreground">Outlets</p>
                <p className="text-sm font-medium text-foreground">
                  {cafe.outlets ? "Plenty" : "Limited"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">About</h2>
          <p className="text-muted-foreground">{cafe.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(cafe.tags ?? []).map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Reviews</h2>

          <Card className="mb-6">
            <CardContent className="p-4">
              <form onSubmit={handleSubmitReview}>
                <div className="mb-3 flex items-center gap-1">
                  <span className="mr-2 text-sm text-muted-foreground">Your rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-5 w-5 transition-colors ${
                          star <= userRating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <Textarea
                  placeholder="Share your experience..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="mb-3"
                />

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleReviewImageUpload(e.target.files)}
                  className="mb-3 block w-full text-sm"
                />

                {uploadingReviewImages && (
                  <p className="mb-3 text-sm text-muted-foreground">
                    Uploading images...
                  </p>
                )}

                {reviewImages.length > 0 && (
                  <div className="mb-3 flex gap-2 overflow-x-auto">
                    {reviewImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border"
                      >
                        <img
                          src={img}
                          alt={`Review upload ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeReviewImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Button type="submit" size="sm" disabled={postingReview || uploadingReviewImages}>
                  {postingReview ? "Posting..." : "Post Review"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm">
                      {review.profiles?.full_name?.[0] || "U"}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{review.content}</p>

                  {Array.isArray(review.images) && review.images.length > 0 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {review.images.map((img: string, index: number) => (
                        <div
                          key={index}
                          className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg"
                        >
                          <img
                            src={img}
                            alt={`Review image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}