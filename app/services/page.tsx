"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useMotionTemplate, 
  useMotionValue,
  AnimatePresence 
} from "framer-motion";
import { 
  ArrowRight, 
  Code, 
  Database, 
  Globe, 
  Layers, 
  Smartphone, 
  Wand2, 
  Menu as MenuIcon, 
  X, 
  ArrowUpRight 
} from "lucide-react";
import { ReactLenis } from '@studio-freight/react-lenis';

// ==========================================
// 1. GLOBAL UTILITIES (Cursor, Magnetic, Menu)
// ==========================================

const Magnetic = ({ children }: { children: React.ReactElement }) => {
    const ref = useRef<HTMLDivElement>(null);
    const position = { x: useMotionValue(0), y: useMotionValue(0) };
    
    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width/2);
        const middleY = clientY - (top + height/2);
        position.x.set(middleX * 0.35);
        position.y.set(middleY * 0.35);
    }
    
    const reset = () => { position.x.set(0); position.y.set(0); }
    const { x, y } = position;
    
    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    )
}

const Cursor = () => {
    const mouse = { x: useMotionValue(0), y: useMotionValue(0) }
    const [isHovered, setIsHovered] = useState(false);
    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            mouse.x.set(e.clientX - (isHovered ? 40 : 10));
            mouse.y.set(e.clientY - (isHovered ? 40 : 10));
        }
        window.addEventListener("mousemove", handleMouse);
        return () => window.removeEventListener("mousemove", handleMouse);
    }, [isHovered]);
    return (
        <motion.div 
            className="fixed top-0 left-0 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999] hidden md:block"
            animate={{ width: isHovered ? 80 : 20, height: isHovered ? 80 : 20 }}
            style={{ x: mouse.x, y: mouse.y }}
            transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
        />
    )
}

const SlidingMenu = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
    const menuVariants = {
        closed: { x: "100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
        open: { x: "0%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
    };
    
    const linkVariants = {
        closed: { x: 80, opacity: 0 },
        open: (i: number) => ({ 
            x: 0, 
            opacity: 1, 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 + (i * 0.1) } 
        })
    };

    // UPDATED NAVIGATION ITEMS
    const navItems = ["Home", "Work", "Services", "About", "Blog", "Contact"];

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                    />
                    <motion.div 
                        variants={menuVariants} initial="closed" animate="open" exit="closed"
                        className="fixed top-0 right-0 h-screen w-full md:w-[450px] bg-[#111] z-[9999] p-12 md:p-24 flex flex-col justify-between border-l border-neutral-800"
                    >
                        <div className="flex justify-end">
                            <Magnetic><div onClick={() => setIsOpen(false)} className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-colors"><X size={20} /></div></Magnetic>
                        </div>
                        <div className="flex flex-col gap-6">
                            <span className="text-xs uppercase tracking-widest text-neutral-500 mb-8 border-b border-neutral-800 pb-4">Navigation</span>
                            {navItems.map((item, i) => (
                                <motion.div key={i} custom={i} variants={linkVariants} className="text-5xl md:text-6xl font-bold text-white hover:text-neutral-400 cursor-pointer transition-colors">
                                    <a href={`/${item.toLowerCase() === 'home' ? item.toLowerCase() : item.toLowerCase()}`}>{item}</a>
                                </motion.div>
                            ))}
                        </div>
                       
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}


// ==========================================
// 2. PAGE SPECIFIC COMPONENTS (Electric UI)
// ==========================================

const MagicCard = ({ title, description, icon: Icon }: any) => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl p-[1px] group">
      {/* Animated Rotating Border */}
      <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Static Border (Visible when not hovering) */}
      <span className="absolute inset-0 rounded-2xl border border-white/10" />

      {/* Card Content */}
      <div className="relative h-full w-full rounded-2xl bg-[#080808] p-8 flex flex-col justify-between backdrop-blur-3xl group-hover:bg-[#0a0a0a] transition-colors">
        
        {/* Glow behind Icon */}
        <div className="absolute top-8 left-8 w-20 h-20 bg-blue-600/20 blur-[40px] rounded-full pointer-events-none group-hover:bg-violet-600/30 transition-colors" />

        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:border-violet-500/50 transition-all duration-300">
             <Icon size={24} />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
          <p className="text-neutral-400 leading-relaxed text-sm group-hover:text-neutral-300 transition-colors">
            {description}
          </p>
        </div>

        {/* Bottom shine */}
        <div className="mt-8 flex items-center text-xs font-mono uppercase tracking-widest text-neutral-600 group-hover:text-violet-400 transition-colors">
            View Details <ArrowRight className="ml-2 w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

