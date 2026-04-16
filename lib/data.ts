export interface Cafe {
  id: string
  name: string
  description: string
  image: string
  location: string
  rating: number
  reviews: number
  tags: string[]
  boosts: number
  priceRange: string
  hours: string
  wifi: boolean
  outlets: boolean
}

export interface Review {
  id: string
  cafeId: string
  author: string
  avatar: string
  rating: number
  comment: string
  date: string
}

export const cafes: Cafe[] = [
  {
    id: "1",
    name: "Brew & Bloom",
    description: "A cozy corner cafe with the best matcha lattes in town. Perfect for studying or catching up with friends.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop",
    location: "Downtown Arts District",
    rating: 4.8,
    reviews: 234,
    tags: ["matcha", "aesthetic", "wifi"],
    boosts: 156,
    priceRange: "$$",
    hours: "7am - 9pm",
    wifi: true,
    outlets: true,
  },
  {
    id: "2",
    name: "Cloud Nine Coffee",
    description: "Minimalist vibes with cloud-themed decor. Their cold brew is unmatched.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    location: "Uptown Square",
    rating: 4.6,
    reviews: 189,
    tags: ["cold brew", "minimalist", "quiet"],
    boosts: 142,
    priceRange: "$$$",
    hours: "6am - 8pm",
    wifi: true,
    outlets: true,
  },
  {
    id: "3",
    name: "The Bean Scene",
    description: "Industrial chic meets third-wave coffee. Great for remote work sessions.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    location: "Tech Hub",
    rating: 4.7,
    reviews: 312,
    tags: ["work-friendly", "espresso", "pastries"],
    boosts: 203,
    priceRange: "$$",
    hours: "6am - 10pm",
    wifi: true,
    outlets: true,
  },
  {
    id: "4",
    name: "Sip & Sketch",
    description: "Art gallery meets coffee shop. Local art on the walls, creativity in every cup.",
    image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600&h=400&fit=crop",
    location: "Gallery Row",
    rating: 4.5,
    reviews: 156,
    tags: ["artsy", "creative", "events"],
    boosts: 98,
    priceRange: "$$",
    hours: "8am - 7pm",
    wifi: true,
    outlets: false,
  },
  {
    id: "5",
    name: "Morning Glory",
    description: "Early bird special! Best breakfast burritos and pour-overs before noon.",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&h=400&fit=crop",
    location: "Sunrise District",
    rating: 4.9,
    reviews: 421,
    tags: ["breakfast", "pour-over", "cozy"],
    boosts: 287,
    priceRange: "$",
    hours: "5am - 2pm",
    wifi: true,
    outlets: true,
  },
  {
    id: "6",
    name: "Nocturne Cafe",
    description: "Late night vibes for the night owls. Jazz music and espresso martinis after dark.",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=400&fit=crop",
    location: "Night Market",
    rating: 4.4,
    reviews: 178,
    tags: ["night owl", "cocktails", "jazz"],
    boosts: 134,
    priceRange: "$$$",
    hours: "4pm - 2am",
    wifi: false,
    outlets: false,
  },
  {
    id: "7",
    name: "Plant Parent Cafe",
    description: "Surrounded by plants and good energy. Vegan treats and oat milk everything.",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&h=400&fit=crop",
    location: "Green Quarter",
    rating: 4.7,
    reviews: 267,
    tags: ["vegan", "plants", "sustainable"],
    boosts: 189,
    priceRange: "$$",
    hours: "7am - 6pm",
    wifi: true,
    outlets: true,
  },
  {
    id: "8",
    name: "Retro Roast",
    description: "Vintage decor with modern coffee. Vinyl records and single-origin beans.",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=400&fit=crop",
    location: "Old Town",
    rating: 4.6,
    reviews: 198,
    tags: ["vintage", "vinyl", "specialty"],
    boosts: 145,
    priceRange: "$$",
    hours: "8am - 8pm",
    wifi: true,
    outlets: true,
  },
]

export const reviews: Review[] = [
  {
    id: "1",
    cafeId: "1",
    author: "Alex Chen",
    avatar: "https://i.pravatar.cc/100?img=1",
    rating: 5,
    comment: "The matcha latte here is literally the best I have ever had. The vibes are immaculate!",
    date: "2 days ago",
  },
  {
    id: "2",
    cafeId: "1",
    author: "Jordan Kim",
    avatar: "https://i.pravatar.cc/100?img=2",
    rating: 4,
    comment: "Great spot for studying. Gets a bit crowded on weekends though.",
    date: "1 week ago",
  },
  {
    id: "3",
    cafeId: "1",
    author: "Sam Taylor",
    avatar: "https://i.pravatar.cc/100?img=3",
    rating: 5,
    comment: "Obsessed with this place! The aesthetic is so cute and the staff are super friendly.",
    date: "2 weeks ago",
  },
  {
    id: "4",
    cafeId: "2",
    author: "Riley Park",
    avatar: "https://i.pravatar.cc/100?img=4",
    rating: 5,
    comment: "Cloud Nine is my go-to for cold brew. So smooth and refreshing!",
    date: "3 days ago",
  },
  {
    id: "5",
    cafeId: "3",
    author: "Casey Wong",
    avatar: "https://i.pravatar.cc/100?img=5",
    rating: 4,
    comment: "Perfect work spot. Fast wifi and plenty of outlets. The espresso is top tier.",
    date: "5 days ago",
  },
]
