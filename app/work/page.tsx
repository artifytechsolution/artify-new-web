"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  AnimatePresence,
  useInView,
  useAnimationFrame
} from "framer-motion";
import { ArrowUpRight, X, Star, Play, Quote, Menu as MenuIcon, ArrowDown } from "lucide-react";
import { ReactLenis } from '@studio-freight/react-lenis';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITY ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==========================================
// 1. GLOBAL COMPONENTS (Cursor, Magnetic)
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
// 3. WORK PAGE HERO
// ==========================================
const Hero = () => {
    return (
        <section className="min-h-[80vh] bg-[#050505] flex flex-col relative border-b border-neutral-900 pt-32">
             
             {/* Decorative Grid Lines */}
             <div className="absolute inset-0 flex justify-between pointer-events-none px-4 md:px-20">
                <div className="w-[1px] h-full bg-neutral-900/50" />
                <div className="w-[1px] h-full bg-neutral-900/50 hidden md:block" />
                <div className="w-[1px] h-full bg-neutral-900/50" />
             </div>

             <div className="px-8 md:px-20 z-10 flex flex-col justify-between h-full pb-20">
                 <div>
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-between items-end mb-8"
                     >
                        <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.2em]">Portfolio 2025</span>
                        <span className="text-neutral-500 font-mono text-xs uppercase tracking-[0.2em] hidden md:block">Scroll Down</span>
                     </motion.div>
                     
                     <motion.h1 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-[11vw] font-medium text-white leading-[0.9] tracking-tighter"
                     >
                        SELECTED <br/> WORKS
                     </motion.h1>
                 </div>

                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-end mt-12"
                 >
                     <p className="text-neutral-400 max-w-sm text-lg leading-relaxed text-right">
                        We engineer digital products that define brands. <br/>
                        Precise, scalable, and beautifully crafted.
                     </p>
                 </motion.div>
             </div>
        </section>
    )
}

// ==========================================
// 4. PROJECT FEED (Work Specific)
// ==========================================
const projects = [
    { 
        id: "01",
        title: "E-Commerce Website", 
        role: "Online Retail", 
        desc: "Custom storefronts with seamless payment integration.",
        img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670" 
    },
    { 
        id: "02",
        title: "Food Delivery App", 
        role: "Ordering Platform", 
        desc: "Real-time logistics and ordering systems.",
        img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670" 
    },
    { 
        id: "03",
        title: "Medical Platform", 
        role: "Healthcare Tech", 
        desc: "Patient management and telemedicine solutions.",
        img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2670" 
    },
    { 
        id: "04",
        title: "SaaS Dashboard", 
        role: "B2B Software", 
        desc: "Scalable cloud architectures and analytics.",
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426" 
    },
    { 
        id: "05",
        title: "CRM System", 
        role: "Business Automation", 
        desc: "Custom tools to manage customer relationships.",
        img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670" 
    }
];

const ProjectItem = ({ data, index }: { data: any, index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <div ref={ref} className="group relative border-b border-neutral-900 py-20 px-4 md:px-20 bg-[#050505]">
            <div className="absolute inset-0 flex justify-between pointer-events-none px-4 md:px-20">
                <div className="w-[1px] h-full bg-neutral-900/30" />
                <div className="w-[1px] h-full bg-neutral-900/30 hidden md:block" />
                <div className="w-[1px] h-full bg-neutral-900/30" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-12 md:gap-24 items-start">
                <div className="w-full md:w-1/3 pt-4">
                    <span className="text-neutral-600 font-mono text-xs mb-4 block">0{index+1} / {data.role}</span>
                    <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight mb-6 group-hover:text-blue-500 transition-colors duration-500">
                        {data.title}
                    </h2>
                    <p className="text-neutral-400 leading-relaxed mb-8">
                        {data.desc}
                    </p>
                    <Magnetic>
                        <button className="flex items-center gap-2 text-white text-sm uppercase font-bold tracking-widest hover:gap-4 transition-all">
                            View Case <ArrowUpRight size={16}/>
                        </button>
                    </Magnetic>
                </div>
                <div className="w-full md:w-2/3">
                    <motion.div 
                        initial={{ clipPath: "inset(100% 0 0 0)" }}
                        animate={isInView ? { clipPath: "inset(0% 0 0 0)" } : {}}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                        className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-900"
                    >
                        <motion.img 
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.7 }}
                            src={data.img} 
                            alt={data.title} 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

const ProjectFeed = () => {
    return (
        <section className="border-t border-neutral-900">
            {projects.map((project, index) => (
                <ProjectItem key={index} data={project} index={index} />
            ))}
        </section>
    )
}

