'use client';

import { Beer, Clock, MapPin, Phone } from 'lucide-react';
import { Cormorant_Garamond, Playfair_Display } from 'next/font/google';
import Image from 'next/image';

const playfair = Playfair_Display({ subsets: ['latin'] });
const cormorant = Cormorant_Garamond({
  weight: ['600'],
  subsets: ['latin'],
});

export function Footer() {
  return (
    <footer className="relative bg-[#001F0F] text-white" id="contact">
      {/* Background Pattern - Matching Experience section */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #E4A853 12%, transparent 0, transparent 88%, #E4A853 0),
            linear-gradient(-45deg, #E4A853 12%, transparent 0, transparent 88%, #E4A853 0),
            linear-gradient(45deg, #E4A853 12%, transparent 0, transparent 88%, #E4A853 0),
            linear-gradient(-45deg, #E4A853 12%, transparent 0, transparent 88%, #E4A853 0)
          `,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0, 0 0, 25px 25px, 25px 25px',
        }}
      />

      {/* Vintage-style border top */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-[#001F0F] border-t-2 border-[#E4A853]/20"></div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-20 pb-12 relative">
        {/* Logo and Contact Section */}
        <div className="text-center mb-20">
          {/* Classic typography ornament */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#E4A853]/20 to-transparent"></div>
            <div className="text-[#E4A853] tracking-[0.3em] uppercase text-sm font-light">
              Est. 2023
            </div>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#E4A853]/20 to-transparent"></div>
          </div>

          <div className="flex items-center justify-center mb-12">
            <Image
              alt="Oh Tommy's Pub & Grill Logo"
              className="h-24 w-auto md:h-32"
              height={128}
              width={400}
              src="/images/ohtommys-bare.png"
              style={{
                width: 'auto',
                height: 'auto',
                maxHeight: '128px',
                maxWidth: '400px',
              }}
            />
          </div>

          <div className="inline-flex items-center gap-4 border-b-2 border-[#E4A853]/20 pb-2">
            <Phone className="h-8 w-8 text-[#E4A853]" />
            <a
              href="tel:(573) 347-3133"
              className={`${playfair.className} text-3xl md:text-4xl text-[#F5E6D3] hover:text-[#E4A853] transition-colors duration-300`}
            >
              (573) 347-3133
            </a>
          </div>
        </div>

        {/* Hours and Location Grid */}
        <div className="grid gap-12 md:grid-cols-3 max-w-5xl mx-auto border-t border-b border-[#E4A853]/10 py-12">
          {/* Pub Hours */}
          <div className="relative bg-black/20 backdrop-blur-sm border-2 border-[#F5E6D3]/10 p-6 rounded-lg">
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#F5E6D3]/20" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#F5E6D3]/20" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#F5E6D3]/20" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#F5E6D3]/20" />

            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 mb-8">
                <Beer className="h-8 w-8 text-[#E4A853]" />
                <h3
                  className={`${playfair.className} text-3xl font-medium text-[#F5E6D3]`}
                >
                  Pub Hours
                </h3>
              </div>
              <div className={`${cormorant.className} space-y-4 text-xl`}>
                <p className="flex justify-between items-center">
                  <span className="text-[#F5E6D3]/60">Monday-Tuesday</span>
                  <span className="text-[#E4A853] font-light">Closed</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-[#F5E6D3]/60">Wednesday-Thursday</span>
                  <span className="text-[#E4A853] font-light">11 AM–11 PM</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-[#F5E6D3]/60">Friday</span>
                  <span className="text-[#E4A853] font-light">11 AM–12 AM</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-[#F5E6D3]/60">Saturday</span>
                  <span className="text-[#E4A853] font-light">11 AM–11 PM</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-[#F5E6D3]/60">Sunday</span>
                  <span className="text-[#E4A853] font-light">12 PM–8 PM</span>
                </p>
              </div>
            </div>
          </div>

          {/* Kitchen Hours */}
          <div className="relative bg-black/20 backdrop-blur-sm border-2 border-[#F5E6D3]/10 p-6 rounded-lg">
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#F5E6D3]/20" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#F5E6D3]/20" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#F5E6D3]/20" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#F5E6D3]/20" />

            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 mb-8">
                <Clock className="h-8 w-8 text-[#E4A853]" />
                <h3
                  className={`${playfair.className} text-3xl font-medium text-[#F5E6D3]`}
                >
                  Kitchen Hours
                </h3>
              </div>
              <div className={`${cormorant.className} space-y-4 text-xl`}>
                <p className="flex justify-between items-center">
                  <span className="text-[#F5E6D3]/60">Monday-Friday</span>
                  <span className="text-[#E4A853] font-light">11 AM–9 PM</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-[#F5E6D3]/60">Saturday</span>
                  <span className="text-[#E4A853] font-light">10 AM–9 PM</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-[#F5E6D3]/60">Sunday</span>
                  <span className="text-[#E4A853] font-light">11 AM–7 PM</span>
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="relative bg-black/20 backdrop-blur-sm border-2 border-[#F5E6D3]/10 p-6 rounded-lg">
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#F5E6D3]/20" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#F5E6D3]/20" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#F5E6D3]/20" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#F5E6D3]/20" />

            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 mb-8">
                <MapPin className="h-8 w-8 text-[#E4A853]" />
                <h3
                  className={`${playfair.className} text-3xl font-medium text-[#F5E6D3]`}
                >
                  Location
                </h3>
              </div>
              <div className="space-y-4">
                <div className="relative h-[180px] w-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3139.21734954955!2d-92.9177499241006!3d38.11187757190238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c4e57e88d87ed1%3A0x5d3b4af8ac88999b!2sOh%20Tommy's%20Pub%20%26%20Grill!5e0!3m2!1sen!2sus!4v1731707506645!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 rounded-lg"
                  ></iframe>
                </div>
                <a
                  href="https://maps.google.com/?q=6285+MO-7,+Roach,+MO+65787"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cormorant.className} block text-center text-xl text-[#F5E6D3]/60 hover:text-[#E4A853] transition-colors duration-300`}
                >
                  6285 MO-7, Roach, MO 65787
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center">
          <p className="text-sm tracking-wide text-[#F5E6D3]/40">
            &copy; {new Date().getFullYear()} Oh Tommy&apos;s Pub & Grill. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
