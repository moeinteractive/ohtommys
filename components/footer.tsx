'use client';

import { Beer, Phone } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="relative bg-[#001F0F] text-white py-24" id="contact">
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
              style={{
                width: 'auto',
                height: 'auto',
                maxHeight: '128px',
                maxWidth: '400px',
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-3 text-3xl md:text-4xl mb-4">
            <Phone className="h-8 w-8 text-[#E4A853]" />
            <a
              href="tel:(573) 347-3133"
              className="font-cormorant hover:text-[#E4A853] font-semibold transition-colors duration-300"
            >
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
              <svg
                className="h-8 w-8 text-[#E4A853]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
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
              <svg
                className="h-8 w-8 text-[#E4A853]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="font-playfair mb-6 text-3xl md:text-3xl font-semibold text-[#E4A853] text-center">
              Find Us
            </h3>
            <div className="space-y-6">
              <div className="relative h-[200px] w-full rounded-lg overflow-hidden border-2 border-[#E4A853]/20">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3139.21734954955!2d-92.9177499241006!3d38.11187757190238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c4e57e88d87ed1%3A0x5d3b4af8ac88999b!2sOh%20Tommy's%20Pub%20%26%20Grill!5e0!3m2!1sen!2sus!4v1731707506645!5m2!1sen!2sus"
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
            &copy; {new Date().getFullYear()} Oh Tommy&apos;s Pub & Grill. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
