"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Coffee, Edit, Eye, Plus, Star, Trash2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


type Cafe = {
  id: number
  name: string
  location: string
  image: string
  boosts?: number
  avgRating?: number
  reviewsCount?: number
}

export default function OwnerDashboardPage() {
  const [ownedCafes, setOwnedCafes] = useState<Cafe[]>([])

  useEffect(() => {
    const fetchOwnerCafes = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const user = session?.user
      if (!user) return

      const { data: cafes, error: cafesError } = await supabase
        .from("cafes")
        .select("*")
        .eq("owner_id", user.id)

      if (cafesError) {
        console.log(cafesError)
        return
      }

      if (!cafes || cafes.length === 0) {
        setOwnedCafes([])
        return
      }

      const cafeIds = cafes.map((cafe) => cafe.id)

      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("cafe_id, rating")
        .in("cafe_id", cafeIds)

      if (reviewsError) {
        console.log(reviewsError)

        const cafesWithoutReviews = cafes.map((cafe) => ({
          ...cafe,
          avgRating: 0,
          reviewsCount: 0,
        }))

        setOwnedCafes(cafesWithoutReviews)
        return
      }

      const cafesWithStats = cafes.map((cafe) => {
        const cafeReviews = (reviews || []).filter((review) => review.cafe_id === cafe.id)

        const reviewsCount = cafeReviews.length
        const avgRating =
          reviewsCount > 0
            ? Number(
                (
                  cafeReviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount
                ).toFixed(1)
              )
            : 0

        return {
          ...cafe,
          avgRating,
          reviewsCount,
        }
      })

      setOwnedCafes(cafesWithStats)
    }

    fetchOwnerCafes()
  }, [])

  const handleDelete = async (id: number) => {
  const { error } = await supabase.from("cafes").delete().eq("id", id)

  if (error) {
    alert(error.message)
    console.error("Delete cafe error:", error)
    return
  }

  setOwnedCafes((prev) => prev.filter((c) => c.id !== id))
}

  const totalBoosts = ownedCafes.reduce((acc, cafe) => acc + (cafe.boosts || 0), 0)
  const totalReviews = ownedCafes.reduce((acc, cafe) => acc + (cafe.reviewsCount || 0), 0)
  const avgRating =
    ownedCafes.length > 0
      ? (
          ownedCafes.reduce((acc, cafe) => acc + (cafe.avgRating || 0), 0) / ownedCafes.length
        ).toFixed(1)
      : "0.0"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">hoppr</span>
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Owner
            </span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Exit Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your cafe listings</p>
          </div>
          <Button asChild>
            <Link href="/owner/addcafe" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Cafe
            </Link>
          </Button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Cafes</p>
              <p className="text-2xl font-bold text-foreground">{ownedCafes.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Boosts</p>
              <p className="text-2xl font-bold text-foreground">{totalBoosts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold text-foreground">{totalReviews}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold text-foreground">{avgRating}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Cafes</CardTitle>
            <CardDescription>View and manage your cafe listings</CardDescription>
          </CardHeader>
          <CardContent>
            {ownedCafes.length > 0 ? (
              <div className="space-y-4">
                {ownedCafes.map((cafe) => (
                  <div
                    key={cafe.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
                  >
                    <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg">
                      <Image src={cafe.image} alt={cafe.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{cafe.name}</h3>
                      <p className="text-sm text-muted-foreground">{cafe.location}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          {cafe.avgRating || 0}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Zap className="h-4 w-4" />
                          {cafe.boosts || 0} boosts
                        </span>
                        <span className="text-muted-foreground">
                          {cafe.reviewsCount || 0} reviews
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/cafe/${cafe.id}`} className="gap-1">
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </Button>

                      <Link href={`/owner/dashboard/edit/${cafe.id}`}>
                        <Button>Edit</Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(cafe.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-border py-12 text-center">
                <Coffee className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 font-medium text-foreground">No cafes yet</p>
                <p className="mb-4 text-sm text-muted-foreground">Add your first cafe to get started</p>
                <Button asChild>
                  <Link href="/owner/addcafe" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Cafe
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}