const SpotlightHero = () => {
    return (
        <div className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-[#050505] antialiased">
            {/* The Spotlight Cone */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[800px] bg-gradient-to-b from-blue-500/20 via-violet-500/10 to-transparent blur-[80px] rounded-[100%] opacity-50" />
            </div>
            
            <div className="relative z-10 text-center px-4 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-blue-300 text-xs font-mono mb-8 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Systems Operational
                    </div>

                    <h1 className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter mb-6 pb-2">
                        Digital Products. <br/>
                        Built for Growth.
                    </h1>
                    
                    <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
                        We specialize in high-scale E-commerce, custom SaaS platforms, and automated CRM systems. No fluff, just shipping code.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <button className="px-8 py-4 rounded-lg bg-white text-black font-bold hover:scale-105 transition-transform">
                            View Case Studies
                        </button>
                        <button className="px-8 py-4 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
                            Our Capabilities
                        </button>
                    </div>
                </motion.div>
            </div>
            
            {/* Grid Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none"></div>
        </div>
    )
}

// ==========================================
// 3. UNIFIED FOOTER
// ==========================================

const Footer = () => {
    return (
        <section className="bg-[#0a0a0a] text-white pt-20 pb-12 px-8 md:px-20 border-t border-neutral-900">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center mb-20">
                <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-8">Ready to scale?</h2>
                <h1 className="text-[10vw] font-black tracking-tighter leading-none mb-12">
                    LET'S BUILD <br/> YOUR VISION.
                </h1>
                <Magnetic>
                    <button className="px-12 py-6 bg-white text-black rounded-full font-bold text-xl hover:scale-110 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                        Book a Discovery Call
                    </button>
                </Magnetic>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end border-t border-neutral-900 pt-12">
                <div className="flex flex-col gap-2 mb-8 md:mb-0">
                    <span className="text-2xl font-bold tracking-tight">ARTIFY®</span>
                    <p className="text-neutral-500 text-sm max-w-xs">
                        Engineering digital ecosystems.<br/>Focused on Commerce, SaaS & Automation.
                    </p>
                </div>

                <div className="flex gap-12 text-sm font-medium">
                    <div className="flex flex-col gap-4">
                        <span className="text-neutral-500 uppercase tracking-widest text-xs">Menu</span>
                        <a href="#" className="hover:text-neutral-400">Home</a>
                        <a href="#" className="hover:text-neutral-400">Work</a>
                        <a href="#" className="hover:text-neutral-400">Services</a>
                        <a href="#" className="hover:text-neutral-400">Contact</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-neutral-500 uppercase tracking-widest text-xs">Socials</span>
                        <a href="#" className="hover:text-neutral-400">Instagram</a>
                        <a href="#" className="hover:text-neutral-400">Twitter</a>
                        <a href="#" className="hover:text-neutral-400">LinkedIn</a>
                        <a href="#" className="hover:text-neutral-400">Dribbble</a>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-neutral-900 text-xs text-neutral-600 uppercase tracking-widest">
                <span>© 2025 Artify Tech Solutions.</span>
                <span>All Rights Reserved.</span>
            </div>
        </section>
    )
}

// ==========================================
// 4. MAIN PAGE EXPORT
// ==========================================

export default function ServicesPageElectric() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: true }}>
        <div className="bg-[#050505] min-h-screen w-full cursor-none text-white font-sans selection:bg-violet-500/30">
        
        <Cursor />

        {/* --- NAVIGATION (Unified) --- */}
        <nav className="fixed top-0 w-full p-8 flex justify-between items-center z-50 text-white mix-blend-difference">
            <Magnetic>
                <div className="font-bold text-xl tracking-tighter cursor-pointer">ARTIFY®</div>
            </Magnetic>
            <Magnetic>
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsMenuOpen(true)}>
                    <div className="w-8 h-[2px] bg-white group-hover:w-12 transition-all" />
                    <span className="font-bold text-sm tracking-widest">MENU</span>
                </div>
            </Magnetic>
        </nav>

        <SlidingMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

        {/* --- PAGE CONTENT --- */}
        <SpotlightHero />

        {/* --- SERVICES SECTION --- */}
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Our Expertise
                </h2>
                <p className="text-neutral-500 mt-4 md:mt-0 text-right max-w-sm">
                    Strategic engineering for complex business problems.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <MagicCard 
                    title="High-Scale Ecommerce" 
                    description="Custom headless storefronts and Shopify Plus builds designed to handle high traffic and maximize conversion rates."
                    icon={Globe}
                />
                <MagicCard 
                    title="SaaS Development" 
                    description="Full-cycle development for Software-as-a-Service platforms. From MVP to enterprise-grade scalability."
                    icon={Layers}
                />
                <MagicCard 
                    title="CRM & Automation" 
                    description="Bespoke customer relationship management systems that automate workflows and centralize your data."
                    icon={Database}
                />
                <MagicCard 
                    title="Mobile Applications" 
                    description="Native-feel iOS and Android applications built with React Native for unified performance across devices."
                    icon={Smartphone}
                />
                <MagicCard 
                    title="Custom AI Agents" 
                    description="Integrating Large Language Models (LLMs) to automate support, data entry, and internal business logic."
                    icon={Wand2}
                />
                <MagicCard 
                    title="Performance & DevOps" 
                    description="Cloud infrastructure setup (AWS/Vercel), CI/CD pipelines, and optimization for sub-second load times."
                    icon={Code}
                />
            </div>
        </section>

        {/* --- SCROLLING TEXT --- */}
        <section className="py-20 bg-black border-y border-white/10 overflow-hidden">
            <motion.div 
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-12 items-center">
                        <span className="text-6xl md:text-8xl font-bold text-neutral-800 uppercase">Ecommerce</span>
                        <span className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500 uppercase">SaaS</span>
                        <span className="text-6xl md:text-8xl font-bold text-neutral-800 uppercase">Automation</span>
                        <span className="w-4 h-4 bg-white rounded-full"></span>
                    </div>
                ))}
            </motion.div>
        </section>



        {/* --- GLOBAL FOOTER (Unified) --- */}
        <Footer />

        </div>
    </ReactLenis>
  );
};