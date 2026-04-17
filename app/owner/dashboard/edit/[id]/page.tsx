"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Coffee } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

type CafeFormData = {
  name: string
  description: string
  location: string
  hours: string
  price_range: string
  wifi: boolean
  outlets: boolean
  tags: string
  image: string
}

export default function EditCafePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<CafeFormData>({
    name: "",
    description: "",
    location: "",
    hours: "",
    price_range: "$$",
    wifi: true,
    outlets: true,
    tags: "",
    image: "",
  })

  useEffect(() => {
    const fetchCafe = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const user = session?.user
      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from("cafes")
        .select("*")
        .eq("id", id)
        .eq("owner_id", user.id)
        .single()

      if (error || !data) {
        console.error("Fetch cafe error:", error)
        alert("Could not load cafe")
        router.push("/owner/dashboard")
        return
      }

      setFormData({
        name: data.name ?? "",
        description: data.description ?? "",
        location: data.location ?? "",
        hours: data.hours ?? "",
        price_range: data.price_range ?? "$$",
        wifi: data.wifi ?? true,
        outlets: data.outlets ?? true,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
        image: data.image ?? "",
      })

      setLoading(false)
    }

    if (id) fetchCafe()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("Login first")
      setSaving(false)
      return
    }

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    const { error } = await supabase
      .from("cafes")
      .update({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        hours: formData.hours,
        price_range: formData.price_range,
        wifi: formData.wifi,
        outlets: formData.outlets,
        tags: tagsArray,
        image: formData.image,
      })
      .eq("id", id)
      .eq("owner_id", user.id)

    setSaving(false)

    if (error) {
      console.error("Update cafe error:", error)
      alert(error.message)
      return
    }

    alert("Cafe updated ✅")
    router.push("/owner/dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </div>
    )
  }

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
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/owner/dashboard" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Cafe</CardTitle>
            <CardDescription>Update your cafe details</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Cafe Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hours">Operating Hours</Label>
                  <Input
                    id="hours"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_range">Price Range</Label>
                  <select
                    id="price_range"
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="$">$ - Budget friendly</option>
                    <option value="$$">$$ - Moderate</option>
                    <option value="$$$">$$$ - Premium</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="wifi"
                      checked={formData.wifi}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, wifi: checked as boolean })
                      }
                    />
                    <Label htmlFor="wifi" className="font-normal">
                      WiFi available
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="outlets"
                      checked={formData.outlets}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, outlets: checked as boolean })
                      }
                    />
                    <Label htmlFor="outlets" className="font-normal">
                      Power outlets
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" asChild className="flex-1">
                  <Link href="/owner/dashboard">Cancel</Link>
                </Button>

                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}