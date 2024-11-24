'use client';

import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { getDayName, getTodayHours } from '@/lib/utils';
import { SignOutButton, useAuth } from '@clerk/nextjs';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Calendar as CalendarIcon,
  MapPin,
  MenuIcon,
  Phone,
  Users,
  Utensils,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

const handleNavigation = (href: string) => {
  // If it's a hash link to the home page
  if (href.startsWith('/#')) {
    const elementId = href.replace('/#', '');

    // If we're already on the home page
    if (window.location.pathname === '/') {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Store the target section in sessionStorage
      sessionStorage.setItem('scrollTarget', elementId);
      // Navigate to home page
      window.location.href = '/';
    }
  } else {
    // Regular navigation for non-hash links
    window.location.href = href;
  }
};

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const { isSignedIn } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    {
      href: '/full-menu',
      icon: <Utensils className="h-7 w-7" />,
      text: 'Menus',
    },
    {
      href: '/#events',
      icon: <CalendarIcon className="h-7 w-7" />,
      text: 'Events',
    },
    {
      href: '/#jobs',
      icon: <Users className="h-7 w-7" />,
      text: 'Openings',
    },
    {
      href: '/#contact',
      icon: <Phone className="h-7 w-7" />,
      text: 'Contact',
    },
  ];

  return (
    <header
      className={`fixed z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-b from-[#0A0F0C] via-[#0A0F0C]/95 to-[#0A0F0C]/90 backdrop-blur-sm border-b border-[#E4A853]/20 pt-4 pb-2'
          : 'bg-gradient-to-b from-[#001F0F]/90 via-[#001F0F]/50 to-transparent py-8'
      }`}
    >
      <div className="container max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 relative">
          {/* Desktop Navigation - Left */}
          <nav className="hidden lg:flex items-center gap-4 lg:gap-8">
            <Link
              className="text-sm lg:text-base font-medium tracking-wider text-white hover:text-[#E4A853] transition-colors duration-200 
                         border-b-2 border-transparent hover:border-[#E4A853] py-2"
              href="/full-menu"
            >
              MENUS
            </Link>
            <button
              onClick={() => handleNavigation('/#events')}
              className="text-sm lg:text-base font-medium tracking-wider text-white hover:text-[#E4A853] transition-colors duration-200
                         border-b-2 border-transparent hover:border-[#E4A853] py-2"
            >
              EVENTS
            </button>
          </nav>

          {/* Logo - Centered */}
          <Link
            href="/"
            className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${
              isScrolled ? 'scale-75' : 'scale-100 transform -translate-y-1'
            }`}
          >
            <Image
              alt="Oh Tommy's Pub & Grill Logo"
              className="h-10 min-[400px]:h-12 sm:h-16 md:h-24 w-auto max-w-[180px] min-[400px]:max-w-[200px] sm:max-w-[300px]"
              height={96}
              width={300}
              src="/images/ohtommys-logo.png"
              style={{
                height: 'auto',
                width: 'auto',
              }}
              priority
            />
          </Link>

          {/* Desktop Navigation - Right */}
          <nav className="hidden lg:flex items-center gap-4 lg:gap-8">
            <button
              onClick={() => handleNavigation('/#jobs')}
              className="text-sm lg:text-base font-medium tracking-wider text-white hover:text-[#E4A853] transition-colors duration-200
                         border-b-2 border-transparent hover:border-[#E4A853] py-2"
            >
              OPENINGS
            </button>
            <button
              onClick={() => handleNavigation('/#contact')}
              className="text-sm lg:text-base font-medium tracking-wider text-white hover:text-[#E4A853] transition-colors duration-200
                         border-b-2 border-transparent hover:border-[#E4A853] py-2"
            >
              CONTACT
            </button>
            {isSignedIn && (
              <SignOutButton redirectUrl="/">
                <Button
                  variant="outline"
                  className="border-2 border-[#E4A853] text-[#E4A853] hover:bg-[#E4A853] hover:text-black 
                           transition-all duration-200 font-medium tracking-wider text-sm"
                >
                  Sign Out
                </Button>
              </SignOutButton>
            )}
          </nav>

          {/* Mobile Menu Button - Right */}
          <div className="lg:hidden ml-auto">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-4">
                  <MenuIcon className="h-6 w-6 text-white" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full h-[100dvh] bg-[#001F0F] border-l border-[#E4A853]/20 p-0 [&>button:first-child]:hidden data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
              >
                <VisuallyHidden asChild>
                  <DialogTitle>Navigation Menu</DialogTitle>
                </VisuallyHidden>

                <div className="flex flex-col h-full">
                  {/* Header - Fixed at top */}
                  <div className="flex-shrink-0 bg-[#001F0F] p-6 sm:p-8 border-b border-[#E4A853]/20">
                    <div className="flex items-center justify-between">
                      {/* Close Button on Left */}
                      <SheetClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
                        <X className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        <span className="sr-only">Close</span>
                      </SheetClose>
                      {/* Mobile menu logo - Added more vertical padding */}
                      <div className="absolute left-1/2 -translate-x-1/2 w-auto py-2 sm:py-4">
                        <Image
                          alt="Oh Tommy's Pub & Grill Logo"
                          className="h-10 min-[400px]:h-12 sm:h-16 w-auto max-w-[160px] min-[400px]:max-w-[180px] sm:max-w-[200px]"
                          height={64}
                          width={200}
                          src="/images/ohtommys-logo.png"
                          style={{
                            height: 'auto',
                            width: 'auto',
                          }}
                        />
                      </div>
                      {/* Empty div for spacing */}
                      <div className="w-8 sm:w-10" />
                    </div>
                  </div>

                  {/* Content area with flex layout - Added top padding */}
                  <div className="flex flex-col h-full justify-between">
                    {/* Quick actions and navigation - Added top padding */}
                    <div className="flex-grow overflow-y-auto pt-6 sm:pt-8">
                      {/* Quick Action Buttons - Added top margin */}
                      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 mt-2 sm:mt-4">
                        <a
                          href="tel:(573) 347-3133"
                          className="flex items-center justify-center gap-3 bg-[#E4A853] text-black py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold text-base sm:text-lg hover:bg-[#c28d3a] transition-colors"
                        >
                          <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                          Call Us Now
                        </a>
                        <a
                          href="https://maps.google.com/?q=6285+MO-7,+Roach,+MO+65787"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 bg-[#094023] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold text-base sm:text-lg hover:bg-[#0c5831] transition-colors"
                        >
                          <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                          Get Directions
                        </a>
                      </div>

                      {/* Navigation Links - Added top margin */}
                      <nav className="px-4 sm:px-6 py-4 mt-4 sm:mt-6">
                        <div className="flex flex-col items-center space-y-4">
                          {navigationLinks.map(({ href, icon, text }) => (
                            <button
                              key={href}
                              className="flex items-center justify-center gap-3 text-white hover:text-[#E4A853] transition-colors duration-200 py-3 w-full"
                              onClick={() => {
                                setIsOpen(false);
                                handleNavigation(href);
                              }}
                            >
                              {React.cloneElement(icon, {
                                className: 'h-5 w-5 sm:h-6 sm:w-6',
                              })}
                              <span className="font-playfair text-xl sm:text-2xl font-bold tracking-wide">
                                {text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </nav>
                    </div>

                    {/* Footer - Fixed at bottom */}
                    <div className="flex-shrink-0 bg-[#001F0F] p-4 sm:p-6 border-t border-[#E4A853]/20">
                      <div className="text-center">
                        <p className="text-[#E4A853] text-base sm:text-lg font-medium mb-2">
                          {getDayName()} Hours
                        </p>
                        <p className="text-white text-base sm:text-lg">
                          {getTodayHours()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
