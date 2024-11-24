import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface CelticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function CelticButton({
  children,
  className = '',
  disabled = false,
  ...props
}: CelticButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      aria-disabled={disabled}
      role="button"
      className={cn(
        `
        relative overflow-hidden group
        px-8 py-4 rounded-none
        transition-all duration-300
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : `
              bg-[#3A725A] text-[#F5E6D3] 
              hover:bg-[#458B6D]
              border-2 border-[#F5E6D3]/30
              hover:border-[#F5E6D3]/50
              shadow-[0_2px_10px_rgba(0,0,0,0.1)]
              hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]
            `
        }
        `,
        className
      )}
    >
      {/* Border effect */}
      <div className="absolute inset-[3px] border border-[#F5E6D3]/20 pointer-events-none" />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="font-serif text-xl md:text-2xl uppercase tracking-[0.1em] text-[#F5E6D3]">
          {children}
        </span>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#F5E6D3]/30" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#F5E6D3]/30" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#F5E6D3]/30" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#F5E6D3]/30" />

      {/* Enhanced shine effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        }}
      />
    </button>
  );
}
