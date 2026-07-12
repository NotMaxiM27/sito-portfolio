import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// 1. CORREZIONE DEL ROUTING
const menuItems = [
  { name: 'Home', href: '/' }, // <-- Adesso porta SEMPRE alla radice del sito
  { name: 'Projects', href: '/projects' },
  // Se le prossime sezioni saranno sulla home, usa "/#ancora"
  { name: 'Experience', href: '/#experience' },
  { name: 'Skills', href: '/#skills' },
  { name: 'About', href: '/#about' },
  { name: 'Blog', href: '/#blog' },
];

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('/');

  useEffect(() => {
    const updatePath = () => setCurrentPath(window.location.pathname);
    updatePath();
    document.addEventListener('astro:page-load', updatePath);
    return () => document.removeEventListener('astro:page-load', updatePath);
  }, []);

  return (
    // 2. STILE FULL-WIDTH
    // top-0 left-0 w-full la rende una striscia completa. bg-[#050505] copre cosa c'è dietro.
    // Modifica solo questa riga nel return di Navbar.tsx
    <nav 
      className="fixed top-0 left-0 w-full z-[60] bg-[#050505] border-b-4 border-[#222] shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
      onMouseLeave={() => setHovered(null)}
    >
      {/* Contenitore interno per centrare le voci */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-center items-center">
        <ul className="flex items-center gap-6">
          {menuItems.map((item) => {
            const isActive = item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href.split('#')[0]) && item.href !== '/';
            return (
            <li key={item.name} className="relative p-1">
              <a
                href={item.href}
                onMouseEnter={() => setHovered(item.name)}
                className={`relative z-10 px-3 py-2 block pixel-text text-sm transition-none ${
                  hovered === item.name 
                    ? 'arcade-cascade' 
                    : isActive ? 'text-cyan-400 font-bold' : 'text-gray-400'
                }`}
              >
                {isActive && <span className="absolute -left-2 top-1/2 -translate-y-1/2 animate-pulse">&gt;</span>}
                {item.name}
              </a>

              {hovered === item.name && (
                <motion.div
                  layoutId="nav-highlight"
                  className="absolute inset-0 pixel-item-active -z-0"
                  transition={{ type: 'tween', duration: 0.1 }}
                />
              )}
            </li>
          )})}
        </ul>
      </div>
    </nav>
  );
}