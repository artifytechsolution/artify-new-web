"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowDown,
  X,
  Menu as MenuIcon,
  Plus,
  Rocket,
} from "lucide-react";
import { ReactLenis } from "@studio-freight/react-lenis";
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
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    position.x.set(middleX * 0.35);
    position.y.set(middleY * 0.35);
  };

  const reset = () => {
    position.x.set(0);
    position.y.set(0);
  };
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
  );
};

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
// 3. TEXT SCROLL REVEAL (MANIFESTO)
// ==========================================
const Word = ({
  children,
  range,
  progress,
}: {
  children: string;
  range: number[];
  progress: MotionValue<number>;
}) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <span className="relative mr-3 mt-3 inline-block">
      <span className="absolute opacity-10">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

const Manifesto = () => {
  const element = useRef(null);
  const { scrollYProgress } = useScroll({
    target: element,
    offset: ["start 0.9", "start 0.25"],
  });

const text = "Smart software for modern business. We specialize in E-commerce, SaaS, and CRM solutions powered by automation. We turn manual workflows into intelligent systems, creating digital experiences that just work.";
const words = text.split(" ");
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-8 md:px-32 bg-[#0a0a0a] text-white">
      <p
        ref={element}
        className="text-[5vw] md:text-[3.5vw] leading-[1.1] font-bold flex flex-wrap max-w-6xl"
      >
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={i} range={[start, end]} progress={scrollYProgress}>
              {word}
            </Word>
          );
        })}
      </p>
    </section>
  );
};

