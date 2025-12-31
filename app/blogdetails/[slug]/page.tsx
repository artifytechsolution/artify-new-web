"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue,
  AnimatePresence 
} from "framer-motion";
import { 
  ArrowRight, 
  Share2, 
  Copy, 
  Twitter, 
  Linkedin, 
  Menu as MenuIcon, 
  X 
} from "lucide-react";
import { ReactLenis } from '@studio-freight/react-lenis';

// ==========================================
// 1. GLOBAL SYSTEM (Header / Footer / Menu)
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

    const navItems = ["Home", "Work", "Services", "About", "Blogs", "Contact"];

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
                        <div className="flex flex-col gap-4">
                            <span className="text-xs uppercase tracking-widest text-neutral-500 mb-4">Socials</span>
                            <div className="flex gap-6 text-white">
                                <a href="#" className="hover:text-neutral-400">LinkedIn</a>
                                <a href="#" className="hover:text-neutral-400">Instagram</a>
                                <a href="#" className="hover:text-neutral-400">Twitter</a>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

const Footer = () => {
    return (
        <section className="bg-[#0a0a0a] text-white pt-20 pb-12 px-8 md:px-20 border-t border-neutral-900 relative z-50">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center mb-20">
                <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-8">Have an idea?</h2>
                <h1 className="text-[10vw] font-black tracking-tighter leading-none mb-12">
                    LET'S BUILD <br/> THE FUTURE.
                </h1>
                <Magnetic>
                    <button className="px-12 py-6 bg-white text-black rounded-full font-bold text-xl hover:scale-110 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                        Get in Touch
                    </button>
                </Magnetic>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end border-t border-neutral-900 pt-12">
                <div className="flex flex-col gap-2 mb-8 md:mb-0">
                    <span className="text-2xl font-bold tracking-tight">ARTIFY®</span>
                    <p className="text-neutral-500 text-sm max-w-xs">
                        Digital design and engineering studio.<br/>Based in San Francisco, working globally.
                    </p>
                </div>

                <div className="flex gap-12 text-sm font-medium">
                    <div className="flex flex-col gap-4">
                        <span className="text-neutral-500 uppercase tracking-widest text-xs">Sitemap</span>
                        <a href="#" className="hover:text-neutral-400">Home</a>
                        <a href="#" className="hover:text-neutral-400">Work</a>
                        <a href="#" className="hover:text-neutral-400">Services</a>
                        <a href="#" className="hover:text-neutral-400">Agency</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-neutral-500 uppercase tracking-widest text-xs">Socials</span>
                        <a href="#" className="hover:text-neutral-400">Instagram</a>
                        <a href="#" className="hover:text-neutral-400">Twitter</a>
                        <a href="#" className="hover:text-neutral-400">LinkedIn</a>
                        <a href="#" className="hover:text-neutral-400">Awwwards</a>
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
// 2. PAGE SPECIFIC UTILITIES
// ==========================================

const Grain = () => (
    <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[9998] mix-blend-overlay">
        <svg className="w-full h-full">
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="3" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)"/>
        </svg>
    </div>
);

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <motion.div className="fixed bottom-12 right-12 z-50 hidden md:block mix-blend-difference">
            <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="2" />
                    <motion.circle 
                        cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2"
                        pathLength="1"
                        style={{ pathLength: scaleX }}
                    />
                </svg>
                <div className="absolute text-[10px] font-mono text-white">READ</div>
            </div>
        </motion.div>
    );
};

const ParallaxImage = ({ src, caption }: { src: string, caption?: string }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

    return (
        <div ref={ref} className="my-24 w-full md:w-[120%] md:-ml-[10%] relative group">
            <div className="overflow-hidden aspect-[16/9] relative rounded-sm">
                <motion.div style={{ y, scale }} className="w-full h-[120%] -top-[10%] absolute">
                    <img src={src} className="w-full h-full object-cover" alt="Article visual" />
                </motion.div>
            </div>
            {caption && (
                <div className="mt-4 flex items-center gap-4 text-xs font-mono text-neutral-500 uppercase tracking-widest">
                    <div className="w-12 h-[1px] bg-neutral-800" />
                    {caption}
                </div>
            )}
        </div>
    )
}

const TextBlock = ({ children }: { children: React.ReactNode }) => {
    return (
        <p className="text-xl md:text-2xl leading-[1.6] text-neutral-300 mb-8 font-light">
            {children}
        </p>
    )
}

const SectionHeading = ({ children }: { children: string }) => {
    return (
        <h2 className="text-3xl md:text-5xl font-bold text-white mt-20 mb-8 tracking-tight">
            {children}
        </h2>
    )
}

