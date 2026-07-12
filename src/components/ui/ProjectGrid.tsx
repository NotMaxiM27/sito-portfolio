import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ProjectData = {
  id: number;
  title: string;
  tags: string[];
  image?: string;
};

export interface ProjectGridProps {
  progetti: ProjectData[];
}

const tagColors: Record<string, string> = {
  'WebGL': '#ff0055',
  'C++': '#0088ff',
  'GLSL': '#00ffaa',
  'Three.js': '#ffaa00',
  'Rust': '#ff5500',
  'Math': '#aa00ff',
};

const getTagColor = (tag: string) => tagColors[tag] || '#00ffff';

export default function ProjectGrid({ progetti }: ProjectGridProps) {
  const tuttiITags = Array.from(new Set(progetti.flatMap(p => p.tags)));

  const [tagAttivi, setTagAttivi] = useState<string[]>([]);
  // Stato per tracciare l'hover
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    if (tagAttivi.includes(tag)) {
      setTagAttivi(tagAttivi.filter(t => t !== tag));
    } else {
      setTagAttivi([...tagAttivi, tag]);
    }
  };

  const progettiFiltrati = tagAttivi.length === 0
  ? progetti 
  : progetti.filter(p => tagAttivi.every(t => p.tags.includes(t)));

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      
      {/* Bottoni del Filtro */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {tuttiITags.map((tag) => {
          const isActive = tagAttivi.includes(tag);
          const isHovered = hoveredTag === tag;
          const color = getTagColor(tag);
          
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              onMouseEnter={() => setHoveredTag(tag)}
              onMouseLeave={() => setHoveredTag(null)}
              // Tolta la classe arcade-cascade, teniamo solo la base
              className="px-4 py-2 pixel-text text-sm transition-all border-2"
              style={{ 
                borderRadius: '0',
                // Gestione logica dei colori in base allo stato (Attivo > Hover > Default)
                borderColor: isActive ? color : (isHovered ? color : 'rgba(255,255,255,0.2)'),
                backgroundColor: isActive ? `${color}33` : (isHovered ? `${color}1A` : 'transparent'),
                color: isActive ? '#fff' : (isHovered ? color : '#9ca3af'),
                boxShadow: isActive ? `0 0 10px ${color}` : (isHovered ? `0 0 5px ${color}` : 'none'),
                // Cursore personalizzato per rendere tutto più "cliccabile"
                cursor: 'pointer'
              }}
            >
              {tag}
            </button>
          );
        })}
        
        {tagAttivi.length > 0 && (
          <button
            onClick={() => setTagAttivi([])}
            className="px-4 py-2 pixel-text text-sm transition-colors border-2 border-red-500/50 text-red-500 hover:bg-red-500/20"
          >
            RESET [X]
          </button>
        )}
      </div>

      {/* Griglia dei Progetti (rimasta invariata) */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {progettiFiltrati.map((progetto) => (
            <motion.a
              href={`/projects/${progetto.id}`} 
              key={progetto.id}
              layout 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group block relative overflow-hidden border-2 border-white/10 bg-[#0a0a0a] hover:border-cyan-400 transition-colors"
            >
              <div className="h-48 bg-[#111] relative" style={{ viewTransitionName: `img-${progetto.id}` }}>
                 {progetto.image ? (
                   <img src={progetto.image} alt={progetto.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-xs">
                      [NO_SIGNAL_IMG]
                   </div>
                 )}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
              </div>

              <div className="p-4 relative z-10">
                <h3 
                  className="text-xl font-bold mb-3 pixel-text text-white group-hover:text-cyan-400"
                  style={{ viewTransitionName: `title-${progetto.id}` }}
                >
                  {progetto.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {progetto.tags.map(tag => {
                    const color = getTagColor(tag);
                    return (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-1 uppercase tracking-widest border border-white/10 font-bold"
                        style={{ color: color, backgroundColor: `${color}1A` }}
                      >
                        {tag}
                      </span>
                    )
                  })}
                </div>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}