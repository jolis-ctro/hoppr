"use client"

import { supabase } from '@/lib/supabase'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

    console.log("signup data:", data)
    console.log("signup error:", error)

    if (error) {
      alert(error.message)
      return
    }

    if (!data.user) {
      alert("No user returned")
      return
    }

    alert("Signup successful! Check your email to confirm your account.")
  }

  return (
    <div>...</div> // your UI unchanged
  )
}