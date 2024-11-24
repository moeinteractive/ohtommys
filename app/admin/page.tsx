'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Beer, FileText, Menu, MessageSquareQuote, Music } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="bg-[#001F0F]">
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-playfair font-bold text-[#E4A853] mb-4 tracking-tight drop-shadow-lg">
              ADMIN
            </h1>
            <p className="text-xl text-white/90 font-cormorant uppercase tracking-[0.2em] mb-6">
              Irish Pub & Grill
            </p>
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-24 h-px bg-[#E4A853]/30"></div>
              <Beer className="h-8 w-8 text-[#E4A853]" aria-hidden="true" />
              <div className="w-24 h-px bg-[#E4A853]/30"></div>
            </div>
          </div>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={cardContainerVariants}
          >
            <motion.div variants={itemVariants}>
              <Link href="/admin/full-menu" className="group">
                <Card className="relative overflow-hidden bg-[#002F17] border-2 border-[#E4A853]/20 hover:border-[#E4A853]/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E4A853]/5 to-transparent group-hover:from-[#E4A853]/10 transition-all duration-300"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#E4A853] rounded-xl shadow-[0_0_15px_rgba(228,168,83,0.3)] group-hover:shadow-[0_0_20px_rgba(228,168,83,0.4)] transition-all duration-300">
                        <Menu
                          className="h-6 w-6 text-[#1B3B24]"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-playfair font-bold text-[#E4A853] mb-2 group-hover:translate-x-1 transition-all duration-300">
                          Full Menu
                        </h2>
                        <p className="text-white/70 font-cormorant text-lg">
                          Manage pub grub and drink selections
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/admin/specials" className="group">
                <Card className="relative overflow-hidden bg-[#002F17] border-2 border-[#E4A853]/20 hover:border-[#E4A853]/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E4A853]/5 to-transparent group-hover:from-[#E4A853]/10 transition-all duration-300"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#E4A853] rounded-xl shadow-[0_0_15px_rgba(228,168,83,0.3)] group-hover:shadow-[0_0_20px_rgba(228,168,83,0.4)] transition-all duration-300">
                        <MessageSquareQuote
                          className="h-6 w-6 text-[#1B3B24]"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-playfair font-bold text-[#E4A853] mb-2 group-hover:translate-x-1 transition-all duration-300">
                          Daily Specials
                        </h2>
                        <p className="text-white/70 font-cormorant text-lg">
                          Update today&apos;s deals and promotions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/admin/events" className="group">
                <Card className="relative overflow-hidden bg-[#002F17] border-2 border-[#E4A853]/20 hover:border-[#E4A853]/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E4A853]/5 to-transparent group-hover:from-[#E4A853]/10 transition-all duration-300"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#E4A853] rounded-xl shadow-[0_0_15px_rgba(228,168,83,0.3)] group-hover:shadow-[0_0_20px_rgba(228,168,83,0.4)] transition-all duration-300">
                        <Music
                          className="h-6 w-6 text-[#1B3B24]"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-playfair font-bold text-[#E4A853] mb-2 group-hover:translate-x-1 transition-all duration-300">
                          Live Events
                        </h2>
                        <p className="text-white/70 font-cormorant text-lg">
                          Manage gigs, quiz nights & more
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/admin/menu-content" className="group">
                <Card className="relative overflow-hidden bg-[#002F17] border-2 border-[#E4A853]/20 hover:border-[#E4A853]/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E4A853]/5 to-transparent group-hover:from-[#E4A853]/10 transition-all duration-300"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#E4A853] rounded-xl shadow-[0_0_15px_rgba(228,168,83,0.3)] group-hover:shadow-[0_0_20px_rgba(228,168,83,0.4)] transition-all duration-300">
                        <FileText
                          className="h-6 w-6 text-[#1B3B24]"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-playfair font-bold text-[#E4A853] mb-2 group-hover:translate-x-1 transition-all duration-300">
                          Menu Content
                        </h2>
                        <p className="text-white/70 font-cormorant text-lg">
                          Edit dish details & allergen info
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </motion.div>

          <div className="mt-16 text-center">
            <p className="text-[#E4A853] font-playfair text-lg tracking-wide mb-2">
              COLD PINTS — HEARTY GRUB — GOOD TIMES
            </p>
            <p className="text-white/50 font-cormorant text-sm">
              © {new Date().getFullYear()} OH TOMMY&apos;S IRISH PUB AND GRILL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
