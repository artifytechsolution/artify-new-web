
"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useMotionValue, 
  AnimatePresence 
} from "framer-motion";
import { 
  Menu as MenuIcon, 
  X, 
  ArrowUpRight,
  Search,
  Instagram,
  Twitter,
  Linkedin
} from "lucide-react";
import { ReactLenis } from '@studio-freight/react-lenis';

// ==========================================
// 1. GLOBAL COMPONENTS (Header/Footer System)
// ==========================================

const Magnetic = ({ children }: { children: React.ReactElement }) => {
    const ref = useRef<HTMLDivElement>(null);
    const position = { x: useMotionValue(0), y: useMotionValue(0) };
    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width/2);
        const middleY = clientY - (top + height/2);
        position.x.set(middleX * 0.35); position.y.set(middleY * 0.35);
    }
    const reset = () => { position.x.set(0); position.y.set(0); }
    const { x, y } = position;
    return (
        <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} animate={{ x, y }} transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}>
            {children}
        </motion.div>
    )
}



const Footer = () => {
    return (
        <section className="bg-[#0a0a0a] text-white pt-20 pb-12 px-8 md:px-20 border-t border-neutral-900">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center mb-20">
                <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-8">Have an idea?</h2>
                <h1 className="text-[10vw] font-black tracking-tighter leading-none mb-12">LET'S BUILD <br/> THE FUTURE.</h1>
                <Magnetic><button className="px-12 py-6 bg-white text-black rounded-full font-bold text-xl hover:scale-110 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">Get in Touch</button></Magnetic>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end border-t border-neutral-900 pt-12">
                <div className="flex flex-col gap-2 mb-8 md:mb-0"><span className="text-2xl font-bold tracking-tight">ARTIFY®</span><p className="text-neutral-500 text-sm max-w-xs">Digital design and engineering studio.<br/>Based in San Francisco, working globally.</p></div>
                <div className="flex gap-12 text-sm font-medium">
                    <div className="flex flex-col gap-4"><span className="text-neutral-500 uppercase tracking-widest text-xs">Sitemap</span><a href="#" className="hover:text-neutral-400">Home</a><a href="#" className="hover:text-neutral-400">Work</a><a href="#" className="hover:text-neutral-400">Services</a></div>
                    <div className="flex flex-col gap-4"><span className="text-neutral-500 uppercase tracking-widest text-xs">Socials</span><a href="#" className="hover:text-neutral-400">Instagram</a><a href="#" className="hover:text-neutral-400">Twitter</a><a href="#" className="hover:text-neutral-400">LinkedIn</a></div>
                </div>
            </div>
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-neutral-900 text-xs text-neutral-600 uppercase tracking-widest"><span>© 2025 Artify Tech Solutions.</span><span>All Rights Reserved.</span></div>
        </section>
    )
}

const Grain = () => (
    <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[9998] mix-blend-overlay">
        <svg className="w-full h-full"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noise)"/></svg>
    </div>
);
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
// 2. BLOG LISTING DATA
// ==========================================

const BLOG_POSTS = [
    {
        id: 1,
        title: "The Silent Revolution",
        category: "Design Systems",
        date: "Oct 24, 2025",
        read: "5 Min Read",
        img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2668&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Abstract Logic: AI in 2025",
        category: "Technology",
        date: "Oct 12, 2025",
        read: "8 Min Read",
        img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Typography as Interface",
        category: "UX Design",
        date: "Sep 28, 2025",
        read: "4 Min Read",
        img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Sustainable WebGL",
        category: "Engineering",
        date: "Sep 15, 2025",
        read: "6 Min Read",
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "The Death of Cookies",
        category: "Marketing",
        date: "Sep 02, 2025",
        read: "5 Min Read",
        img: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Motion Principles",
        category: "Animation",
        date: "Aug 20, 2025",
        read: "7 Min Read",
        img: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=2565&auto=format&fit=crop"
    }
];

// ==========================================
// 3. BLOG COMPONENTS
// ==========================================

const Hero = () => {
    return (
        <section className="pt-40 pb-12 px-6 md:px-20 bg-[#050505]">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-6"
            >
                <div className="flex items-center gap-4 text-neutral-500 font-mono text-xs uppercase tracking-widest">
                    <span>Thoughts</span>
                    <div className="w-12 h-[1px] bg-neutral-800" />
                    <span>Insights</span>
                </div>
                <h1 className="text-[10vw] font-medium leading-[0.9] text-white tracking-tighter">
                    LATEST <br/>
                    INTEL
                </h1>
            </motion.div>
        </section>
    )
}

