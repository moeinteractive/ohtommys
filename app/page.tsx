'use client'

import { Beer, Calendar, MenuIcon, Music, Phone, Utensils, Users, X } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

type FacebookPost = {
  id: string
  full_picture?: string
  message?: string
  created_time: string
}

const getTodayHours = () => {
  const today = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
  
  switch (today) {
    case 0: // Sunday
      return "12:00 PM - 8:00 PM";
    case 1: // Monday
    case 2: // Tuesday
      return "Closed";
    case 3: // Wednesday
    case 4: // Thursday
    case 6: // Saturday
      return "11:00 AM - 11:00 PM";
    case 5: // Friday
      return "11:00 AM - 12:00 AM";
    default:
      return "11:00 AM - 11:00 PM";
  }
};

const getDayName = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

const CelticButton = ({ 
  children, 
  onClick,
  className = ""
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden group
        px-8 py-4 rounded-lg
        transition-all duration-300
        ${className}
      `}
    >
      {/* Main background */}
      <div className="absolute inset-0 bg-[#E4A853] transition-all duration-300 group-hover:bg-[#c28d3a]" />
      
      {/* Border effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-[2px] border-2 border-black/20 rounded-[6px]" />
      </div>
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="font-playfair text-xl md:text-2xl font-bold tracking-wider text-black">
          {children}
        </span>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </button>
  )
}

const PromotionCard = ({ 
  title,
  mainText,
  ctaText,
  imageSrc,
  onClick
}: {
  title: string
  mainText: string
  ctaText: string
  imageSrc: string
  onClick?: () => void
}) => {
  return (
    <div className="relative group overflow-hidden rounded-xl">
      {/* Main container with decorative border */}
      <div className="relative border-2 border-[#E4A853]/30 bg-black/40 backdrop-blur-sm h-full p-1">
        {/* Celtic corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#E4A853]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#E4A853]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#E4A853]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#E4A853]" />
        
        {/* Content Container */}
        <div className="h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-[300px]">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient overlay with reduced opacity */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
          
          {/* Text Content */}
          <div className="relative flex-grow flex flex-col p-8 bg-gradient-to-b from-black/90 to-[#001F0F]/90">
            {/* Decorative line above title */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-[#E4A853]" />
            
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-[#E4A853] mb-4 text-center">
              {title}
            </h3>
            
            <p className="font-cormorant text-xl md:text-2xl text-white mb-8 text-center leading-relaxed flex-grow">
              {mainText}
            </p>
            
            {/* Custom styled button */}
            <button 
              onClick={onClick}
              className="relative overflow-hidden group/btn w-full bg-[#E4A853] hover:bg-[#c28d3a] 
                       text-black font-bold py-4 px-8 rounded-lg transition-all duration-300 
                       transform hover:scale-105 hover:shadow-xl"
            >
              <div className="absolute inset-0 border border-black/10 rounded-lg" />
              <span className="relative font-playfair text-lg tracking-wider">
                {ctaText}
              </span>
              <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 
                            transition-opacity duration-300 bg-gradient-to-r 
                            from-transparent via-white/10 to-transparent" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const FacebookPosts = () => {
  const [posts, setPosts] = React.useState<FacebookPost[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/facebook-posts')
        const data = await response.json()
        setPosts(data.data || [])
      } catch (error) {
        console.error('Failed to fetch Facebook posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="aspect-square animate-pulse bg-gray-800 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div key={post.id} className="group relative aspect-square overflow-hidden rounded-lg">
          {post.full_picture ? (
            <Image
              alt={post.message?.slice(0, 100) || 'Facebook post'}
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              height={400}
              width={400}
              src={post.full_picture}
            />
          ) : (
            <div className="h-full bg-black/50 flex items-center justify-center p-6">
              <p className="text-white text-center font-cormorant">
                {post.message?.slice(0, 150)}...
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-full items-center justify-center p-6">
              <p className="text-white text-center font-cormorant">
                {post.message?.slice(0, 150)}...
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={`fixed z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? 'top-0 bg-[#094023]/95 backdrop-blur-sm border-b border-[#E4A853]/20 py-2' 
            : 'top-4 bg-transparent py-4'
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex h-20 items-center justify-between relative">
          {/* Desktop Navigation - Left */}
          <nav className="hidden items-center gap-12 md:flex">
            <Link className="text-lg font-medium tracking-wider text-white hover:text-[#E4A853] transition-colors duration-200" href="#menu">
              MENUS
            </Link>
            <Link className="text-lg font-medium tracking-wider text-white hover:text-[#E4A853] transition-colors duration-200" href="#events">
              EVENTS
            </Link>
          </nav>
          
          {/* Mobile Menu Button - Right */}
          <div className="md:hidden ml-auto z-50">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <MenuIcon className="h-6 w-6 text-white" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-[400px] bg-[#001F0F] border-l border-[#E4A853]/20 p-0"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header with Close Button */}
                  <div className="p-6 border-b border-[#E4A853]/20 flex items-center justify-between">
                    <Image
                      alt="Oh Tommy's Pub & Grill Logo"
                      className="h-16 w-auto"
                      height="64"
                      src="/images/ohtommys-logo.png"
                      width="200"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-[#E4A853]"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="p-6 space-y-4">
                    <a 
                      href="tel:(573) 347-3133"
                      className="flex items-center justify-center gap-3 bg-[#E4A853] text-black py-4 px-6 rounded-lg font-bold text-lg hover:bg-[#c28d3a] transition-colors"
                    >
                      <Phone className="h-6 w-6" />
                      Call Us Now
                    </a>
                    <a 
                      href="https://maps.google.com/?q=6285+MO-7,+Roach,+MO+65787"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-[#094023] text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-[#0c5831] transition-colors"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Get Directions
                    </a>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 px-6 py-8">
                    <div className="space-y-6">
                      <Link 
                        className="flex flex-col items-center text-white hover:text-[#E4A853] transition-colors duration-200 py-3" 
                        href="#menu"
                        onClick={() => setIsOpen(false)}
                      >
                        <Utensils className="h-7 w-7 mb-2" />
                        <span className="text-2xl font-playfair font-bold tracking-wide">Menus</span>
                      </Link>
                      <Link 
                        className="flex flex-col items-center text-white hover:text-[#E4A853] transition-colors duration-200 py-3" 
                        href="#events"
                        onClick={() => setIsOpen(false)}
                      >
                        <Calendar className="h-7 w-7 mb-2" />
                        <span className="text-2xl font-playfair font-bold tracking-wide">Events</span>
                      </Link>
                      <Link 
                        className="flex flex-col items-center text-white hover:text-[#E4A853] transition-colors duration-200 py-3" 
                        href="#jobs"
                        onClick={() => setIsOpen(false)}
                      >
                        <Users className="h-7 w-7 mb-2" />
                        <span className="text-2xl font-playfair font-bold tracking-wide">Openings</span>
                      </Link>
                      <Link 
                        className="flex flex-col items-center text-white hover:text-[#E4A853] transition-colors duration-200 py-3" 
                        href="#contact"
                        onClick={() => setIsOpen(false)}
                      >
                        <Phone className="h-7 w-7 mb-2" />
                        <span className="text-2xl font-playfair font-bold tracking-wide">Contact</span>
                      </Link>
                    </div>
                  </nav>

                  {/* Footer */}
                  <div className="p-6 border-t border-[#E4A853]/20">
                    <div className="text-center">
                      <p className="text-[#E4A853] text-lg font-medium mb-2">{getDayName()} Hours</p>
                      <p className="text-white text-lg">{getTodayHours()}</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo - Centered */}
          <Link 
            href="#home" 
            className={`absolute left-[40%] md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:opacity-90 transition-all duration-300 ${
              isScrolled ? 'scale-75' : 'scale-100'
            }`}
          >
            <Image
              alt="Oh Tommy's Pub & Grill Logo"
              className="h-12 w-auto md:h-20"
              height="96"
              src="/images/ohtommys-logo.png"
              width="300"
              priority
            />
          </Link>

          {/* Desktop Navigation - Right */}
          <nav className="hidden items-center gap-12 md:flex">
            <Link className="text-lg font-medium tracking-wider text-white hover:text-[#E4A853] transition-colors duration-200" href="#jobs">
              OPENINGS
            </Link>
            <Link className="text-lg font-medium tracking-wider text-white hover:text-[#E4A853] transition-colors duration-200" href="#contact">
              CONTACT
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative min-h-screen" id="home">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover brightness-[0.7]"
            poster="/images/video-poster.jpg"
          >
            <source src="/images/video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/50" />
          <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
            {/* Animate the main heading with a fade-in and slide-up effect */}
            <h1 className="font-playfair mb-6 max-w-4xl text-4xl font-bold tracking-tight text-white 
                           drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl
                           animate-[fadeIn_1s_ease-out,slideUp_1s_ease-out]"
            >
              Great Food, Fine Drinks, Good Times &
              <span className="font-great-vibes block text-[#E4A853] drop-shadow-lg 
                              text-5xl sm:text-6xl md:text-7xl mt-4
                              animate-[fadeIn_1.5s_ease-out,slideUp_1.5s_ease-out]"
              >
                Old Friends
              </span>
            </h1>
            
            {/* Increase subheading text size and add animation */}
            <p className="font-cormorant mb-12 max-w-2xl text-2xl sm:text-2xl lg:text-3xl 
                          text-white drop-shadow-lg font-semibold leading-tight
                          animate-[fadeIn_2s_ease-out,slideUp_2s_ease-out]"
            >
              Experience authentic Irish hospitality at the Lake of the Ozarks&apos; finest pub & grill
            </p>
            
            {/* Adjust button container and reduce button size on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full max-w-xl mx-auto
                            animate-[fadeIn_2.5s_ease-out,slideUp_2.5s_ease-out]"
            >
              <CelticButton 
                onClick={() => window.location.href = '#menu'} 
                className="flex-1 shadow-lg text-base sm:text-xl py-2 px-4 sm:py-4 sm:px-8" // Reduced padding and adjusted text
              >
                VIEW FULL MENU
              </CelticButton>
              <CelticButton 
                onClick={() => window.location.href = '#specials'} 
                className="flex-1 shadow-lg text-base sm:text-xl py-2 px-4 sm:py-4 sm:px-8" // Reduced padding and adjusted text
              >
                VIEW SPECIALS
              </CelticButton>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-gradient-to-t from-black/80 to-transparent pt-8">
            <div className="grid grid-cols-3 gap-2 md:gap-8 text-center text-white px-2 md:px-8 pb-4">
              <div className="border-r border-white/20 px-1 md:px-8">
                <p className="font-cormorant text-base md:text-lg font-semibold drop-shadow-lg">Monday-Tuesday</p>
                <p className="text-[#E4A853] text-base md:text-lg font-semibold drop-shadow-lg">Closed</p>
              </div>
              <div className="border-r border-white/20 px-1 md:px-8">
                <p className="font-cormorant text-base md:text-lg font-semibold drop-shadow-lg">Wed-Saturday</p>
                <p className="text-[#E4A853] text-base md:text-lg font-semibold drop-shadow-lg">11am - 11pm</p>
              </div>
              <div className="px-1 md:px-8">
                <p className="font-cormorant text-base md:text-lg font-semibold drop-shadow-lg">Sunday</p>
                <p className="text-[#E4A853] text-base md:text-lg font-semibold drop-shadow-lg">12pm - 8pm</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[#001F0F] py-32" id="experience">
          {/* Celtic-inspired background pattern */}
          <div className="absolute inset-0 opacity-5 bg-[url('/celtic-pattern.png')] bg-repeat"></div>
          
          <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
            <div className="text-center mb-20">
              {/* Decorative elements */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-px bg-[#E4A853]"></div>
                <div className="w-3 h-3 rotate-45 bg-[#E4A853]"></div>
                <div className="w-16 h-px bg-[#E4A853]"></div>
              </div>
              
              <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Experience Oh Tommy&apos;s
              </h2>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-24 h-px bg-[#E4A853]"></div>
                <Beer className="h-8 w-8 text-[#E4A853]" />
                <div className="w-24 h-px bg-[#E4A853]"></div>
              </div>
              
              <p className="font-cormorant text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto italic">
                Your Home Away From Home at the Lake of the Ozarks&apos; finest pub & grill
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              <PromotionCard 
                title="Live Entertainment"
                mainText="Featuring the best local bands and entertainment at the Lake. Join us for live music, karaoke nights, and more!"
                ctaText="View Schedule"
                imageSrc="/images/band.jpg"
                onClick={() => window.location.href = '#events'}
              />
              <PromotionCard 
                title="Cornhole & Karaoke"
                mainText="Join us every Thursday for competitive cornhole tournaments and karaoke! Win prizes, enjoy drink specials, and show off your singing skills."
                ctaText="Join The Fun"
                imageSrc="/images/corhole2.jpg"
                onClick={() => window.location.href = '#events'}
              />
              <PromotionCard 
                title="Special Events"
                mainText="From holiday celebrations to Bike Fest and our KC Chiefs games! Join us for themed parties, decorations, special menus, and unforgettable memories with friends and family."
                ctaText="SEE ALL EVENTS"
                imageSrc="/images/halloween.jpg"
                onClick={() => window.location.href = '#events'}
              />
            </div>

            <div className="mt-20 text-center">
              <div className="inline-flex flex-col items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl p-8 border-2 border-[#E4A853]/20">
                <div className="flex items-center gap-3 text-[#E4A853] text-2xl">
                  <Calendar className="h-8 w-8" />
                  <span className="font-cormorant font-semibold">Daily Specials & Events</span>
                </div>
                <p className="font-cormorant text-white text-xl tracking-wider">
                  Live Music Every Weekend • Karaoke • Sports • Holiday Celebrations
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[#001F0F] py-32" id="events">
          {/* Celtic-inspired background pattern */}
          <div className="absolute inset-0 opacity-5 bg-[url('/celtic-pattern.png')] bg-repeat"></div>
          
          <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-px bg-[#E4A853]"></div>
                <div className="w-3 h-3 rotate-45 bg-[#E4A853]"></div>
                <div className="w-16 h-px bg-[#E4A853]"></div>
              </div>
              
              <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Upcoming Events
              </h2>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-24 h-px bg-[#E4A853]"></div>
                <Music className="h-8 w-8 text-[#E4A853]" />
                <div className="w-24 h-px bg-[#E4A853]"></div>
              </div>
              
              <p className="font-cormorant text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto italic">
                Join us for live music, karaoke, and special celebrations
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  date: "NOV 23",
                  title: "Thanksgiving Celebration",
                  time: "11:00 AM - 8:00 PM",
                  description: "Join us for our special Thanksgiving feast! Traditional dinner with all the fixings, football games, and holiday cheer with friends and family."
                },
                {
                  date: "DEC 16",
                  title: "Christmas Party",
                  time: "7:00 PM - 11:00 PM",
                  description: "Annual Christmas celebration featuring live music, ugly sweater contest, holiday drink specials, and festive atmosphere!"
                },
                {
                  date: "DEC 24",
                  title: "Christmas Eve",
                  time: "11:00 AM - 6:00 PM",
                  description: "Special holiday hours with festive drinks and appetizers. Come celebrate with us before your family gatherings!"
                },
                {
                  date: "DEC 31",
                  title: "New Year's Eve Bash",
                  time: "8:00 PM - 1:00 AM",
                  description: "Ring in 2024 with live music, champagne toast at midnight, party favors, and our special late night menu!"
                },
                {
                  date: "JAN 1",
                  title: "New Year's Day",
                  time: "12:00 PM - 8:00 PM",
                  description: "Start 2024 right with our recovery brunch menu, Bloody Mary bar, and all the football games on our big screens!"
                },
                {
                  date: "JAN 6",
                  title: "Live Music Night",
                  time: "8:00 PM - 11:00 PM",
                  description: "Kick off the new year with great live music, amazing drinks, and the best atmosphere at the Lake!"
                }
              ].map((event) => (
                <div key={event.date} className="relative rounded-xl bg-black/40 backdrop-blur-sm border-2 border-[#E4A853]/20 p-8 transform transition-all duration-300 hover:scale-105">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                    <div className="bg-[#E4A853] text-black px-6 py-2 rounded-full font-bold text-xl">
                      {event.date}
                    </div>
                  </div>
                  <h3 className="font-playfair text-3xl font-bold text-[#E4A853] mb-4 mt-4 text-center">
                    {event.title}
                  </h3>
                  <p className="font-cormorant text-2xl text-white mb-4 text-center">
                    {event.time}
                  </p>
                  <p className="font-cormorant text-xl text-gray-300 text-center mb-6">
                    {event.description}
                  </p>
                  <CelticButton onClick={() => {}} className="w-full">
                    Learn More
                  </CelticButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-black py-32" id="jobs">
          {/* Celtic-inspired background pattern */}
          <div className="absolute inset-0 opacity-5 bg-[url('/celtic-pattern.png')] bg-repeat"></div>
          
          <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-px bg-[#E4A853]"></div>
                <div className="w-3 h-3 rotate-45 bg-[#E4A853]"></div>
                <div className="w-16 h-px bg-[#E4A853]"></div>
              </div>
              
              <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Job Openings
              </h2>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-24 h-px bg-[#E4A853]"></div>
                <Beer className="h-8 w-8 text-[#E4A853]" />
                <div className="w-24 h-px bg-[#E4A853]"></div>
              </div>
              
              <p className="font-cormorant text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto italic mb-12">
                Become part of our family at Oh Tommy&apos;s
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="relative rounded-xl bg-[#001F0F]/80 backdrop-blur-sm border-2 border-[#E4A853]/20 p-8 md:p-12">
                <form className="grid gap-6">
                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-[#E4A853] text-lg mb-2 block">Full Name</Label>
                      <Input 
                        id="name" 
                        className="bg-black/50 border-[#E4A853]/20 text-white h-12 text-lg" 
                        placeholder="Enter your full name" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-[#E4A853] text-lg mb-2 block">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        className="bg-black/50 border-[#E4A853]/20 text-white h-12 text-lg" 
                        placeholder="(573) XXX-XXXX" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="text-[#E4A853] text-lg mb-2 block">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        className="bg-black/50 border-[#E4A853]/20 text-white h-12 text-lg" 
                        placeholder="Enter your email" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="start_date" className="text-[#E4A853] text-lg mb-2 block">When Can You Start?</Label>
                      <Input 
                        id="start_date" 
                        type="date" 
                        className="bg-black/50 border-[#E4A853]/20 text-white h-12 text-lg" 
                        required 
                      />
                    </div>
                  </div>
                  
                  {/* Position Selection */}
                  <div>
                    <Label htmlFor="position" className="text-[#E4A853] text-lg mb-2 block">Position Interest</Label>
                    <div className="relative">
                      <select 
                        id="position" 
                        className="w-full appearance-none bg-black/50 border-2 border-[#E4A853]/20 text-white h-12 text-lg rounded-lg px-4 
                          focus:border-[#E4A853] focus:ring-[#E4A853] transition-all duration-300
                          hover:border-[#E4A853] cursor-pointer"
                        required
                      >
                        <option value="" disabled selected className="text-gray-400">Select a position</option>
                        <option value="cook" className="bg-[#001F0F] hover:bg-[#094023]">Cook</option>
                        <option value="bartender" className="bg-[#001F0F] hover:bg-[#094023]">Bartender</option>
                        <option value="waitstaff" className="bg-[#001F0F] hover:bg-[#094023]">Waitstaff</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg 
                          className="w-5 h-5 text-[#E4A853]" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Availability */}
                  <div>
                    <Label className="text-[#E4A853] text-lg mb-4 block">Available Days to Work</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { day: 'Monday', closed: true },
                        { day: 'Tuesday', closed: true },
                        { day: 'Wednesday', closed: false },
                        { day: 'Thursday', closed: false },
                        { day: 'Friday', closed: false },
                        { day: 'Saturday', closed: false },
                        { day: 'Sunday', closed: false }
                      ].map(({ day, closed }) => (
                        <div key={day} className={`flex items-center ${closed ? 'opacity-50' : ''}`}>
                          <input 
                            type="checkbox" 
                            id={day.toLowerCase()} 
                            className="w-5 h-5 rounded border-[#E4A853]/20 bg-black/50 text-[#E4A853] focus:ring-[#E4A853]"
                            disabled={closed}
                          />
                          <Label 
                            htmlFor={day.toLowerCase()} 
                            className={`text-white text-lg ml-2 ${closed ? 'line-through' : ''}`}
                          >
                            {day}
                          </Label>
                          {closed && (
                            <span className="text-[#E4A853]/60 text-sm ml-1">(Closed)</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-[#E4A853]/60 text-sm mt-2 italic">
                      Note: We are closed on Mondays and Tuesdays
                    </p>
                  </div>

                  {/* Shift Preference */}
                  <div>
                    <Label className="text-[#E4A853] text-lg mb-4 block">Preferred Shifts</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['Morning', 'Afternoon', 'Evening'].map((shift) => (
                        <div key={shift} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id={shift.toLowerCase()} 
                            className="w-5 h-5 rounded border-[#E4A853]/20 bg-black/50 text-[#E4A853] focus:ring-[#E4A853]"
                          />
                          <Label htmlFor={shift.toLowerCase()} className="text-white text-lg">{shift}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="experience" className="text-[#E4A853] text-lg mb-2 block">Experience</Label>
                    <Textarea
                      className="bg-black/50 border-[#E4A853]/20 text-white min-h-[150px] text-lg"
                      id="experience"
                      placeholder="Tell us about your relevant experience in the position you&apos;re applying for"
                      required
                    />
                  </div>
                  
                  <CelticButton onClick={() => {}} className="w-full mt-4">
                    Submit Application
                  </CelticButton>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black py-24" id="social">
          <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="font-playfair mb-12 text-center text-4xl font-bold text-white">Follow Us on Facebook</h2>
            <FacebookPosts />
            <div className="mt-12 text-center">
              <CelticButton 
                onClick={() => window.open('https://www.facebook.com/ohtommys.pubgrill', '_blank')}
                className="bg-[#E4A853] text-black hover:bg-[#c28d3a]"
              >
                Visit Our Facebook Page
              </CelticButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative bg-[#001F0F] text-white py-24">
        {/* Celtic-inspired background pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('/celtic-pattern.png')] bg-repeat"></div>
        
        <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
          {/* Logo and Phone Section */}
          <div className="text-center mb-20">
            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px bg-[#E4A853]"></div>
              <div className="w-3 h-3 rotate-45 bg-[#E4A853]"></div>
              <div className="w-16 h-px bg-[#E4A853]"></div>
            </div>

            <div className="flex items-center justify-center mb-8">
              <Image
                alt="Oh Tommy's Pub & Grill Logo"
                className="h-24 w-auto md:h-32 transition-transform duration-300 hover:scale-105"
                height="128"
                src="/images/ohtommys-bare.png"
                width="400"
              />
            </div>

            <div className="flex items-center justify-center gap-3 text-3xl md:text-4xl mb-4">
              <Phone className="h-8 w-8 text-[#E4A853]" />
              <a href="tel:(573) 347-3133" className="font-cormorant hover:text-[#E4A853] font-semibold transition-colors duration-300">
                (573) 347-3133
              </a>
            </div>
          </div>

          {/* Hours and Map Grid */}
          <div className="grid gap-8 md:gap-12 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Pub Hours */}
            <div className="relative rounded-xl bg-black/30 p-8 backdrop-blur border-2 border-[#E4A853]/20 transform transition-all duration-300 hover:scale-[1.02] hover:border-[#E4A853]/40">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Beer className="h-8 w-8 text-[#E4A853]" />
              </div>
              <h3 className="font-playfair mb-6 text-3xl md:text-3xl font-semibold text-[#E4A853] text-center">
                Pub Hours
              </h3>
              <div className="font-cormorant space-y-4 text-xl md:text-xl">
                <p className="flex justify-between">
                  <span>Monday-Tuesday</span>
                  <span className="text-[#E4A853]">Closed</span>
                </p>
                <p className="flex justify-between">
                  <span>Wednesday-Thursday</span>
                  <span className="text-[#E4A853]">11 AM–11 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Friday</span>
                  <span className="text-[#E4A853]">11 AM–12 AM</span>
                </p>
                <p className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-[#E4A853]">11 AM–11 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-[#E4A853]">12 PM–8 PM</span>
                </p>
              </div>
            </div>

            {/* Kitchen Hours */}
            <div className="relative rounded-xl bg-black/30 p-8 backdrop-blur border-2 border-[#E4A853]/20 transform transition-all duration-300 hover:scale-[1.02] hover:border-[#E4A853]/40">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <svg className="h-8 w-8 text-[#E4A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-playfair mb-6 text-3xl md:text-3xl font-semibold text-[#E4A853] text-center">
                Kitchen Hours
              </h3>
              <div className="font-cormorant space-y-4 text-xl md:text-xl">
                <p className="flex justify-between">
                  <span>Monday-Friday</span>
                  <span className="text-[#E4A853]">11 AM–9 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-[#E4A853]">10 AM–9 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-[#E4A853]">11 AM–7 PM</span>
                </p>
              </div>
            </div>

            {/* Find Us */}
            <div className="relative rounded-xl bg-black/30 p-8 backdrop-blur border-2 border-[#E4A853]/20 transform transition-all duration-300 hover:scale-[1.02] hover:border-[#E4A853]/40">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <svg className="h-8 w-8 text-[#E4A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-playfair mb-6 text-3xl md:text-3xl font-semibold text-[#E4A853] text-center">
                Find Us
              </h3>
              <div className="space-y-6">
                <div className="relative h-[200px] w-full rounded-lg overflow-hidden border-2 border-[#E4A853]/20">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3139.21734954955!2d-92.9177499241006!3d38.11187757190238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c4e57e88d87ed1%3A0x5d3b4af8ac88999b!2sOh%20Tommy&apos;s%20Pub%20%26%20Grill!5e0!3m2!1sen!2sus!4v1731707506645!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                </div>
                <a 
                  href="https://maps.google.com/?q=6285+MO-7,+Roach,+MO+65787"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center font-cormorant text-2xl hover:text-[#E4A853] transition-colors duration-200"
                >
                  6285 MO-7, Roach, MO 65787
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-20 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-[#E4A853]/40"></div>
              <div className="w-2 h-2 rotate-45 bg-[#E4A853]/40"></div>
              <div className="w-12 h-px bg-[#E4A853]/40"></div>
            </div>
            <p className="font-cormorant text-2xl md:text-2xl text-gray-300">
              © {new Date().getFullYear()} Oh Tommy&apos;s Pub & Grill. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Cormorant:wght@400;600&family=Great+Vibes&family=Irish+Grover&display=swap');

        .font-playfair {
          font-family: 'Playfair Display', serif;
        }

        .font-cormorant {
          font-family: 'Cormorant', serif;
        }

        .font-great-vibes {
          font-family: 'Great Vibes', cursive;
        }

        .font-irish {
          font-family: 'Irish Grover', cursive;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}