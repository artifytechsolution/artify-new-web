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
  Send,
  Instagram,
  Linkedin,
  Twitter
} from "lucide-react";
import { ReactLenis } from '@studio-freight/react-lenis';

// ==========================================
// 1. GLOBAL UTILITIES
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
// 2. CONTACT PAGE CONTENT
// ==========================================

const HeroTitle = () => {
    return (
        <section className="pt-40 pb-20 px-6 md:px-20 bg-[#050505] border-b border-neutral-900">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl"
            >
                <h1 className="text-[12vw] md:text-[8vw] font-medium leading-[0.9] text-white tracking-tighter mb-8">
                    Start a <br/> Project
                </h1>
            </motion.div>
        </section>
    )
}

const ContactLayout = () => {
    return (
        <section className="bg-[#050505] px-6 md:px-20 py-20 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-20">
                
                {/* --- LEFT: STICKY INFO --- */}
                <div className="w-full lg:w-1/3 relative">
                    <div className="lg:sticky lg:top-32 flex flex-col gap-12">
                        
                        <div>
                            <span className="text-neutral-500 text-xs uppercase tracking-widest font-mono mb-4 block">Contact Details</span>
                            <Magnetic>
                                <a href="mailto:hello@artify.tech" className="text-xl md:text-2xl text-white font-medium hover:text-neutral-400 transition-colors block mb-2">
                                    hello@artify.tech
                                </a>
                            </Magnetic>
                            <p className="text-neutral-400 text-lg">+1 (555) 000-0000</p>
                        </div>

                        <div>
                            <span className="text-neutral-500 text-xs uppercase tracking-widest font-mono mb-4 block">Headquarters</span>
                            <p className="text-white text-lg leading-relaxed mb-4">
                                470 Brannan St.<br/>
                                San Francisco, CA 94107
                            </p>
                            <a href="#" className="inline-flex items-center gap-2 text-sm text-neutral-400 border-b border-neutral-800 pb-1 hover:text-white hover:border-white transition-colors">
                                View on Map <ArrowUpRight size={14}/>
                            </a>
                        </div>

                        <div>
                             <span className="text-neutral-500 text-xs uppercase tracking-widest font-mono mb-4 block">Socials</span>
                             <div className="flex gap-6">
                                <a href="#" className="text-white hover:text-neutral-400 transition-colors"><Instagram size={20}/></a>
                                <a href="#" className="text-white hover:text-neutral-400 transition-colors"><Twitter size={20}/></a>
                                <a href="#" className="text-white hover:text-neutral-400 transition-colors"><Linkedin size={20}/></a>
                             </div>
                        </div>

                    </div>
                </div>

                {/* --- RIGHT: CLEAN FORM --- */}
                <div className="w-full lg:w-2/3">
                    <MinimalForm />
                </div>

            </div>
        </section>
    )
}

const MinimalForm = () => {
    const [activeService, setActiveService] = useState<string[]>([]);
    
    // UPDATED SERVICES based on your specific offerings
    const services = [
        "Ecommerce Build", 
        "SaaS Platform", 
        "AI Automation", 
        "UI/UX Design", 
        "Mobile App",
        "Consulting"
    ];

    const toggleService = (s: string) => {
        if(activeService.includes(s)) setActiveService(activeService.filter(item => item !== s));
        else setActiveService([...activeService, s]);
    }

    return (
        <form className="flex flex-col gap-16" onSubmit={(e) => e.preventDefault()}>
            
            {/* 01. Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="group relative">
                    <span className="text-xs font-mono text-neutral-500 uppercase mb-4 block">01. Name</span>
                    <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full bg-transparent border-b border-neutral-800 py-4 text-2xl text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
                    />
                </div>
                <div className="group relative">
                    <span className="text-xs font-mono text-neutral-500 uppercase mb-4 block">02. Email</span>
                    <input 
                        type="email" 
                        placeholder="john@company.com" 
                        className="w-full bg-transparent border-b border-neutral-800 py-4 text-2xl text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
                    />
                </div>
            </div>

            {/* 02. Services (Tags) */}
            <div>
                <span className="text-xs font-mono text-neutral-500 uppercase mb-6 block">03. What do you need?</span>
                <div className="flex flex-wrap gap-3">
                    {services.map((item, i) => (
                        <div 
                            key={i}
                            onClick={() => toggleService(item)}
                            className={`px-6 py-3 rounded-full border text-sm uppercase tracking-wider cursor-pointer transition-all duration-300
                            ${activeService.includes(item) 
                                ? 'bg-white text-black border-white' 
                                : 'bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-500'}`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* 03. Message */}
            <div className="group relative">
                <span className="text-xs font-mono text-neutral-500 uppercase mb-4 block">04. Project Details</span>
                <textarea 
                    rows={4}
                    placeholder="Tell us about your project goals, timeline, and budget..." 
                    className="w-full bg-transparent border-b border-neutral-800 py-4 text-2xl text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700 resize-none"
                />
            </div>

            {/* Submit */}
            <div className="pt-8 flex justify-end">
                <Magnetic>
                    <button className="h-[120px] w-[120px] md:h-[160px] md:w-[160px] rounded-full bg-blue-600 hover:bg-blue-500 text-white flex flex-col items-center justify-center gap-2 transition-colors">
                        <span className="text-sm font-bold uppercase tracking-widest">Send</span>
                        <Send size={20} />
                    </button>
                </Magnetic>
            </div>

        </form>
    )
}

// ==========================================
// 3. FOOTER
// ==========================================
const Footer = () => {
    return (
        <section className="bg-[#0a0a0a] text-white pt-20 pb-12 px-8 md:px-20 border-t border-neutral-900">
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
// 4. MAIN EXPORT
// ==========================================

export default function ContactPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: true }}>
            <div className="bg-[#050505] min-h-screen w-full cursor-none overflow-x-hidden font-sans selection:bg-blue-500 selection:text-white">
                
                <Cursor />
                
                <style jsx global>{`
                    ::-webkit-scrollbar { display: none; }
                    * { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>

                {/* --- NAVIGATION (With Blogs Added) --- */}
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

                {/* --- CONTENT --- */}
                <HeroTitle />
                <ContactLayout />
                
                {/* --- FOOTER --- */}
                <Footer />

            </div>
        </ReactLenis>
    );
}