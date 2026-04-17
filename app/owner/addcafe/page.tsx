"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Coffee, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"

export default function AddCafePage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    hours: "",
    price_range: "$$",
    wifi: true,
    outlets: true,
    tags: "",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

useEffect(() => {
  let mounted = true

  const checkUser = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error(sessionError)
      return
    }

    const user = session?.user

    if (!user) {
      if (mounted) router.push("/login")
      return
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (error) {
      console.error(error)
      return
    }

    if (mounted && data?.role !== "owner") {
      router.push("/explore")
    }
  }

  checkUser()

  return () => {
    mounted = false
  }
}, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("Login first")
      return
    }

    if (!imageFile) {
      alert("Please upload a cafe image")
      return
    }

    setUploading(true)

    const fileExt = imageFile.name.split(".").pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `cafes/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("cafe-images")
      .upload(filePath, imageFile)

    if (uploadError) {
      setUploading(false)
      alert(uploadError.message)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from("cafe-images")
      .getPublicUrl(filePath)

    const imageUrl = publicUrlData.publicUrl

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    const { error } = await supabase.from("cafes").insert([
      {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        hours: formData.hours,
        price_range: formData.price_range,
        wifi: formData.wifi,
        outlets: formData.outlets,
        tags: tagsArray,
        image: imageUrl,
        owner_id: user.id,
      },
    ])

    setUploading(false)

    if (error) {
      alert(error.message)
      return
    }

    alert("Cafe added ✅")
    router.push("/owner/dashboard")
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
            <CardTitle>Add New Cafe</CardTitle>
            <CardDescription>Fill in the details to list your cafe on hoppr</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cafe-image">Cafe Photo *</Label>

                <label
                  htmlFor="cafe-image"
                  className="flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/50"
                >
                  <div className="text-center">
                    <ImagePlus className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {imageFile ? imageFile.name : "Click to upload an image"}
                    </p>
                  </div>
                </label>

                <input
                  id="cafe-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setImageFile(file)
                  }}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Cafe Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your cafe name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell people about your cafe..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Neighborhood or address"
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
                      placeholder="e.g. 7am - 9pm"
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
                    placeholder="e.g. matcha, aesthetic, wifi"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
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

                <Button type="submit" className="flex-1" disabled={uploading}>
                  {uploading ? "Uploading..." : "Add Your Cafe"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}