const FilterBar = ({ active, setActive }: { active: string, setActive: any }) => {
    const categories = ["All", "Design Systems", "Technology", "UX Design", "Engineering"];
    
    return (
        <div className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-y border-neutral-900 px-6 md:px-20 py-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-8 min-w-max">
                {categories.map((cat, i) => (
                    <button 
                        key={i}
                        onClick={() => setActive(cat)}
                        className={`text-sm uppercase tracking-widest transition-colors ${active === cat ? "text-white underline underline-offset-8" : "text-neutral-500 hover:text-white"}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    )
}

const BlogCard = ({ post, index }: { post: any, index: number }) => {
    // In a real app, wrap this card in <Link href={`/blog/${post.slug}`}>
    // For this demo, clicking the card navigates via standard anchor
    
    return (
        <a href="/blogdetails/123" className="block group">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col gap-6"
            >
                {/* Image Container */}
                <div className="w-full aspect-[4/3] overflow-hidden relative bg-neutral-900 rounded-sm">
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-white uppercase tracking-widest">
                        {post.category}
                    </div>
                    
                    <motion.img 
                        src={post.img}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <ArrowUpRight className="text-black w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 border-t border-neutral-900 pt-6">
                    <div className="flex justify-between text-xs font-mono text-neutral-500 uppercase tracking-widest">
                        <span>{post.date}</span>
                        <span>{post.read}</span>
                    </div>
                    <h3 className="text-3xl font-medium text-white group-hover:text-neutral-400 transition-colors leading-tight">
                        {post.title}
                    </h3>
                </div>
            </motion.div>
        </a>
    )
}

const GridSystem = () => {
    const [activeCat, setActiveCat] = useState("All");

    const filteredPosts = activeCat === "All" 
        ? BLOG_POSTS 
        : BLOG_POSTS.filter(post => post.category === activeCat);

    return (
        <section className="min-h-screen bg-[#050505] relative z-10">
            <FilterBar active={activeCat} setActive={setActiveCat} />
            
            <div className="px-6 md:px-20 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                    <AnimatePresence mode="wait">
                        {filteredPosts.map((post, index) => (
                            <BlogCard key={post.id} post={post} index={index} />
                        ))}
                    </AnimatePresence>
                </div>
                
                {filteredPosts.length === 0 && (
                     <div className="h-[40vh] flex items-center justify-center text-neutral-500 font-mono text-sm uppercase">
                        No articles found in this category.
                     </div>
                )}
            </div>

            <div className="flex justify-center pb-32">
                 <Magnetic>
                    <button className="px-8 py-4 border border-neutral-800 rounded-full text-white text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                        Load More Articles
                    </button>
                </Magnetic>
            </div>
        </section>
    )
}

// ==========================================
// 4. MAIN PAGE
// ==========================================

export default function BlogListing() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: true }}>
            <div className="bg-[#050505] min-h-screen w-full cursor-none overflow-x-hidden font-sans selection:bg-white selection:text-black">
                
                <Cursor />
                <Grain />
                
                <style jsx global>{`
                    ::-webkit-scrollbar { display: none; }
                    * { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>

                {/* --- NAVIGATION (Standard) --- */}
                <nav className="fixed top-0 w-full p-8 flex justify-between items-center z-50 text-white mix-blend-difference pointer-events-auto">
                    <Magnetic>
                        <a href="/" className="font-bold text-xl tracking-tighter cursor-pointer">ARTIFY®</a>
                    </Magnetic>
                    <div className="flex items-center gap-8">
                        
                        <Magnetic>
                            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsMenuOpen(true)}>
                                <div className="w-8 h-[2px] bg-white group-hover:w-12 transition-all" />
                                <span className="font-bold text-sm tracking-widest">MENU</span>
                            </div>
                        </Magnetic>
                    </div>
                </nav>

                <SlidingMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

                {/* --- CONTENT --- */}
                <Hero />
                <GridSystem />
                
                {/* --- FOOTER (Standard) --- */}
                <Footer />

            </div>
        </ReactLenis>
    );
}