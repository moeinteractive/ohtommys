'use client';

import {
  DayOfWeek,
  MenuCategory,
  MenuSpecial as MenuSpecialType,
} from '@/app/types/menu.types';
import { Footer } from '@/components/footer2';
import { Header } from '@/components/header';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Alegreya, Crimson_Pro } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Initialize fonts

const headingFont = Alegreya({
  subsets: ['latin'],
  weight: ['500', '700'],
});

const bodyFont = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '600'],
});

// Define the type for raw data from Supabase
interface RawSpecialData {
  id: string;
  menu_item_id: string;
  day: DayOfWeek;
  special_price: string | number;
  special_description: string | null;
  created_at: string | null;
  updated_at: string | null;
  menu_items: {
    id: string;
    name: string;
    description: string | null;
    price: string | number | null;
    category: MenuCategory;
    is_special: boolean;
  };
}

// Update the DayButton component
const DayButton = ({
  day,
  isSelected,
  onClick,
}: {
  day: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      relative w-full py-2 px-4
      font-serif text-base tracking-[0.1em]
      transition-all duration-300
      ${
        isSelected
          ? `
          bg-[#2A4E45] text-[#F5E6D3]
          `
          : `
          bg-transparent text-[#2A4E45]
          hover:bg-[#2A4E45]/5
          border border-[#2A4E45]
          `
      }
    `}
  >
    <span className="relative z-10 uppercase">{day}</span>
  </button>
);

// Add these styles near the top of the file, after the font declarations
const overlayStyles = `
  .pub-background {
    background: 
      linear-gradient(rgba(0, 31, 15, 0.92), rgba(0, 31, 15, 0.94)),
      url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
      url('/images/wood-texture.jpg');
    background-repeat: repeat, repeat, repeat;
    position: fixed;
    inset: 0;
    z-index: -1;
  }

  .ambient-light {
    position: fixed;
    inset: 0;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(228, 168, 83, 0.15) 0%,
      rgba(0, 31, 15, 0.2) 50%,
      transparent 100%
    );
    pointer-events: none;
    z-index: -1;
  }

  .woven-overlay {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.414L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415L60 42.143v-2.83zm0 5.657L51.515 47.8l1.414 1.414L60 47.8v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 53.456v-2.83z' fill='%23E4A853' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    position: absolute;
    inset: 0;
    opacity: 0;
    animation: fadeInOut 10s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; }
    50% { opacity: 0.15; }
    100% { opacity: 0; }
  }
