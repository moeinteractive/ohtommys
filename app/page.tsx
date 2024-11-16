'use client'

import { Beer, Calendar, MenuIcon, Music, Phone, Utensils, Users, X } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import InputMask from 'react-input-mask-next'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

type FacebookPost = {
  id: string
  full_picture?: string
  message?: string
  created_time: string
}

// Utility functions to get business hours and current day
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

// Reusable custom button component with Celtic styling
const CelticButton = ({ 
  children, 
  onClick,
  className = "",
  type = "button"
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: "button" | "submit" | "reset"
}) => {
  return (
    <button
      type={type}
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

// Card component for displaying promotional content with Celtic styling
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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

// Component to fetch and display Facebook posts
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
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

// Type definitions for the job application form
type FormData = {
  name: string;
  phone: string;
  email: string;
  startDate: string;
  position: string;
  availableDays: string[];
  shifts: string[];
  experience: string;
}

// Form validation function for job applications
const validateForm = (data: FormData) => {
  const errors: Partial<Record<keyof FormData, string>> = {};
  
  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!data.phone.replace(/[^0-9]/g, '').match(/^\d{10}$/)) {
    errors.phone = 'Valid phone number is required';
  }
  
  if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Valid email is required';
  }
  
  if (!data.position) {
    errors.position = 'Please select a position';
  }
  
  if (data.availableDays.length === 0) {
    errors.availableDays = 'Please select at least one day';
  }
  
  if (data.shifts.length === 0) {
    errors.shifts = 'Please select at least one shift';
  }
  
  if (!data.experience.trim()) {
    errors.experience = 'Experience details are required';
  }
  
  return errors;
};

// Find the job application form section and add form validation
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(event.currentTarget);
  const data: FormData = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    startDate: formData.get('startDate') as string,
    position: formData.get('position') as string,
    availableDays: formData.getAll('availableDays') as string[],
    shifts: formData.getAll('shifts') as string[],
    experience: formData.get('experience') as string,
  };

  // Validate form
  const errors = validateForm(data);
  
  if (Object.keys(errors).length > 0) {
    // Handle validation errors
    console.error('Form validation errors:', errors);
    // You could display these errors to the user
    return;
  }

  // Process valid form submission
  try {
    const response = await fetch('/api/submit-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit application');
    }

    // Handle successful submission
    console.log('Application submitted successfully');
    // You could show a success message to the user
    
  } catch (error) {
    console.error('Error submitting application:', error);
    // You could show an error message to the user
  }
};

