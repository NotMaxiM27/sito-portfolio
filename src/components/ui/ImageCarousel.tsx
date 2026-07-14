import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type GalleryItemType = string | { src: string; description?: string };

const resolvePath = (path: string) => {
  if (!path) return path;
  if (path.startsWith('/')) {
    const base = import.meta.env.BASE_URL;
    return base === '/' ? path : base.replace(/\/$/, '') + path;
  }
  return path;
};

export default function ImageCarousel({ items }: { items: GalleryItemType[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  const currentItem = items[currentIndex];
  const src = typeof currentItem === 'string' ? currentItem : currentItem.src;
  const description = typeof currentItem === 'string' ? null : currentItem.description;

  return (
    <div className="w-full mb-10 border-2 border-white/10 relative bg-[#111]">
      <div className="bg-[#222] text-xs font-mono text-cyan-400 px-2 py-1 border-b border-white/10 flex justify-between items-center">
        <span>&gt; SYSTEM.IMAGE_GALLERY [{currentIndex + 1}/{items.length}]</span>
        <div className="flex gap-2">
          <button onClick={prev} className="hover:text-white transition-colors">&lt; PREV</button>
          <button onClick={next} className="hover:text-white transition-colors">NEXT &gt;</button>
        </div>
      </div>
      
      <div className="relative w-full aspect-video bg-black overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={resolvePath(src)}
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </AnimatePresence>

        {/* Pulsanti sovrapposti per comodità */}
        <button 
          onClick={prev} 
          className="absolute left-0 top-1/2 -translate-y-1/2 p-4 opacity-50 hover:opacity-100 hover:bg-black/50 transition-all h-full flex items-center justify-center"
        >
          <img src={resolvePath("/images/previous_white.png")} alt="Previous" className="object-contain drop-shadow-md" style={{ width: '32px', height: '32px' }} />
        </button>
        <button 
          onClick={next} 
          className="absolute right-0 top-1/2 -translate-y-1/2 p-4 opacity-50 hover:opacity-100 hover:bg-black/50 transition-all h-full flex items-center justify-center"
        >
          <img src={resolvePath("/images/next_white.png")} alt="Next" className="object-contain drop-shadow-md" style={{ width: '32px', height: '32px' }} />
        </button>
      </div>

      {description && (
        <div className="bg-[#0a0a0a] border-t border-white/10 p-3 text-sm font-mono text-gray-300">
          <span className="text-cyan-400">&gt; DESC:</span> {description}
        </div>
      )}
    </div>
  );
}
