"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AddCafePage() {
  const [name, setName] = useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from("cafes").insert([
      {
        name,
        owner_id: user.id,
      },
    ])

    if (error) {
      alert(error.message)
      return
    }

    alert("Cafe added")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Add Cafe</button>
    </form>
  )
}