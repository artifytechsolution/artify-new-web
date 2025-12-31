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
  ArrowRight,
  Monitor,
  Cpu,
  Globe,
  Zap,
  CheckCircle2,
  Lock,
  FileCode,
  Layers,
  Minus,
  Plus,
  Search,
  PenTool,
  Code2,
  ShieldCheck,
  Rocket
} from "lucide-react";
import { ReactLenis } from '@studio-freight/react-lenis';

// ==========================================
// 1. DATA: The Process Steps
// ==========================================
const steps = [
  {
    id: "01",
    title: "Discovery & Strategy",
    desc: "We analyze your market position and define the technical architecture. Whether it's a high-traffic Ecommerce store or a complex SaaS dashboard, we start with a blueprint.",
    icon: Search,
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "UI/UX & Prototyping",
    desc: "We build interactive Figma prototypes. You'll see exactly how your users will interact with the application before we write a single line of code.",
    icon: PenTool,
    img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Full-Stack Development",
    desc: "Agile sprints using Next.js, React, and Tailwind. We build modular, scalable components backed by robust APIs and secure databases.",
    icon: Code2,
    img: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "04",
    title: "Testing & QA",
    desc: "Rigorous stress testing and security audits. We ensure your platform can handle traffic spikes and that every transaction is secure.",
    icon: ShieldCheck,
    img: "https://images.unsplash.com/photo-1629904853716-646515691aa4?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "05",
    title: "Deployment & Scale",
    desc: "Launch on edge networks like Vercel or AWS. We set up CI/CD pipelines for instant updates and monitor performance 24/7.",
    icon: Rocket,
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop"
  },
];

// New Data for Deliverables
const deliverables = [
    {
        title: "Full Source Code Ownership",
        desc: "You own the IP. We transfer the full Git repository with clean, commented code. No vendor lock-in."
    },
    {
        title: "Figma Master Files",
        desc: "Access to the complete design system, component library, and high-fidelity prototypes."
    },
    {
        title: "API Documentation",
        desc: "Comprehensive Swagger/OpenAPI documentation for all backend endpoints and database schemas."
    },
    {
        title: "CI/CD Pipeline Setup",
        desc: "Automated deployment workflows set up on your cloud provider (AWS, Vercel, or Azure)."
    }
];

// ==========================================
// 2. GLOBAL UTILITIES
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
// 3. NEW SECTION: PHILOSOPHY GRID
// ==========================================
const Philosophy = () => {
    return (
        <section className="py-24 px-4 md:px-20 bg-[#050505] border-b border-white/5 relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                 <div className="group">
                     <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                         <Lock size={24} />
                     </div>
                     <h3 className="text-2xl font-bold text-white mb-4">Total Ownership</h3>
                     <p className="text-neutral-400 leading-relaxed">
                         We don't lease software. Once we build it, it's 100% yours. No recurring license fees, no black-box code.
                     </p>
                 </div>
                 <div className="group">
                     <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                         <FileCode size={24} />
                     </div>
                     <h3 className="text-2xl font-bold text-white mb-4">Clean Architecture</h3>
                     <p className="text-neutral-400 leading-relaxed">
                         We write code that humans can read. Modular, scalable, and documented, making future updates painless.
                     </p>
                 </div>
                 <div className="group">
                     <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center mb-6 text-pink-500 group-hover:scale-110 transition-transform">
                         <Layers size={24} />
                     </div>
                     <h3 className="text-2xl font-bold text-white mb-4">Business First</h3>
                     <p className="text-neutral-400 leading-relaxed">
                         Pretty UI is useless if the logic fails. We engineer the database and business logic before moving pixels.
                     </p>
                 </div>
             </div>
        </section>
    )
}

// ==========================================
// 4. HORIZONTAL SCROLL COMPONENT (Existing)
// ==========================================

