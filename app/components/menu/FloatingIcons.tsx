'use client';

import { CategoryIcons } from '@/app/components/menu/CategoryIcons';
import { MenuCategory } from '@/app/types/menu.types';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface FloatingIconsProps {
  category: MenuCategory;
}

export const FloatingIcons: React.FC<FloatingIconsProps> = ({ category }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const iconCount = 8;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width, height });
      }
    };

    // Initial update
    updateDimensions();

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdateDimensions = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };

    window.addEventListener('resize', debouncedUpdateDimensions);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedUpdateDimensions);
    };
  }, []);

  // Memoize the icons array so it doesn't regenerate on every render
  const icons = useRef(
    Array.from({ length: iconCount }, (_, index) => {
      const padding = 60;
      return {
        id: index,
        initialX: Math.random() * (window.innerWidth - padding * 2) + padding,
        initialY: Math.random() * (window.innerHeight - padding * 2) + padding,
        scale: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * 360,
      };
    })
  ).current;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ minHeight: '70vh' }}
      aria-hidden="true"
    >
      {containerDimensions.width > 0 &&
        containerDimensions.height > 0 &&
        icons.map((icon) => (
          <motion.div
            key={icon.id}
            initial={{
              opacity: 0,
              x: icon.initialX,
              y: icon.initialY,
              scale: icon.scale,
              rotate: icon.rotation,
            }}
            animate={{
              opacity: [0, 0.7, 0.4],
              x: [
                icon.initialX,
                icon.initialX + Math.random() * 40 - 20,
                icon.initialX,
              ],
              y: [
                icon.initialY,
                icon.initialY + Math.random() * 40 - 20,
                icon.initialY,
              ],
              scale: [icon.scale, icon.scale * 1.1, icon.scale],
              rotate: [icon.rotation, icon.rotation + 10, icon.rotation - 10],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              times: [0, 0.5, 1],
            }}
            className="absolute"
          >
            <CategoryIcons
              category={category}
              className="w-8 h-8 text-[#E4A853]/20"
            />
          </motion.div>
        ))}
    </div>
  );
};