// ==========================================
// 3. MAIN PAGE EXPORT
// ==========================================
export default function SinglePost() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothTouch: true }}>
            <div className="bg-[#050505] min-h-screen w-full text-[#e1e1e1] selection:bg-white selection:text-black font-sans">
                
                <Grain />
                <ScrollProgress />

                {/* --- NAVIGATION (Unified System) --- */}
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

                {/* --- HERO SECTION --- */}
                <header ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center px-4">
                    <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl">
                        <div className="flex justify-center gap-4 mb-8">
                            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase tracking-widest text-neutral-400">Design Systems</span>
                            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase tracking-widest text-neutral-400">5 Min Read</span>
                        </div>
                        <h1 className="text-[10vw] md:text-[6vw] font-medium tracking-tighter leading-[0.95] mb-12 text-white">
                            THE SILENT <br/> REVOLUTION
                        </h1>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-sm font-bold uppercase tracking-widest">By Sarah Jenkins</span>
                            <span className="text-xs text-neutral-500 font-mono">Published Oct 24, 2025</span>
                        </div>
                    </motion.div>

                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black/40 z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                        <img 
                            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2668&auto=format&fit=crop" 
                            className="w-full h-full object-cover"
                            alt="Hero background"
                        />
                    </div>
                </header>

                {/* --- CONTENT LAYOUT --- */}
                <article className="relative z-10 px-4 md:px-0 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-32">
                    
                    {/* Sticky Sidebar (Socials) */}
                    <aside className="hidden md:block col-span-2 h-full">
                        <div className="sticky top-32 flex flex-col gap-6 items-end pr-8">
                            <span className="text-[10px] font-mono uppercase text-neutral-600 mb-2">Share</span>
                            <Magnetic><div className="p-3 rounded-full border border-neutral-800 hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer text-neutral-400"><Twitter size={16}/></div></Magnetic>
                            <Magnetic><div className="p-3 rounded-full border border-neutral-800 hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer text-neutral-400"><Linkedin size={16}/></div></Magnetic>
                            <Magnetic><div className="p-3 rounded-full border border-neutral-800 hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer text-neutral-400"><Copy size={16}/></div></Magnetic>
                        </div>
                    </aside>

                    {/* Main Text Content */}
                    <div className="col-span-1 md:col-span-8 md:px-12">
                        <div className="first-letter:text-7xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left">
                            <TextBlock>
                                In the early days of the digital web, design was noisy. It was a clamor of bevels, shadows, and textures screaming for attention. Today, we are witnessing a shift towards silence—a design philosophy that prioritizes the absence of noise over the presence of features.
                            </TextBlock>
                        </div>
                        
                        <TextBlock>
                            This isn't just about minimalism. Minimalism is an aesthetic; silence is a function. It is the deliberate removal of cognitive load, allowing the user's intent to be the only thing that matters on the screen.
                        </TextBlock>

                        <ParallaxImage 
                            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop" 
                            caption="Fig 1. The reduction of interface density over time."
                        />

                        <SectionHeading>The Utility of Void</SectionHeading>
                        
                        <TextBlock>
                            When we strip away the decorative elements, we are left with the raw utility of the product. The "void"—or negative space—becomes an active element. It directs the eye, paces the reading experience, and creates a sense of luxury.
                        </TextBlock>
                        
                        <blockquote className="my-16 pl-8 border-l-2 border-white text-3xl md:text-4xl font-medium leading-tight text-white italic">
                            "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away."
                        </blockquote>

                        <TextBlock>
                            In modern interface design, this translates to "micro-interactions." Instead of a static button, we have a magnetic pull. Instead of a loading spinner, we have a fluid skeleton screen. The interface feels alive, yet it remains silent until interacted with.
                        </TextBlock>

                        <ParallaxImage 
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                            caption="Fig 2. Interactive states in modern webgl environments."
                        />

                        <SectionHeading>Engineered Serenity</SectionHeading>

                        <TextBlock>
                            Achieving this level of simplicity is, ironically, complex. It requires robust engineering. To make a page load instantly, transition smoothly, and respond intuitively requires optimized code, precise animation physics (like simple harmonic motion), and a deep understanding of browser rendering.
                        </TextBlock>

                        <TextBlock>
                            The future of web design isn't about more pixels; it's about smarter pixels. It's about interfaces that anticipate needs and recede into the background when not needed.
                        </TextBlock>
                        
                        <div className="mt-20 pt-12 border-t border-neutral-800">
                            <div className="flex gap-4 items-center mb-6">
                                <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-12 h-12 rounded-full grayscale" alt="Author" />
                                <div>
                                    <h4 className="font-bold text-white">Sarah Jenkins</h4>
                                    <p className="text-xs text-neutral-500 font-mono uppercase">Lead Product Designer @ Artify</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Space */}
                    <div className="hidden md:block col-span-2"></div>
                </article>

                {/* --- UP NEXT SECTION (Preserved) --- */}
                <section className="bg-[#e1e1e1] text-black py-32 px-4 md:px-20 cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end relative z-10">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4 block">Up Next</span>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] group-hover:translate-x-4 transition-transform duration-500">
                                ABSTRACT <br/> LOGIC
                            </h2>
                        </div>
                        <div className="mt-8 md:mt-0 flex items-center gap-4">
                            <span className="font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">Read Article</span>
                            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-125 transition-transform duration-500">
                                <ArrowRight size={24} className="group-hover:-rotate-45 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                </section>

                {/* --- GLOBAL FOOTER (Unified System) --- */}
                <Footer />

            </div>
        </ReactLenis>
    );
}