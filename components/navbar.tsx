"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Coffee, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/top-cafes", label: "Top Cafes" },
  { href: "/random", label: "Random Pick" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  setUser(session?.user ?? null)
  setLoadingUser(false)
}

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("auth change:", session?.user)
      setUser(session?.user ?? null)
      setLoadingUser(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setMobileMenuOpen(false)
    router.refresh()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">hoppr</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!loadingUser &&
            (!user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex gap-2 border-t border-border pt-4">
              {!loadingUser &&
                (!user ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1" onClick={handleLogout}>
                    Log out
                  </Button>
                ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}