// ==========================================
// 5. TRUSTED CLIENTS (Work Specific)
// ==========================================
const TrustedClients = () => {
    // Your specific client list
    const clients = [
        "KRAMBICA", 
        "FRESHBUCKET", 
        "REVOUR HOTELS", 
        "ARIHANT STAFFING", 
        "FORESTVEDAS"
    ];

    return (
        <section className="py-24 bg-[#050505] border-t border-b border-neutral-900 overflow-hidden relative">
             {/* Background Grid Lines for Aesthetics */}
             <div className="absolute inset-0 flex justify-between pointer-events-none px-4 md:px-20 z-20">
                <div className="w-[1px] h-full bg-neutral-900/30" />
                <div className="w-[1px] h-full bg-neutral-900/30 hidden md:block" />
                <div className="w-[1px] h-full bg-neutral-900/30" />
             </div>

             {/* Header */}
             <div className="text-center mb-16 relative z-10">
                 <p className="text-neutral-500 font-mono text-xs uppercase tracking-[0.2em]">
                    Trusted by Satisfied Clients
                 </p>
             </div>

            {/* Marquee Animation */}
            <div className="flex relative z-10">
                <motion.div 
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    // Adjusted duration for smooth speed with the new list length
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex flex-nowrap items-center gap-16 md:gap-32 pr-16 md:pr-32 w-max"
                >
                    {/* Repeated 4 times to ensure infinite scroll covers large screens */}
                    {[...clients, ...clients, ...clients, ...clients].map((client, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-default">
                             <span className="text-4xl md:text-6xl font-bold text-neutral-800 group-hover:text-white transition-colors duration-500 whitespace-nowrap">
                                {client}
                             </span>
                             <div className="w-2 h-2 bg-neutral-800 rounded-full group-hover:bg-blue-500 transition-colors" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

// ==========================================
// 6. CLIENT REVIEWS (Work Specific)
// ==========================================
const ClientReviews = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // --- Data: Text Reviews ---
  const reviews = [
    { name: "Sarah Jenkins", role: "CTO, Onyx", text: "Artify transformed our complex trading data into a seamless experience." },
    { name: "David Kim", role: "Founder, Lumina", text: "We needed compliance and high-end design. Artify delivered beyond expectations." },
    { name: "Elena Rodriguez", role: "Product Lead, Vantage", text: "They don't just write code; they engineer experiences. The AI integration was flawless." },
    { name: "Michael Chen", role: "Director, Apex", text: "The scalability they built into our architecture allowed us to 10x our user base." },
    { name: "Jessica Wei", role: "VP Design, Flow", text: "Rarely do you find developers who care this much about pixel perfection." }
  ];

  // --- Data: Video Reviews ---
  const videoReviews = [
    { id: 1, name: "Onyx Trading", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 2, name: "Lumina Health", thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 3, name: "Vantage AI", thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 4, name: "Nexus Systems", thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
  ];

  return (
    <section className="py-24 bg-[#050505] relative border-b border-neutral-900 overflow-hidden font-sans">
      
      {/* Background Grid Lines */}
      <div className="absolute inset-0 flex justify-between pointer-events-none px-4 md:px-20 z-0 opacity-20">
        <div className="w-[1px] h-full bg-neutral-800" />
        <div className="w-[1px] h-full bg-neutral-800 hidden md:block" />
        <div className="w-[1px] h-full bg-neutral-800" />
      </div>

      <div className="relative z-10">
        
        {/* Header */}
        <div className="px-8 md:px-20 mb-20">
          <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.2em] mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight">Client Perspectives</h2>
        </div>

        {/* 1. TEXT REVIEWS CAROUSEL */}
        <div className="w-full mb-24 relative group">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

            <div className="flex overflow-hidden">
                <div className="flex animate-marquee-slow group-hover:[animation-play-state:paused] gap-8 pl-8">
                    {[...reviews, ...reviews, ...reviews].map((review, i) => (
                        <div 
                            key={i} 
                            className="flex-shrink-0 w-[400px] bg-neutral-900/30 border border-neutral-800 p-8 rounded-xl hover:border-blue-500/30 transition-colors duration-300"
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, s) => (
                                    <Star key={s} size={14} className="text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>
                            <div className="relative">
                                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-neutral-800 fill-neutral-800 -z-10 opacity-50" />
                                <p className="text-neutral-300 text-lg leading-relaxed mb-6 font-light">
                                    "{review.text}"
                                </p>
                            </div>
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold text-sm">{review.name}</h4>
                                    <span className="text-neutral-500 text-xs font-mono uppercase">{review.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 2. VIDEO STORIES CAROUSEL */}
        <div className="w-full relative group">
          <div className="px-8 md:px-20 mb-8 flex items-center gap-4">
             <div className="h-[1px] bg-neutral-800 w-12"></div>
             <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Video Stories</span>
          </div>

          <div className="flex overflow-hidden">
            <div className="flex animate-marquee-reverse group-hover:[animation-play-state:paused] gap-6 px-6">
              {[...videoReviews, ...videoReviews, ...videoReviews, ...videoReviews].map((video, idx) => (
                <div 
                  key={`${video.id}-${idx}`}
                  onClick={() => setSelectedVideo(video.video)}
                  className="relative flex-shrink-0 w-[300px] h-[400px] rounded-lg overflow-hidden cursor-pointer border border-neutral-800 hover:border-blue-500 transition-all duration-300 group/card"
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.name} 
                    className="w-full h-full object-cover opacity-70 group-hover/card:opacity-50 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover/card:scale-110 transition-transform duration-300">
                       <Play size={28} className="text-white fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-medium text-lg truncate">{video.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-blue-400 text-xs font-mono uppercase tracking-wider">Watch Story</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-6 right-6 z-20 p-2 bg-neutral-900/50 text-white rounded-full hover:bg-white hover:text-black transition-colors backdrop-blur-md border border-white/10"
            >
              <X size={24} />
            </button>
            <video 
              src={selectedVideo} 
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-slow {
          animation: marquee 80s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 60s linear infinite;
        }
      `}</style>

    </section>
  );
};

// ==========================================
// 7. FOOTER (UNIFIED - Matched to Home Page)
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
// MAIN PAGE EXPORT (WORK PAGE)
// ==========================================
export default function WorkPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: true }}>
            <div className="bg-[#050505] min-h-screen w-full cursor-none overflow-x-hidden font-sans selection:bg-blue-500 selection:text-white">
                
                <Cursor />
                
                <style jsx global>{`
                    ::-webkit-scrollbar { display: none; }
                    * { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                
                {/* --- NAVIGATION (UNIFIED) --- */}
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

                {/* --- WORK PAGE CONTENT --- */}
                <Hero />
                <ProjectFeed />
                <TrustedClients />
                <ClientReviews />
                
                {/* --- FOOTER (UNIFIED) --- */}
                <Footer />

            </div>
        </ReactLenis>
    );
}