`;

export default function SpecialsPage() {
  const [menuSpecials, setMenuSpecials] = useState<MenuSpecialType[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: specialsData, error: specialsError } = await supabase
        .from('menu_specials')
        .select(
          `
          id,
          menu_item_id,
          day,
          special_price,
          special_description,
          created_at,
          updated_at,
          menu_items:menu_items!inner (
            id,
            name,
            description,
            price,
            category,
            is_special,
            created_at,
            updated_at,
            day
          )
        `
        )
        .order('day');

      if (specialsError) throw specialsError;

      if (specialsData) {
        const transformedSpecials = (
          specialsData as unknown as RawSpecialData[]
        ).map((special) => {
          if (!special.menu_items) {
            throw new Error(
              `Special ${special.id} has no associated menu item`
            );
          }

          return {
            id: special.id,
            menu_item_id: special.menu_item_id,
            day: special.day,
            special_price: Number(special.special_price),
            special_description: special.special_description,
            name: special.menu_items.name,
            description: special.menu_items.description,
            price: special.menu_items.price
              ? Number(special.menu_items.price)
              : null,
            image_url: '/images/default-special.jpg',
            created_at: special.created_at,
            updated_at: special.updated_at,
            menu_items: {
              id: special.menu_items.id,
              name: special.menu_items.name,
              price: special.menu_items.price
                ? Number(special.menu_items.price)
                : null,
              description: special.menu_items.description,
              category: special.menu_items.category,
              is_special: special.menu_items.is_special,
              image_url: '/images/default-special.jpg',
            },
          };
        });

        setMenuSpecials(transformedSpecials);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error loading specials:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add loading state handling
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#001F0F] flex items-center justify-center">
        <div className="text-[#E4A853] text-xl">Loading specials...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#001F0F] flex items-center justify-center">
        <div className="text-red-500 text-xl text-center">
          <p>Error loading specials</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Group specials by day
  const specialsByDay = menuSpecials.reduce(
    (acc, special) => {
      if (!acc[special.day]) {
        acc[special.day] = [];
      }
      acc[special.day].push(special);
      return acc;
    },
    {} as Record<string, MenuSpecialType[]>
  );

  // Update the DaySection component
  const DaySection = ({
    day,
    specials,
  }: {
    day: string;
    specials: MenuSpecialType[];
  }) => {
    return (
      <div className="relative min-h-[calc(100vh-240px)] flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Left Side - Days Navigation - Adjusted for fold-like resolutions */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-4">
            <div className="bg-[#F5E6D3] border-2 border-[#2A4E45] p-3 min-[500px]:p-6">
              <h3
                className={`${headingFont.className} text-[#2A4E45] text-xl min-[500px]:text-2xl mb-4 min-[500px]:mb-8 text-center uppercase tracking-wider`}
              >
                Daily Specials
              </h3>
              <div className="grid grid-cols-2 min-[500px]:grid-cols-1 gap-2">
                {Object.keys(specialsByDay).map((dayKey) => (
                  <DayButton
                    key={dayKey}
                    day={dayKey}
                    isSelected={selectedDay === dayKey}
                    onClick={() => setSelectedDay(dayKey)}
                  />
                ))}
              </div>

              {/* View Full Menu button */}
              <Link
                href="/full-menu"
                className={`
                  ${headingFont.className}
                  mt-4 min-[500px]:mt-8 w-full block
                  text-center py-2 min-[500px]:py-3 px-4
                  bg-[#2A4E45] text-[#F5E6D3]
                  hover:bg-[#2A4E45]/90
                  transition-all duration-300
                  border border-[#2A4E45]
                  text-sm min-[500px]:text-base tracking-[0.1em]
                  uppercase
                `}
              >
                View Full Menu
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content - Adjusted spacing */}
        <div className="flex-1">
          <div className="bg-[#F5E6D3] border-2 border-[#2A4E45] p-4 min-[500px]:p-8">
            {/* Title with adjusted spacing */}
            <div className="text-center mb-6 min-[500px]:mb-12">
              <h2
                className={`${headingFont.className} text-3xl min-[500px]:text-5xl text-[#2A4E45] uppercase tracking-[0.2em] mb-4`}
              >
                {day === selectedDay ? "Today's Specials" : `${day}'s Specials`}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 min-[500px]:w-16 h-px bg-[#2A4E45]" />
                <div className="w-3 min-[500px]:w-4 h-3 min-[500px]:h-4 rotate-45 border-2 border-[#2A4E45]" />
                <div className="w-12 min-[500px]:w-16 h-px bg-[#2A4E45]" />
              </div>
            </div>

            {/* Specials Grid - Adjusted for better mobile display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-[500px]:gap-8 max-w-5xl mx-auto">
              {specials.map((special, index) => (
                <motion.div
                  key={special.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-white border-2 border-[#2A4E45] p-6"
                >
                  <div className="relative h-48 mb-6 border border-[#2A4E45]/20">
                    <Image
                      src={special.image_url || '/images/default-special.jpg'}
                      alt={special.name || 'Special dish'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="text-center">
                    <h3
                      className={`${headingFont.className} text-2xl text-[#2A4E45] uppercase tracking-wide mb-2`}
                    >
                      {special.name}
                    </h3>
                    <p
                      className={`${bodyFont.className} text-lg text-[#2A4E45]/80 mb-4`}
                    >
                      {special.special_description || special.description}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-2xl font-bold text-[#2A4E45]">
                        ${special.special_price.toFixed(2)}
                      </span>
                      {special.price && (
                        <span className="text-sm text-[#2A4E45]/60 line-through">
                          ${special.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Decorative Corner Elements */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#2A4E45]" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#2A4E45]" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#2A4E45]" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#2A4E45]" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative">
      <style jsx global>
        {overlayStyles}
      </style>
      <div className="pub-background" />
      <div className="ambient-light" />
      <div className="woven-overlay" />

      <Header />
      <div className="container mx-auto px-4 pt-[120px] min-[500px]:pt-[160px] lg:pt-[200px] pb-12">
        {specialsByDay[selectedDay] && (
          <DaySection day={selectedDay} specials={specialsByDay[selectedDay]} />
        )}
      </div>
      <Footer />
    </div>
  );
}
