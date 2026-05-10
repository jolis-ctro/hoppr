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
  Menu,
  ExternalLink,
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
    if (Array.isArray(value)) return value.filter(Boolean)

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
    const { data } = await supabase
      .from("cafes")
      .select("*, menu_url, menu_name")
      .eq("id", Number(id))
      .single()

    if (data) {
      setCafe(data)
      setBoosts(data.boosts ?? 0)
      setCurrentImage(0)
    } else {
      setCafe(null)
    }
  }

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles(full_name)")
      .eq("cafe_id", Number(id))
      .order("id", { ascending: false })

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

      if (uploadError) continue

      const { data } = supabase.storage
        .from("review-images")
        .getPublicUrl(filePath)

      if (data?.publicUrl) uploadedUrls.push(data.publicUrl)
    }

    setReviewImages((prev) => [...prev, ...uploadedUrls])
    setUploadingReviewImages(false)
  }

  const removeReviewImage = (indexToRemove: number) => {
    setReviewImages((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleBoost = async () => {
    const newBoosts = boosts + 1

    const { error } = await supabase
      .from("cafes")
      .update({ boosts: newBoosts })
      .eq("id", Number(id))

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

    const { error } = await supabase.from("reviews").insert([
      {
        cafe_id: Number(id),
        user_id: user.id,
        rating: userRating,
        content: newReview,
        images: reviewImages,
      },
    ])

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
      </div>
    )
  }

  if (cafe === null) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
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

      <main className="mx-auto max-w-5xl px-4 py-8">

        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/explore" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>
        </Button>

        {/* HERO */}
        <section className="mb-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-muted shadow-sm">

            <Image
              src={images[currentImage]}
              alt={`${cafe.name} image`}
              fill
              className="object-cover"
              unoptimized
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h1 className="mb-2 text-4xl font-black tracking-tight">
                {cafe.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {cafe.location}
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-white text-white" />
                  {avgRating.toFixed(1)} ({reviewCount} reviews)
                </div>
              </div>
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </section>

        {/* TAGS + BOOST */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div className="flex flex-wrap gap-2">
            {(cafe.tags ?? []).map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          <Button
            size="lg"
            variant={boosted ? "default" : "outline"}
            className="gap-2 rounded-full"
            onClick={handleBoost}
          >
            <Zap className={`h-5 w-5 ${boosted ? "fill-current" : ""}`} />
            Boost ({boosts})
          </Button>
        </div>

        {/* INFO CARDS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">

          <Card className="rounded-3xl">
            <CardContent className="flex items-center gap-3 p-5">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Hours</p>
                <p className="text-sm font-medium">{cafe.hours}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="flex items-center gap-3 p-5">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-sm font-medium">{cafe.price_range}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="flex items-center gap-3 p-5">
              <Wifi className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">WiFi</p>
                <p className="text-sm font-medium">
                  {cafe.wifi ? "Available" : "No"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="flex items-center gap-3 p-5">
              <Plug className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Outlets</p>
                <p className="text-sm font-medium">
                  {cafe.outlets ? "Plenty" : "Limited"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ABOUT */}
        {cafe.description && (
          <section className="mb-8">
            <h2 className="mb-3 text-2xl font-bold">
              About
            </h2>

            <p className="leading-relaxed text-muted-foreground">
              {cafe.description}
            </p>
          </section>
        )}

        {/* MENU */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur md:p-8">

            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative z-10">

              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                    <Menu className="h-4 w-4" />
                    Cafe Menu
                  </div>

                  <h2 className="text-3xl font-black tracking-tight">
                    Explore the menu
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Check drinks, desserts, pricing, and specials before visiting.
                  </p>
                </div>

                {cafe.menu_url && (
                  <Button
                    asChild
                    className="rounded-2xl"
                  >
                    <a
                      href={cafe.menu_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      Open Full Menu
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>

              {cafe.menu_url ? (
                <div className="overflow-hidden rounded-3xl border border-border bg-muted/20">

                  {cafe.menu_url.toLowerCase().includes(".pdf") ? (
                    <iframe
                      src={cafe.menu_url}
                      className="h-[700px] w-full"
                    />
                  ) : (
                    <img
                      src={cafe.menu_url}
                      alt="Cafe menu"
                      className="max-h-[900px] w-full object-contain"
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-20 text-center">

                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Menu className="h-8 w-8 text-primary" />
                  </div>

                  <h3 className="mb-2 text-xl font-semibold">
                    No menu uploaded yet
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    This cafe hasn’t attached a menu yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}