const HorizontalScroll = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Maps vertical scroll (0 to 1) to horizontal movement (1% to -95%)
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#050505]">
      {/* Sticky Container */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Horizontal Moving Layer */}
        <motion.div style={{ x }} className="flex gap-12 md:gap-32 pl-4 md:pl-20">
          
          {/* Intro Text Card */}
          <div className="flex flex-col justify-center min-w-[80vw] md:min-w-[40vw]">
             <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6">
                THE <br/> ROADMAP.
             </h2>
             <p className="text-xl text-neutral-400 max-w-md">
                Scroll to explore our engineering lifecycle. Precision at every step.
             </p>
             <div className="flex items-center gap-2 mt-8 text-white font-mono text-xs uppercase tracking-widest">
                <div className="w-12 h-[1px] bg-white"></div>
                Scroll Down
             </div>
          </div>

          {/* Step Cards */}
          {steps.map((step) => {
            return (
              <div key={step.id} className="relative h-[70vh] w-[85vw] md:w-[60vw] flex flex-col md:flex-row gap-8 bg-neutral-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm group hover:border-white/20 transition-colors duration-500">
                
                {/* Image Side */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden relative">
                    <img 
                        src={step.img} 
                        alt={step.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white font-mono text-sm">
                        STEP {step.id}
                    </div>
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center mb-8">
                        <step.icon size={24} />
                    </div>
                    <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        {step.title}
                    </h3>
                    <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-md">
                        {step.desc}
                    </p>
                </div>
              </div>
            );
          })}
          
          {/* End Card */}
           <div className="flex flex-col justify-center min-w-[80vw] md:min-w-[40vw] pr-20">
             <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6">
                READY?
             </h2>
             <Magnetic>
                 <button className="text-left text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-bold hover:opacity-80 transition-opacity">
                    Start your project <ArrowRight className="inline-block ml-4" />
                 </button>
             </Magnetic>
          </div>

        </motion.div>

        {/* Progress Bar (Bottom) */}
        <div className="absolute bottom-10 left-10 right-10 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div 
                style={{ scaleX: scrollYProgress, transformOrigin: "0%" }} 
                className="h-full bg-blue-500" 
            />
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 5. NEW SECTION: DELIVERABLES
// ==========================================
const Deliverables = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-32 px-4 md:px-20 bg-[#050505] relative z-10">
            <div className="flex flex-col md:flex-row gap-20">
                <div className="w-full md:w-1/3">
                    <h2 className="text-sm text-blue-500 uppercase tracking-widest font-mono mb-6">Output</h2>
                    <h3 className="text-5xl md:text-6xl font-black text-white leading-tight mb-8">
                        WHAT YOU <br/> RECEIVE.
                    </h3>
                    <p className="text-neutral-400 text-lg">
                        We believe in transparent handovers. Here is exactly what you get when we ship.
                    </p>
                </div>
                
                <div className="w-full md:w-2/3">
                    {deliverables.map((item, i) => (
                        <div key={i} className="border-b border-neutral-800">
                            <button 
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full py-8 flex items-center justify-between text-left group"
                            >
                                <span className="text-2xl font-bold text-white group-hover:text-blue-500 transition-colors">{item.title}</span>
                                <div className="text-white">
                                    {openIndex === i ? <Minus size={24} /> : <Plus size={24} />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-neutral-400 pb-8 text-lg leading-relaxed max-w-2xl">
                                            {item.desc}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ==========================================
// 6. HERO (Existing)
// ==========================================
const Hero = () => {
    return (
         <section className="h-[70vh] flex flex-col justify-center items-center text-center px-4 bg-[#050505] border-b border-white/5 relative z-10">
             <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-4">
                 About Us
             </h1>
             <p className="text-neutral-500 text-xl font-mono uppercase tracking-widest">
                From Abstract to Concrete
             </p>
         </section>
    )
}

// ==========================================
// 7. MAIN EXPORT
// ==========================================

export default function ProcessPageHorizontal() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: true }}>
            <div className="bg-[#050505] min-h-screen w-full font-sans selection:bg-blue-500/30 selection:text-white">
                
                {/* Navbar */}
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

                {/* Content */}
                <Hero />
                
                {/* ADDED: Philosophy Section */}
                <Philosophy />
                
                {/* EXISTING: Horizontal Scroll */}
                <HorizontalScroll />

                {/* ADDED: Deliverables Section */}
                <Deliverables />
                
                <Footer />

            </div>
        </ReactLenis>
    );
}