// ==========================================
// 4. HERO SECTION
// ==========================================
const Hero = () => {
  return (
    <section className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source
            src="https://cdn.pixabay.com/video/2023/10/22/186115-877653483_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

     <div className="relative z-10 w-full px-4 md:px-20 mix-blend-screen text-center flex flex-col items-center justify-center">
   
    {/* 3. New Tagline */}
 
       <div className="relative z-10 w-full px-4 md:px-20 mix-blend-screen text-center flex flex-col items-center justify-center">
    {/* 1. Filled White Text */}
    <h1 className="text-[11vw] font-black tracking-tighter leading-[0.85] text-white">
        DIGITAL
    </h1>

    {/* 2. Transparent Outline Text */}
    <h1 className="text-[11vw] font-black tracking-tighter leading-[0.85] text-transparent stroke-text">
        INNOVATION
    </h1>

    {/* 3. Tagline (Unchanged) */}
    <p className="mt-8 md:mt-12 text-lg md:text-2xl text-white/90 font-medium tracking-wide max-w-3xl">
        We deliver smart, scalable solutions for modern businesses.
    </p>
</div>

</div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 2px white;
        }
        @media (max-width: 768px) {
          .stroke-text {
            -webkit-text-stroke: 1px white;
          }
        }
      `}</style>

      <div className="absolute bottom-12 left-0 w-full flex justify-between px-8 md:px-20 text-white uppercase tracking-widest text-xs font-medium">
        <span>Based in SF</span>
        <span className="flex items-center gap-2 animate-bounce">
          Scroll <ArrowDown size={14} />
        </span>
        <span>Est. 2025</span>
      </div>
    </section>
  );
};

// ==========================================
// 5. SELECTED PROJECTS (GRID)
// ==========================================
const SelectedProjects = () => {
  const projects = [
    {
      title: "ATLAS COMMERCE",
      cat: "Ecommerce Website",
      // Image: High-end fashion retail vibe
      img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop",
    },
    {
      title: "NOVA SAAS",
      cat: "SaaS Platform",
      // Image: Tech dashboard/analytics vibe
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    },
    {
      title: "NEXUS CRM",
      cat: "CRM System",
      // Image: Corporate team/management vibe
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
    },
    {
      title: "ZENITH APP",
      cat: "Mobile Application",
      // Image: Sleek mobile phone interface
      img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-32 px-4 md:px-20 bg-[#0a0a0a] relative z-10">
      <div className="flex justify-between items-end mb-24 border-b border-neutral-900 pb-8">
        <div className="flex flex-col">
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-4">
            SELECTED <br /> WORKS
          </h2>
        </div>
        <div className="hidden md:block text-neutral-500 font-mono text-xs uppercase tracking-widest mb-2">
          [ Case Studies 2024-25 ]
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
        {projects.map((p, i) => (
          <div key={i} className="group cursor-pointer flex flex-col gap-6">
            <div className="w-full aspect-[4/3] overflow-hidden bg-neutral-900 relative">
              <motion.img
                src={p.img}
                alt={p.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <ArrowUpRight className="text-black w-5 h-5" />
              </div>
            </div>
            <div className="flex justify-between items-start border-t border-neutral-800 pt-6">
              <div>
                <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-neutral-400 transition-colors">
                  {p.title}
                </h3>
                <p className="text-neutral-500 text-sm">Case Study 0{i + 1}</p>
              </div>
              <span className="px-4 py-1 rounded-full border border-neutral-800 text-neutral-400 text-xs uppercase tracking-widest bg-[#050505]">
                {p.cat}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <Magnetic>
          <button className="text-white border-b border-white pb-1 hover:text-neutral-400 transition-colors uppercase text-sm tracking-widest">
            View Complete Archive
          </button>
        </Magnetic>
      </div>
    </section>
  );
};
// ==========================================
// 6. NEW SECTION: SERVICES (Replaces Archive)
// ==========================================
const ServiceCard = ({ title, subtitle, desc, tags, cta, isAi }: any) => {
  return (
    <div className="group border border-neutral-800 bg-[#0f0f0f] p-8 md:p-12 hover:border-neutral-600 transition-colors duration-500 flex flex-col justify-between min-h-[400px]">
      <div>
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
          {isAi ? (
            <Rocket className="text-blue-500 animate-pulse" />
          ) : (
            <ArrowUpRight className="text-neutral-500 group-hover:text-white transition-colors" />
          )}
        </div>
        <h4 className="text-neutral-400 text-sm uppercase tracking-widest mb-6">
          {subtitle}
        </h4>
        <p className="text-neutral-500 leading-relaxed mb-8">{desc}</p>
      </div>

      <div>
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-mono text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-white text-sm font-bold group-hover:gap-4 transition-all cursor-pointer">
          {cta} <ArrowUpRight size={16} />
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const servicesData = [
    {
      title: "Web Development",
      subtitle: "Modern Web Applications",
      desc: "Full-stack development with React, Next.js, and Node.js. We create scalable, performant web applications with cutting-edge technology.",
      tags: ["React/Next.js", "Full-Stack"],
      cta: "Learn More",
    },
    {
      title: "Mobile Development",
      subtitle: "Cross-Platform Mobile Apps",
      desc: "Native and hybrid mobile applications using React Native and Flutter. Beautiful, responsive apps for iOS and Android platforms.",
      tags: ["React Native", "Flutter", "Cross-Platform"],
      cta: "Learn More",
    },
    {
      title: "UI/UX Design",
      subtitle: "Digital Experience Design",
      desc: "User-centered design with modern aesthetics and seamless interactions. From wireframes to interactive prototypes and design systems.",
      tags: ["Figma Design", "Prototyping"],
      cta: "Learn More",
    },
    {
      title: "DevOps & Cloud",
      subtitle: "Deployment & Infrastructure",
      desc: "Cloud deployment, CI/CD pipelines, and scalable infrastructure management. AWS, Docker, and automated deployment solutions.",
      tags: ["AWS Cloud", "CI/CD Automation"],
      cta: "Learn More",
    },
    {
      title: "Digital Marketing",
      subtitle: "Growth-Driven Marketing Solutions",
      desc: "SEO optimization, PPC campaigns, content marketing, and social media management to boost your brand visibility and conversions.",
      tags: ["SEO/PPC", "Content Marketing", "Analytics"],
      cta: "Explore AI",
      isAi: true,
    },
    {
      title: "AI & ML Automation",
      subtitle: "Intelligent Process Automation",
      desc: "Leverage cutting-edge AI and Machine Learning to automate workflows, gain predictive insights, and transform business efficiency.",
      tags: ["AI/ML", "Process Automation", "Smart Analytics"],
      cta: "Explore AI",
      isAi: true,
    },
  ];

  return (
    <section
      id="services"
      className="py-32 px-4 md:px-20 bg-[#0a0a0a] border-t border-neutral-900"
    >
      <div className="mb-20 max-w-4xl">
        <h2 className="text-sm uppercase tracking-widest text-blue-500 mb-4">
          Artify Tech Solutions
        </h2>
        <h3 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Software Development,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            AI Automation
          </span>{" "}
          & Digital Marketing Excellence.
        </h3>
        <p className="text-neutral-500 mt-8 text-xl max-w-2xl">
          End-to-end digital solutions—development, intelligent automation, and
          growth marketing—beautifully crafted and always cutting-edge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData.map((service, i) => (
          <ServiceCard key={i} {...service} />
        ))}
      </div>
    </section>
  );
};

// ==========================================
// 7. TECHNOLOGY STACK
// ==========================================
const TechItem = ({ title, tags }: { title: string; tags: string[] }) => (
  <div className="group border-t border-neutral-800 py-12 hover:bg-neutral-900/30 transition-colors duration-500">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-0">
      <h3 className="text-3xl md:text-5xl font-bold text-neutral-500 group-hover:text-white transition-colors duration-300 mb-4 md:mb-0">
        {title}
      </h3>
      <div className="flex gap-2 flex-wrap justify-end max-w-md">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full border border-neutral-800 text-neutral-400 text-xs uppercase tracking-wider font-mono bg-[#050505]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const Technology = () => {
  return (
    <section className="py-32 px-8 md:px-32 bg-[#0a0a0a] text-white">
      <div className="mb-20">
        <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
          Technology Stack
        </h2>
        <p className="text-2xl md:text-4xl font-medium max-w-2xl leading-tight">
          We leverage bleeding-edge frameworks to build scalable,
          high-performance digital ecosystems.
        </p>
      </div>
      <div className="flex flex-col">
        <TechItem
          title="Frontend"
          tags={[
            "React",
            "Next.js 15",
            "TypeScript",
            "Tailwind",
            "Framer Motion",
            "WebGL",
          ]}
        />
        <TechItem
          title="Backend"
          tags={[
            "Node.js",
            "Python",
            "Supabase",
            "PostgreSQL",
            "GraphQL",
            "Redis",
          ]}
        />
        <TechItem
          title="AI & Automation"
          tags={[
            "LangChain",
            "OpenAI API",
            "Pinecone",
            "TensorFlow",
            "n8n",
            "AutoGPT",
          ]}
        />
        <TechItem
          title="DevOps"
          tags={[
            "AWS",
            "Docker",
            "Kubernetes",
            "Terraform",
            "Vercel",
            "CI/CD Pipelines",
          ]}
        />
        <TechItem
          title="Creative"
          tags={["Figma", "Blender", "Spline", "After Effects", "Midjourney"]}
        />
      </div>
    </section>
  );
};

// ==========================================
// 8. VELOCITY LOGOS (Infinite Loop)
// ==========================================
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const VelocityLogos = () => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = 3 * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;

    moveBy += moveBy * Math.abs(velocityFactor.get());
    baseX.set(baseX.get() + moveBy * directionFactor.current);
  });

  // Updated Client List
  const logos = [
    "KRAMBICA",
    "FRESHBUCKET",
    "REVOUR HOTELS",
    "ARIHANT STAFFING",
    "FORESTVEDAS",
  ];

  return (
    <div className="w-full overflow-hidden bg-white text-black py-16 border-y border-neutral-200">
      <motion.div className="flex whitespace-nowrap items-center" style={{ x }}>
        {/* Increased repetition to ensure smooth infinite loop with fewer items */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-16 mr-16">
            {logos.map((logo, index) => (
              <div key={index} className="flex items-center gap-16">
                <span className="text-4xl md:text-6xl font-black tracking-tighter text-neutral-800 hover:text-black transition-colors duration-300 cursor-pointer">
                  {logo}
                </span>
                <div className="w-3 h-3 rounded-full bg-black" />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ==========================================
// 9. FAQ ACCORDION
// ==========================================
const FAQItem = ({ question, answer, isOpen, toggle }: any) => {
  return (
    <div className="border-t border-neutral-800">
      <div
        className="py-10 flex justify-between items-center cursor-pointer group"
        onClick={toggle}
      >
        <h3 className="text-2xl md:text-4xl font-medium text-neutral-400 group-hover:text-white transition-colors">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          className="w-8 h-8 md:w-12 md:h-12 border border-neutral-700 rounded-full flex items-center justify-center text-white bg-transparent group-hover:bg-white group-hover:text-black transition-colors"
        >
          <Plus size={20} />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden"
          >
            <p className="text-neutral-500 text-lg md:text-xl pb-10 max-w-3xl leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const questions = [
    {
      q: "What services do you offer?",
      a: "We specialize in end-to-end digital product creation. This includes Brand Strategy, UI/UX Design, Full-Stack Development (Web & Mobile), and 3D Motion Graphics.",
    },
    {
      q: "Do you work with startups?",
      a: "Yes. We partner with ambitious early-stage startups to build their MVP and brand identity, as well as established enterprises looking to modernize their digital infrastructure.",
    },
    {
      q: "What is your typical timeline?",
      a: "Most projects range from 4 to 12 weeks depending on complexity. A simple brand refresh might take 3 weeks, while a full SaaS platform build could take 3-4 months.",
    },
    {
      q: "How do you handle pricing?",
      a: "We work primarily on a project-basis with a fixed fee. For ongoing support and iteration, we offer retainer packages starting at $5k/month.",
    },
    {
      q: "What is your tech stack?",
      a: "We are experts in the React ecosystem (Next.js), typically paired with Tailwind CSS for styling, Framer Motion for animation, and Node.js/Supabase for backend logic.",
    },
  ];

  return (
    <section className="py-32 px-8 md:px-32 bg-[#0a0a0a] text-white">
      <div className="flex flex-col md:flex-row justify-between items-start mb-20">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 md:mb-0">
          FAQ
        </h2>
        <p className="text-neutral-500 max-w-sm text-lg">
          Common questions about our process, pricing, and capabilities.
        </p>
      </div>
      <div>
        {questions.map((item, i) => (
          <FAQItem
            key={i}
            question={`0${i + 1}. ${item.q}`}
            answer={item.a}
            isOpen={openIndex === i}
            toggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
};

// ==========================================
// 10. PROPER FOOTER
// ==========================================
const Footer = () => {
  return (
    <section className="bg-[#0a0a0a] text-white pt-20 pb-12 px-8 md:px-20 border-t border-neutral-900">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center mb-20">
        <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-8">
          Have an idea?
        </h2>
        <h1 className="text-[10vw] font-black tracking-tighter leading-none mb-12">
          LET'S BUILD <br /> THE FUTURE.
        </h1>
        <Magnetic>
          <button className="px-12 py-6 bg-white text-black rounded-full font-bold text-xl hover:scale-110 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Get in Touch
          </button>
        </Magnetic>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end border-t border-neutral-900 pt-12">
        <div className="flex flex-col gap-2 mb-8 md:mb-0">
          <p className="text-neutral-500 text-sm max-w-xs">
            Digital design and engineering studio.
            <br />
            Based in San Francisco, working globally.
          </p>
        </div>

        <div className="flex gap-12 text-sm font-medium">
          <div className="flex flex-col gap-4">
            <span className="text-neutral-500 uppercase tracking-widest text-xs">
              Sitemap
            </span>
            <a href="#" className="hover:text-neutral-400">
              Home
            </a>
            <a href="#" className="hover:text-neutral-400">
              Work
            </a>
            <a href="#" className="hover:text-neutral-400">
              Services
            </a>
            <a href="#" className="hover:text-neutral-400">
              Agency
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-neutral-500 uppercase tracking-widest text-xs">
              Socials
            </span>
            <a href="#" className="hover:text-neutral-400">
              Instagram
            </a>
            <a href="#" className="hover:text-neutral-400">
              Twitter
            </a>
            <a href="#" className="hover:text-neutral-400">
              LinkedIn
            </a>
            <a href="#" className="hover:text-neutral-400">
              Awwwards
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-neutral-900 text-xs text-neutral-600 uppercase tracking-widest">
        <span>© 2025 Artify Tech Solutions.</span>
        <span>All Rights Reserved.</span>
      </div>
    </section>
  );
};

// ==========================================
// MAIN PAGE
// ==========================================
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: true }}>
      <div className="bg-[#0a0a0a] min-h-screen w-full cursor-none overflow-x-hidden selection:bg-white selection:text-black font-sans">
        <Cursor />

        <style jsx global>{`
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* --- NAVIGATION --- */}
        <nav className="fixed top-0 w-full p-8 flex justify-between items-center z-50 text-white mix-blend-difference">
          <Magnetic>
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-4xl tracking-tight text-white leading-none">
                ARTIFY
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-[1px] w-4 bg-white/50"></div>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white">
                  TECH SOLUTION
                </span>
              </div>
            </div>
          </Magnetic>{" "}
          <Magnetic>
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setIsMenuOpen(true)}
            >
              <div className="w-8 h-[2px] bg-white group-hover:w-12 transition-all" />
              <span className="font-bold text-sm tracking-widest">MENU</span>
            </div>
          </Magnetic>
        </nav>

        <SlidingMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

        {/* --- SECTIONS --- */}
        <Hero />
        <Manifesto />
        <SelectedProjects />

        {/* REPLACED ARCHIVE WITH SERVICES */}
        <Services />

        <Technology />
        <VelocityLogos />
        <FAQ />
        <Footer />
      </div>
    </ReactLenis>
  );
}
