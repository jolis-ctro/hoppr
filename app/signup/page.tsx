"use client"

import { supabase } from "@/lib/supabase"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Coffee, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<"goer" | "owner">("goer")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: "https://hoppr-jade.vercel.app/auth/callback",
        data: {
          full_name: formData.name,
          role: userType,
        },
      },
    })

    if (error) {
      setLoading(false)
      alert(error.message)
      return
    }

    if (!data.user) {
      setLoading(false)
      alert("No user returned")
      return
    }

    const { error: profileError } = await supabase.from("profiles").upsert([
      {
        id: data.user.id,
        full_name: formData.name,
        role: userType,
      },
    ])

    if (profileError) {
      setLoading(false)
      alert(profileError.message)
      return
    }

    setLoading(false)
    alert("Signup successful! Check your email to confirm your account.")
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <Coffee className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">hoppr</span>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Join the cafe hopping community</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-6 flex rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => setUserType("goer")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  userType === "goer"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Cafe Goer
              </button>

              <button
                type="button"
                onClick={() => setUserType("owner")}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  userType === "owner"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Cafe Owner
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {userType === "owner" ? "Business name" : "Your name"}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={userType === "owner" ? "Your cafe name" : "John Doe"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Creating account..."
                  : userType === "owner"
                  ? "Create Owner Account"
                  : "Sign up"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}