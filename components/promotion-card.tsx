import Image from 'next/image';

interface PromotionCardProps {
  title: string;
  mainText: string;
  ctaText: string;
  imageSrc: string;
  onClick?: () => void;
}

export function PromotionCard({
  title,
  mainText,
  ctaText,
  imageSrc,
  onClick,
}: PromotionCardProps) {
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

            <h3 className="font-playfair mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-[#F5E6D3] drop-shadow-lg animate-[fadeIn_1s_ease-out,slideUp_1s_ease-out]">
              {title}
            </h3>

            <p className="font-cormorant mb-6 sm:mb-12 max-w-2xl mx-auto text-xl sm:text-2xl lg:text-3xl text-[#F5E6D3] drop-shadow-lg font-semibold leading-tight animate-[fadeIn_2s_ease-out,slideUp_2s_ease-out]">
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
              <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
