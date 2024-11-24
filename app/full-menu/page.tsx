'use client';

import { categorySvgIcons } from '@/app/components/menu/CategoryIcons';
import { categoryPhrases } from '@/app/components/menu/CategoryPhrases';
import {
  CategoryInfo,
  MenuCategory,
  MenuContent,
  MenuItem,
  Side,
  SideCategory,
} from '@/app/types/menu.types';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Footer } from '@/components/footer2';
import { Header } from '@/components/header';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Alegreya, Crimson_Pro, IM_Fell_English } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const titleFont = IM_Fell_English({
  subsets: ['latin'],
  weight: ['400'],
});

const headingFont = Alegreya({
  subsets: ['latin'],
  weight: ['500', '700'],
});

const bodyFont = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '600'],
});

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
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.414L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415L60 42.143v-2.83zm0 5.657L51.515 47.8l1.414 1.414L60 47.8v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.242 4.242zm-2.83 2.827l1.414-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%23E4A853' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
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

export default function FullMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuContent, setMenuContent] = useState<MenuContent>({
    id: '',
    content_key: '',
    content_value: null,
    dressings_list: '',
    food_safety_disclaimer: '',
    payment_notice: '',
  });
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] =
    useState<string>('Appetizers');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error('Rendering error:', error);
      setError(error.message);
    };

    window.addEventListener('error', (e) => handleError(e.error));
    return () =>
      window.removeEventListener('error', (e) => handleError(e.error));
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting to load menu data...');

      // Load menu items with their relationships
      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select(
          `
          id,
          name,
          description,
          category,
          price,
          image_url,
          menu_item_sides!menu_item_sides_menu_item_id_fkey (
            id,
            is_default,
            side:sides!menu_item_sides_side_id_fkey (
              id,
              name,
              description,
              price,
              category,
              is_active
            )
          ),
          menu_sizes (
            id,
            size_name,
            price
          ),
          menu_extras (
            id,
            extra_name,
            price
          )
        `
        )
        .order('category')
        .order('name');

      if (menuError) {
        throw new Error(`Error loading menu items: ${menuError.message}`);
      }

      // Load menu content
      const { data: contentData, error: contentError } = await supabase
        .from('menu_content')
        .select('*')
        .single();

      if (contentError && contentError.code !== 'PGRST116') {
        throw new Error(`Error loading menu content: ${contentError.message}`);
      }

      // Load category info
      const { data: categoryInfoData, error: categoryInfoError } =
        await supabase.from('category_info').select('*');

      if (categoryInfoError) {
        throw new Error(
          `Error loading category info: ${categoryInfoError.message}`
        );
      }

      // Set states if we have data
      if (menuData) {
        console.log('Setting menu items:', menuData);
        const transformedMenuData = menuData.map((item: any): MenuItem => {
          // Transform menu item sides
          const transformedSides =
            item.menu_item_sides?.map((menuItemSide: any) => ({
              id: menuItemSide.id,
              menu_item_id: item.id,
              side_id: menuItemSide.side.id,
              is_default: menuItemSide.is_default,
              side: {
                id: menuItemSide.side.id,
                name: menuItemSide.side.name,
                description: menuItemSide.side.description || '',
                price: menuItemSide.side.price,
                category: menuItemSide.side.category as SideCategory,
                is_active: menuItemSide.side.is_active ?? true,
              },
            })) || [];

          // Transform menu sizes
          const transformedSizes =
            item.menu_sizes?.map((size: any) => ({
              id: size.id,
              menu_item_id: item.id,
              size_name: size.size_name,
              price: size.price.toString(),
              created_at: new Date().toISOString(),
            })) || [];

          // Transform menu extras
          const transformedExtras =
            item.menu_extras?.map((extra: any) => ({
              id: extra.id,
              menu_item_id: item.id,
              extra_name: extra.extra_name,
              price: extra.price.toString(),
              created_at: new Date().toISOString(),
            })) || [];

          // Return transformed menu item
          return {
            id: item.id,
            name: item.name,
            description: item.description || '',
            category: item.category as MenuCategory,
            price: item.price?.toString() || null,
            image_url: item.image_url || null,
            is_special: item.is_special || false,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString(),
            menu_item_sides: transformedSides,
            menu_sizes: transformedSizes,
            menu_extras: transformedExtras,
          };
        });

        setMenuItems(transformedMenuData);
      }

      if (contentData) {
        console.log('Setting menu content:', contentData);
        setMenuContent(contentData);
      }

      if (categoryInfoData) {
        console.log('Setting category info:', categoryInfoData);
        setCategoryInfo(categoryInfoData);
      }
    } catch (error) {
      console.error('Database error:', error);
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Group menu items by category
  const menuByCategory = menuItems.reduce<Record<string, MenuItem[]>>(
    (acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {}
  );

  const formatPrice = (price: string | number | null): string => {
    if (price === null) return '0.00';
    const numPrice = typeof price === 'string' ? Number(price) : price;
    return numPrice.toFixed(2);
  };

  const renderMenuItem = (item: MenuItem) => {
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-6 p-6 bg-black/40 backdrop-blur-sm rounded-lg hover:bg-black/50 transition-all border border-[#E4A853]/10"
      >
        {/* Item Image */}
        {item.image_url && (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Item Details */}
        <div className="flex-grow">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3
                className={`${headingFont.className} text-2xl text-white mb-2`}
              >
                {item.name}
              </h3>
              {item.description && (
                <p className="text-gray-300 text-sm mb-3">{item.description}</p>
              )}
            </div>
            {item.price !== null &&
              item.price !== undefined &&
              (!item.menu_sizes || item.menu_sizes.length === 0) && (
                <div className="flex-shrink-0">
                  <span
                    className={`${headingFont.className} text-2xl text-[#E4A853]`}
                  >
                    ${formatPrice(item.price)}
                  </span>
                </div>
              )}
          </div>

          {/* Size Options */}
          {item.menu_sizes && item.menu_sizes.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {item.menu_sizes.map((size) => (
                  <div
                    key={`${item.id}-${size.size_name}`}
                    className="flex items-center gap-2"
                  >
                    <span className="text-gray-300 text-sm">
                      {size.size_name}
                    </span>
                    <span className="text-[#E4A853] text-sm font-medium">
                      ${formatPrice(size.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          {item.menu_extras && item.menu_extras.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {item.menu_extras.map((extra) => (
                  <div
                    key={`${item.id}-${extra.extra_name}`}
                    className="flex items-center gap-2"
                  >
                    <span className="text-gray-300 text-sm">
                      + {extra.extra_name}
                    </span>
                    <span className="text-[#E4A853] text-sm font-medium ml-1">
                      ${formatPrice(extra.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sides */}
          {item.menu_item_sides && item.menu_item_sides.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {item.menu_item_sides.map((menuItemSide) => (
                  <div
                    key={`${item.id}-${menuItemSide.side_id}`}
                    className="flex items-center gap-2"
                  >
                    <span className="text-gray-300 text-sm">
                      {menuItemSide.side.name}
                    </span>
                    {menuItemSide.side.price !== null &&
                      menuItemSide.side.price > 0 && (
                        <span className="text-[#E4A853] text-sm font-medium">
                          +${formatPrice(menuItemSide.side.price)}
                        </span>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const FloatingIcons = ({ category }: { category: string }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const icons =
      categorySvgIcons.find((c) => c.category === category)?.icons || [];
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setDimensions({
            width: rect.width,
            height: rect.height,
          });
        }
      };

      // Set initial dimensions
      updateDimensions();

      // Add event listener for window resize with debounce
      let timeoutId: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateDimensions, 100);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timeoutId);
      };
    }, []);

    if (!icons.length) return null;

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {icons.map((icon, index) => {
          // Calculate initial positions with padding to avoid edges
          const padding = 50;
          const initialX =
            padding + Math.random() * (dimensions.width - 2 * padding);
          const initialY =
            padding + Math.random() * (dimensions.height - 2 * padding);

          // Create unique animation paths for each icon
          const path = Array.from({ length: 4 }, () => ({
            x: padding + Math.random() * (dimensions.width - 2 * padding),
            y: padding + Math.random() * (dimensions.height - 2 * padding),
          }));

          return (
            <motion.svg
              key={`${category}-icon-${index}`}
              viewBox={icon.viewBox}
              className="absolute w-8 h-8 fill-current text-[#E4A853] opacity-0"
              initial={{
                x: initialX,
                y: initialY,
                rotate: 0,
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                x: [initialX, ...path.map((p) => p.x), initialX],
                y: [initialY, ...path.map((p) => p.y), initialY],
                rotate: [0, 120, 240, 360],
                scale: [0.8, 1, 1.2, 1, 0.8],
                opacity: [0, 0.15, 0.2, 0.15, 0],
              }}
              transition={{
                duration: 25 + Math.random() * 10,
                repeat: Infinity,
                ease: 'linear',
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
            >
              <path d={icon.path} />
            </motion.svg>
          );
        })}
      </div>
    );
  };

  const PolaroidStack = ({ category }: { category: MenuCategory }) => {
    const [mounted, setMounted] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      // Load images after component mounts to avoid hydration mismatch
      const categoryImages = [
        '/images/menu-categories/appetizers/1.jpg',
        '/images/menu-categories/appetizers/2.jpg',
        '/images/menu-categories/appetizers/3.jpg',
      ];
      setImages(categoryImages);
      setMounted(true);
    }, []);

    const currentPhrases = categoryPhrases[category] || [
      'Tasty dish',
      'Fresh flavor',
      'House special',
    ];

    useEffect(() => {
      if (mounted && images.length > 0 && !isHovered) {
        const interval = setInterval(() => {
          setActiveIndex((current) => (current + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
      }
    }, [mounted, images.length, isHovered]);

    if (!mounted) {
      return null;
    }

    return (
      <div
        className="relative h-[600px] w-[550px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute top-0 left-0 bg-white p-5 shadow-2xl rounded-sm transform-gpu cursor-pointer"
            initial={{ opacity: 0, x: 100, y: 0, scale: 0.92 }}
            animate={{
              opacity: index === activeIndex ? 1 : 0.5,
              scale: index === activeIndex ? 1 : 0.92,
              x: index === activeIndex ? 0 : index < activeIndex ? -25 : 25,
              y: index * 20,
              zIndex:
                index === activeIndex ? 5 : 4 - Math.abs(index - activeIndex),
              rotate: index === activeIndex ? 0 : index < activeIndex ? -5 : 5,
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
            whileHover={{
              scale: 1.05,
              rotate: 0,
              zIndex: 10,
              y: -15,
            }}
            onClick={() => setActiveIndex(index)}
          >
            <div className="relative w-[450px] h-[450px]">
              <Image
                src={image}
                alt={`${category} dish ${index + 1}`}
                fill
                className="object-cover rounded-sm"
                sizes="(max-width: 450px) 100vw, 450px"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/5 rounded-sm" />
            </div>
            <div className="mt-4 text-center">
              <p
                className={`${headingFont.className} text-2xl text-black mb-1`}
              >
                {category}
              </p>
              <p className="text-gray-600 text-sm italic">
                {currentPhrases[index % currentPhrases.length]}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const HeroSection = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      // Add scroll event listener to handle visibility
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        setIsVisible(scrollPosition < 300); // Hide when scrolled past 300px
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <section className="relative min-h-[70vh] pt-[100px]">
        <style jsx global>
          {overlayStyles}
        </style>

        {/* Adjust the gradient overlay */}
        <div className="absolute inset-0 top-0 bg-gradient-to-b from-[#001F0F] via-[#001F0F]/95 to-transparent"></div>

        {/* Floating Icons with animation control */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {expandedCategory && (
            <FloatingIcons category={expandedCategory as MenuCategory} />
          )}
        </motion.div>

        {/* Woven texture overlay */}
        <div className="woven-overlay" />

        <div className="relative min-h-[calc(70vh-120px)] flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">
              <motion.div
                key={expandedCategory}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col items-center md:items-start text-center md:text-left md:pr-8"
              >
                <h1
                  className={`${titleFont.className} text-5xl sm:text-6xl md:text-7xl text-white mb-4 md:mb-8`}
                >
                  {expandedCategory}
                  <span className="block text-[#E4A853] mt-2 md:mt-4">
                    Selection
                  </span>
                </h1>

                <p
                  className={`${bodyFont.className} text-lg sm:text-xl text-gray-200 italic mb-6 md:mb-8 max-w-xl`}
                >
                  {expandedCategory &&
                    `Explore our selection of ${expandedCategory.toLowerCase()} crafted with authentic Irish traditions and contemporary culinary expertise.`}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="hidden md:block md:justify-self-end relative -top-12"
              >
                {expandedCategory && (
                  <PolaroidStack category={expandedCategory as MenuCategory} />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const MenuItems = () => {
    const items = menuByCategory[expandedCategory] || [];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {items.map(renderMenuItem)}
      </div>
    );
  };

  const CategorySides = () => {
    const categoryDetails = categoryInfo.find(
      (ci) => ci.category === expandedCategory
    );

    if (!categoryDetails?.category_sides?.length) return null;

    // Extract sides from the category_sides join table
    const sides = categoryDetails.category_sides
      .map((cs: { side: Side }) => cs.side)
      .filter((side: Side | undefined): side is Side => Boolean(side));

    if (!sides.length) return null;

    return (
      <div className="space-y-4">
        {categoryDetails.sides_note && (
          <p className="text-gray-300 text-sm italic">
            {categoryDetails.sides_note}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sides.map((side: Side) => (
            <div
              key={side.id}
              className="flex items-center justify-between p-3 bg-black/30 rounded-lg hover:bg-black/40 transition-all"
            >
              <div className="flex flex-col">
                <span className="text-white font-medium">{side.name}</span>
                {side.description && (
                  <span className="text-gray-300 text-sm mt-1">
                    {side.description}
                  </span>
                )}
              </div>
              {side.price !== null && side.price > 0 && (
                <span className="text-[#E4A853] font-medium ml-3">
                  +${formatPrice(side.price)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="max-w-7xl mx-auto">
        {Object.entries(menuByCategory).map(([category]) => (
          <div
            key={category}
            className={expandedCategory === category ? 'block' : 'hidden'}
          >
            <CategorySides />
            <MenuItems />
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#001F0F] flex items-center justify-center">
        <div className="text-[#E4A853] text-xl">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#001F0F] flex items-center justify-center">
        <div className="text-red-500 text-xl text-center">
          <p>Error loading menu</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen">
        {/* Add pub background and ambient lighting */}
        <div className="pub-background" />
        <div className="ambient-light" />

        <Header />
        <HeroSection />

        {/* Update the Menu Section background */}
        <section id="menu-section" className="relative -mt-40 pb-24">
          {/* Add a subtle vignette effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, transparent 20%, rgba(0, 0, 0, 0.2) 100%)',
              zIndex: -1,
            }}
          />

          {/* Rest of the menu section content remains the same */}
          <div className="container mx-auto px-4">
            {/* Menu Navigation - Increased top margin */}
            <div className="flex justify-center mt-28 mb-16">
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4 max-w-5xl">
                  {/* First row - 4 main categories */}
                  {[
                    'Appetizers',
                    'Homemade Soups & Salads',
                    'Entrees',
                    'Sandwiches, Wraps & Burgers',
                  ].map((category) => (
                    <button
                      key={category}
                      onClick={() => setExpandedCategory(category)}
                      className={`${headingFont.className} text-base md:text-lg px-3 md:px-4 py-2 transition-all rounded-lg
                        ${
                          expandedCategory === category
                            ? 'bg-[#E4A853]/10 text-[#E4A853] border border-[#E4A853]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                        whitespace-nowrap
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Second row - Kids Corner and Desserts */}
                <div className="flex justify-center gap-3 md:gap-4">
                  {['Kids Corner', 'Desserts'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setExpandedCategory(category)}
                      className={`${headingFont.className} text-base md:text-lg px-3 md:px-4 py-2 transition-all rounded-lg
                        ${
                          expandedCategory === category
                            ? 'bg-[#E4A853]/10 text-[#E4A853] border border-[#E4A853]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                        whitespace-nowrap
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Add Daily Specials Link */}
                <Link
                  href="/specials"
                  className={`
                    ${headingFont.className}
                    mt-4 px-6 py-3
                    bg-[#E4A853] text-[#001F0F]
                    hover:bg-[#E4A853]/90
                    transition-all duration-300
                    rounded-lg
                    text-lg font-medium
                    flex items-center gap-2
                    border border-[#E4A853]
                  `}
                >
                  <span>View Daily Specials</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Menu Content */}
            <div className="max-w-7xl mx-auto">{renderContent()}</div>

            {/* Add this after the menu content */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="space-y-8">
                {menuContent.payment_notice && (
                  <div className="p-6 bg-black/20 rounded-lg border border-[#E4A853]/10">
                    <p className="text-[#E4A853] text-center text-sm">
                      {menuContent.payment_notice}
                    </p>
                  </div>
                )}

                {menuContent.food_safety_disclaimer && (
                  <div className="p-6 bg-black/20 rounded-lg border border-[#E4A853]/10">
                    <p className="text-gray-300 text-center text-sm">
                      {menuContent.food_safety_disclaimer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