// Main page component
export default function Page() {
  // State for header scroll effect and mobile menu
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  // Add scroll event listener for header transparency effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with responsive navigation */}
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
                className="w-full sm:w-[400px] bg-[#001F0F] border-l border-[#E4A853]/20 p-0 [&>button:first-child]:hidden"
                aria-description="Navigation menu"
              >
                <div className="flex flex-col h-full">
                  {/* Header - Fixed at top */}
                  <div className="flex-shrink-0 bg-[#001F0F] p-6 border-b border-[#E4A853]/20 flex items-center justify-between">
                    <Image
                      alt="Oh Tommy's Pub & Grill Logo"
                      className="h-16 w-auto"
                      height={64}
                      width={200}
                      src="/images/ohtommys-logo.png"
                      style={{ height: '64px', width: 'auto' }}
                    />
                    <SheetClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
                      <X className="h-8 w-8 text-white" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                  </div>

                  {/* Content area with flex layout */}
                  <div className="flex flex-col h-full justify-between">
                    {/* Quick actions and navigation - scrollable if needed */}
                    <div className="flex-grow overflow-y-auto">
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
                      <nav className="px-6 py-4">
                        <div className="flex flex-col items-center space-y-4">
                          {[
                            { href: '#menu', icon: <Utensils className="h-7 w-7" />, text: 'Menus' },
                            { href: '#events', icon: <Calendar className="h-7 w-7" />, text: 'Events' },
                            { href: '#jobs', icon: <Users className="h-7 w-7" />, text: 'Openings' },
                            { href: '#contact', icon: <Phone className="h-7 w-7" />, text: 'Contact' }
                          ].map(({ href, icon, text }) => (
                            <Link 
                              key={href}
                              className="flex items-center justify-center gap-3 text-white hover:text-[#E4A853] transition-colors duration-200 py-3 w-full" 
                              href={href}
                              onClick={() => setIsOpen(false)}
                            >
                              {icon}
                              <span className="font-playfair text-2xl font-bold tracking-wide">{text}</span>
                            </Link>
                          ))}
                        </div>
                      </nav>
                    </div>

                    {/* Footer - Fixed at bottom */}
                    <div className="flex-shrink-0 bg-[#001F0F] p-6 border-t border-[#E4A853]/20">
                      <div className="text-center">
                        <p className="text-[#E4A853] text-lg font-medium mb-2">{getDayName()} Hours</p>
                        <p className="text-white text-lg">{getTodayHours()}</p>
                      </div>
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
              height={80}
              width={250}
              src="/images/ohtommys-logo.png"
              style={{ height: 'auto', maxHeight: '80px', width: 'auto' }}
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
        {/* Hero Section with video background */}
        <section className="relative min-h-screen" id="home">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover brightness-[0.7]"
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

        {/* Experience Section - showcasing pub features */}
        <section className="relative bg-[#001F0F] py-32" id="experience">
          {/* Celtic shamrock pattern background */}
          <div className="absolute inset-0 celtic-shamrock"></div>
          
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

        {/* Events Section - displaying upcoming events */}
        <section className="relative bg-[#001F0F] py-32" id="events">
          {/* Change from celtic-interlace to celtic-shamrock */}
          <div className="absolute inset-0 celtic-shamrock"></div>
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

        {/* Jobs Section - employment application form */}
        <section className="relative bg-black py-32" id="jobs">
          {/* Celtic knot background */}
          <div className="absolute inset-0 celtic-knot"></div>
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
                <form onSubmit={handleSubmit} className="grid gap-6">
                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-[#E4A853] text-lg mb-2 block">Full Name</Label>
                      <Input 
                        id="name" 
                        className="bg-black/50 border-[#E4A853]/20 text-white h-12 text-lg" 
                        placeholder="Enter your full name"
                        maxLength={50}
                        pattern="[A-Za-z\s]+"
                        title="Please enter a valid name (letters and spaces only)"
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-[#E4A853] text-lg mb-2 block">Phone Number</Label>
                      <InputMask
                        mask="(999) 999-9999"
                        id="phone"
                        name="phone"
                        placeholder="(573) 555-0123"
                        required
                        className="w-full bg-black/50 border-[#E4A853]/20 text-white text-lg rounded-lg focus:ring-[#E4A853] focus:border-[#E4A853]"
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
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        title="Please enter a valid email address"
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="start_date" className="text-[#E4A853] text-lg mb-2 block">When Can You Start?</Label>
                      <Input 
                        id="start_date" 
                        type="date" 
                        className="bg-black/50 border-[#E4A853]/20 text-white h-12 text-lg" 
                        min={new Date().toISOString().split('T')[0]}
                        required 
                      />
                    </div>
                  </div>
                  
                  {/* Position Selection */}
                  <div>
                    <Label htmlFor="position" className="text-[#E4A853] text-lg mb-2 block">Position Interest</Label>
                    <select 
                      id="position" 
                      defaultValue="" 
                      className="w-full appearance-none bg-black/50 border-2 border-[#E4A853]/20 text-white h-12 text-lg rounded-lg px-4 
                        focus:border-[#E4A853] focus:ring-[#E4A853] transition-all duration-300
                        hover:border-[#E4A853] cursor-pointer"
                      required
                    >
                      <option value="" disabled className="text-gray-400">Select a position</option>
                      <option value="cook" className="bg-[#001F0F] hover:bg-[#094023]">Cook</option>
                      <option value="bartender" className="bg-[#001F0F] hover:bg-[#094023]">Bartender</option>
                      <option value="waitstaff" className="bg-[#001F0F] hover:bg-[#094023]">Waitstaff</option>
                    </select>
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
                      placeholder="Tell us about your relevant experience in the position you're applying for"
                      maxLength={1000}
                      required
                    />
                  </div>
                  
                  <CelticButton type="submit" className="w-full mt-4">
                    Submit Application
                  </CelticButton>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section - Facebook feed integration */}
        <section className="relative bg-black py-24" id="social">
          {/* Add Celtic knot background */}
          <div className="absolute inset-0 celtic-knot"></div>
          
          <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
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

      {/* Footer with business information */}
      <footer className="relative bg-[#001F0F] text-white py-24">
        {/* Celtic weave background */}
        <div className="absolute inset-0 celtic-weave"></div>
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
                className="h-24 w-auto md:h-32"
                height={128}
                width={400}
                src="/images/ohtommys-bare.png"
                style={{ height: 'auto', maxHeight: '128px', width: 'auto' }}
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

      {/* Global styles for fonts and animations */}
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

        .celtic-pattern {
          background-color: #001F0F;
          opacity: 0.05;
          background-image: 
            linear-gradient(30deg, #E4A853 12%, transparent 12.5%, transparent 87%, #E4A853 87.5%, #E4A853),
            linear-gradient(150deg, #E4A853 12%, transparent 12.5%, transparent 87%, #E4A853 87.5%, #E4A853),
            linear-gradient(30deg, #E4A853 12%, transparent 12.5%, transparent 87%, #E4A853 87.5%, #E4A853),
            linear-gradient(150deg, #E4A853 12%, transparent 12.5%, transparent 87%, #E4A853 87.5%, #E4A853),
            linear-gradient(60deg, #E4A85377 25%, transparent 25.5%, transparent 75%, #E4A85377 75%, #E4A85377),
            linear-gradient(60deg, #E4A85377 25%, transparent 25.5%, transparent 75%, #E4A85377 75%, #E4A85377);
          background-size: 80px 140px;
          background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
        }

        .celtic-knot {
          background-color: #001F0F;
          opacity: 0.05;
          background-image: 
            radial-gradient(circle at 100% 150%, #E4A853 24%, #001F0F 25%, #001F0F 28%, #E4A853 29%, #E4A853 36%, #001F0F 36%, #001F0F 40%, transparent 40%, transparent),
            radial-gradient(circle at 0 150%, #E4A853 24%, #001F0F 25%, #001F0F 28%, #E4A853 29%, #E4A853 36%, #001F0F 36%, #001F0F 40%, transparent 40%, transparent),
            radial-gradient(circle at 50% 100%, #E4A853 10%, #001F0F 11%, #001F0F 23%, #E4A853 24%, #E4A853 30%, #001F0F 31%, #001F0F 43%, transparent 43%, transparent),
            radial-gradient(circle at 100% 50%, #E4A853 5%, #001F0F 6%, #001F0F 15%, #E4A853 16%, #E4A853 20%, #001F0F 21%, #001F0F 30%, transparent 30%, transparent),
            radial-gradient(circle at 0 50%, #E4A853 5%, #001F0F 6%, #001F0F 15%, #E4A853 16%, #E4A853 20%, #001F0F 21%, #001F0F 30%, transparent 30%, transparent);
          background-size: 100px 50px;
        }

        .celtic-weave {
          background-color: #001F0F;
          opacity: 0.05;
          background-image: 
            linear-gradient(45deg, #E4A853 12%, transparent 0, transparent 88%, #E4A853 0),
            linear-gradient(-45deg, #E4A853 12%, transparent 0, transparent 88%, #E4A853 0),
            linear-gradient(45deg, #E4A853 12%, transparent 0, transparent 88%, #E4A853 0),
            linear-gradient(-45deg, #E4A853 12%, transparent 0, transparent 88%, #E4A853 0);
          background-size: 40px 40px;
          background-position: 0 0, 0 0, 20px 20px, 20px 20px;
        }

        /* Celtic Shamrock Pattern for Experience section */
        .celtic-shamrock {
          background-color: #001F0F;
          opacity: 0.05;
          background-image: 
            radial-gradient(circle at 50% 50%, #E4A853 2px, transparent 2px),
            radial-gradient(circle at calc(50% + 10px) calc(50% - 10px), #E4A853 2px, transparent 2px),
            radial-gradient(circle at calc(50% - 10px) calc(50% - 10px), #E4A853 2px, transparent 2px),
            radial-gradient(circle at calc(50% + 10px) calc(50% + 10px), #E4A853 2px, transparent 2px),
            radial-gradient(circle at calc(50% - 10px) calc(50% + 10px), #E4A853 2px, transparent 2px);
          background-size: 40px 40px;
          background-position: 0 0;
        }

        /* Celtic Interlace Pattern for Events section */
        .celtic-interlace {
          background-color: #001F0F;
          opacity: 0.05;
          background-image: 
            linear-gradient(45deg, #E4A853 2px, transparent 2px),
            linear-gradient(-45deg, #E4A853 2px, transparent 2px),
            linear-gradient(45deg, transparent 2px, #E4A853 3px, transparent 3px),
            linear-gradient(-45deg, transparent 2px, #E4A853 3px, transparent 3px);
          background-size: 30px 30px;
          background-position: 0 0, 0 0, 15px 15px, 15px 15px;
        }
      `}</style>
    </div>
  )
}