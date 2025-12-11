import React, { useRef, useState, useEffect } from 'react';
import { 
  motion, // eslint-disable-line no-unused-vars
  useTransform, 
  useSpring, 
  useMotionValue, 
  useMotionTemplate, 
  AnimatePresence, 
  LayoutGroup,
  Reorder
} from 'framer-motion';
import { 
  ArrowDown, Box, Layers, Ruler, Activity, CheckCircle2, X, 
  Building2, Phone, Mail, ArrowRight, Hammer, Wrench, PenTool, 
  Compass, Zap 
} from 'lucide-react';

// --- Components ---

const NoiseOverlay = () => (
  <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.05] mix-blend-overlay"
       style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
);

// Generate particle data once to avoid impure function calls during render
const DUST_PARTICLES = [...Array(10)].map(() => ({
  x: Math.random() * 100 + "%",
  y: Math.random() * 100 + "%",
  scale: Math.random(),
  duration: 10 + Math.random() * 10,
  delay: Math.random() * 5,
  width: Math.random() * 4 + 2 + "px",
  height: Math.random() * 4 + 2 + "px"
}));

const DustParticles = () => {
  const particles = DUST_PARTICLES;

  return (
    <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-amber-100/20 rounded-full blur-[1px]"
          initial={{ x: p.x, y: p.y, scale: p.scale }}
          animate={{ y: ["-10%", "110%"], opacity: [0, 1, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
          style={{ width: p.width, height: p.height }}
        />
      ))}
    </div>
  );
};

// --- Thunder Effect Component ---
const ThunderOverlay = () => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    // Random lightning loop
    const triggerLightning = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 100); // Quick flash
      
      // Schedule next flash randomly between 2s and 8s
      const nextFlash = Math.random() * 6000 + 2000;
      setTimeout(triggerLightning, nextFlash);
    };
    
    const timeout = setTimeout(triggerLightning, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* Background Flash */}
      <motion.div 
        animate={{ opacity: flash ? 0.3 : 0 }}
        transition={{ duration: 0.1 }}
        className="absolute inset-0 bg-blue-100 mix-blend-overlay z-0 pointer-events-none"
      />
      {/* Ambient Glow */}
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full z-0 pointer-events-none"
      />
    </>
  );
};

// --- Floating Tools Component ---
const FloatingTools = () => {
  const tools = [
    { Icon: Hammer, x: -100, y: -50, rotate: 15, size: 48, delay: 0 },
    { Icon: Wrench, x: 120, y: -80, rotate: -45, size: 40, delay: 1 },
    { Icon: PenTool, x: -80, y: 100, rotate: 30, size: 36, delay: 2 },
    { Icon: Compass, x: 150, y: 80, rotate: 10, size: 56, delay: 0.5 },
    { Icon: Ruler, x: 0, y: -150, rotate: 90, size: 32, delay: 1.5 },
  ];

  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
      {tools.map((tool, i) => (
        <motion.div
          key={i}
          initial={{ x: tool.x, y: tool.y, rotate: tool.rotate, opacity: 0 }}
          whileInView={{ opacity: 0.4 }} // Fade in when page is reached
          animate={{ 
            y: [tool.y, tool.y - 20, tool.y],
            rotate: [tool.rotate, tool.rotate + 10, tool.rotate],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: tool.delay 
          }}
          className="absolute text-blue-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          <tool.Icon size={tool.size} strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
};

// --- Shared Element Transition ---
const StatusBadge = ({ mode }) => {
  let styles = "";
  let text = "";
  let dotColor = "";

  switch (mode) {
    case 'construction':
      styles = "text-amber-400 border-amber-400/30 bg-black/50";
      text = "Site Active";
      dotColor = "bg-amber-500";
      break;
    case 'blueprint':
      styles = "text-blue-400 border-blue-400/30 bg-blue-900/20";
      text = "Blueprint Mode";
      dotColor = "bg-blue-400";
      break;
    case 'realization':
      styles = "text-emerald-400 border-emerald-400/30 bg-emerald-900/20";
      text = "Project Complete";
      dotColor = "bg-emerald-400";
      break;
    case 'contact':
      styles = "text-white border-white/30 bg-white/10";
      text = "Contact Us";
      dotColor = "bg-white";
      break;
    default:
      styles = "text-amber-400 border-amber-400/30 bg-black/50";
  }
  
  return (
    <motion.div 
      layoutId="system-status-badge"
      className={`flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase border px-4 py-2 rounded backdrop-blur-sm transition-colors duration-500 ${styles}`}
    >
      <motion.span 
        layoutId="status-dot"
        className={`w-2 h-2 rounded-full animate-pulse ${dotColor}`}
      />
      <motion.span layoutId="status-text">
        {text}
      </motion.span>
    </motion.div>
  );
};

const SchematicCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      onClick={() => setIsOpen(!isOpen)}
      className="bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:bg-white/10 transition-colors"
      style={{ borderRadius: 20 }}
    >
      <motion.div layout className="p-6 flex items-center justify-between">
        <span className="text-sm font-bold tracking-widest text-white/80">
          SYSTEM SCHEMATICS
        </span>
        <motion.div layout>
          {isOpen ? <X className="w-4 h-4 text-white"/> : <ArrowDown className="w-4 h-4 text-white"/>}
        </motion.div>
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="px-6 pb-6 text-neutral-400 text-sm"
          >
            <p className="mb-4">Analysis complete. Structural integrity at 98%. Render engine initialized.</p>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[80%] bg-blue-500"/>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main Application ---

export const ZoomScrollSection = () => {
  const containerRef = useRef(null);
  const [internalScroll, setInternalScroll] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const [activeMode, setActiveMode] = useState('construction');
  const [items, setItems] = useState([0, 1, 2, 3]);

  // Manual scroll progress (0 to 1)
  const scrollYProgress = useMotionValue(internalScroll);

  // Detect when section reaches the top of viewport to start the experience
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Start when section hits top of viewport
      if (rect.top <= 0 && rect.bottom > 0 && !hasStarted) {
        setHasStarted(true);
        setIsActive(true);
      }
      
      // If scrolling back up before starting, reset
      if (rect.top > 100 && hasStarted && internalScroll === 0) {
        setHasStarted(false);
        setIsActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasStarted, internalScroll]);

  useEffect(() => {
    if (!isActive) return;

    const handleWheel = (e) => {
      e.preventDefault();
      
      setInternalScroll(prev => {
        const delta = e.deltaY * 0.0008; // Adjust sensitivity
        const newScroll = Math.max(0, Math.min(1, prev + delta));
        
        // If we've scrolled to the end, unlock and let page continue
        if (newScroll >= 0.99 && delta > 0) {
          setIsActive(false);
          document.body.style.overflow = '';
          // Scroll the page a bit to move past this section
          setTimeout(() => {
            window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' });
          }, 100);
          return 1;
        }
        
        // If scrolling back at the start, unlock to go to previous section
        if (newScroll <= 0.01 && delta < 0) {
          setIsActive(false);
          setHasStarted(false);
          document.body.style.overflow = '';
          return 0;
        }
        
        return newScroll;
      });
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isActive]);

  // Cleanup overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Sync motion value with state
  useEffect(() => {
    scrollYProgress.set(internalScroll);
  }, [internalScroll, scrollYProgress]);

  // Updated Scroll Logic for 4 Stages
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.25) setActiveMode('construction');
      else if (latest >= 0.25 && latest < 0.55) setActiveMode('blueprint');
      else if (latest >= 0.55 && latest < 0.85) setActiveMode('realization');
      else setActiveMode('contact');
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // --- TRANSFORMS ---
  
  // Scene 1: Construction (0 - 0.3)
  const layer1Scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
  const layer1Blur = useTransform(scrollYProgress, [0.2, 0.3], ["0px", "10px"]);
  const shadowOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

  // Scene 2: Blueprint Reveal (0.2 - 0.6)
  // Transition: Circle Expand
  const clipSize = useTransform(scrollYProgress, [0.2, 0.4], ["0%", "150%"]);
  const maskStyle = useMotionTemplate`circle(${clipSize} at 50% 50%)`;
  const blueprintOpacity = useTransform(scrollYProgress, [0.25, 0.3], [0, 1]);
  
  // Scene 3: Realization Reveal (0.5 - 0.8)
  // Transition: Sliding Up Curtain
  const realizationClip = useTransform(scrollYProgress, [0.5, 0.7], ["100%", "0%"]);
  const realizationMask = useMotionTemplate`inset(${realizationClip} 0% 0% 0%)`; 
  
  // Scene 4: Contact Reveal (0.8 - 1.0)
  const contactOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const contactScale = useTransform(scrollYProgress, [0.85, 1], [0.9, 1]);


  // Parallax Shared
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    mouseX.set((e.clientX / innerWidth - 0.5) * 2);
    mouseY.set((e.clientY / innerHeight - 0.5) * 2);
  };
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const moveForeground = useTransform(smoothX, [-1, 1], ["-2%", "2%"]);

  return (
    <LayoutGroup>
      <div 
        ref={containerRef} 
        className="relative min-h-screen bg-neutral-900 font-sans selection:bg-amber-500 selection:text-black"
        onMouseMove={handleMouseMove}
      >
        <NoiseOverlay />
        
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* =========================================
              SCENE 1: CONSTRUCTION (Base Layer)
             ========================================= */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black">
            <motion.div 
              style={{ scale: layer1Scale, filter: useMotionTemplate`blur(${layer1Blur}) brightness(0.8)`}}
              className="relative w-full h-full"
            >
              <img 
                src="https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=2600&auto=format&fit=crop" 
                alt="Construction Tunnel"
                className="w-full h-full object-cover origin-center"
              />
              <motion.div 
                style={{ opacity: shadowOpacity }}
                className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none"
              />
            </motion.div>

            {/* Title Text */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
              <AnimatePresence>
                {activeMode === 'construction' && (
                  <motion.div
                    key="title-group"
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.h1 
                      className="text-8xl md:text-[12rem] font-bold text-white tracking-tighter mix-blend-overlay uppercase"
                    >
                      Build
                    </motion.h1>
                    <motion.p className="text-amber-500 tracking-[0.5em] text-sm uppercase mt-4 font-mono">
                      Foundation Phase
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <DustParticles />
          </div>


          {/* =========================================
              SCENE 2: BLUEPRINT (Circle Reveal)
             ========================================= */}
          <motion.div 
            style={{ clipPath: maskStyle, backgroundColor: '#0a0a0a', opacity: blueprintOpacity }}
            className="absolute inset-0 z-40 flex items-center justify-center text-white"
          >
            {/* Grid BG */}
            <div className="absolute inset-0 opacity-20"
                 style={{ 
                   backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                   backgroundSize: '40px 40px'
                 }} 
            />
            
            {/* NEW: Thunder & Floating Tools Overlay */}
            <ThunderOverlay />
            
            <div className="relative w-full max-w-7xl p-10 flex flex-col md:flex-row items-center justify-between gap-12 z-10">
              
              <div className="flex-1 space-y-8 text-left relative">
                
                {/* Floating Tools Background for Text */}
                <FloatingTools />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-blue-400 font-mono text-sm tracking-widest uppercase mb-4">
                    <Ruler className="w-4 h-4" />
                    <span>Phase II: Vision</span>
                  </div>
                  
                  {/* Thunderous Title */}
                  <motion.h2 
                    animate={{ 
                       textShadow: ["0 0 0px #3b82f6", "0 0 20px #3b82f6", "0 0 0px #3b82f6"]
                    }}
                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                    className="text-5xl md:text-7xl font-bold leading-tight relative"
                  >
                    Precision <br/>
                    <span className="relative inline-block">
                      <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                        Engineering
                      </span>
                      {/* Electrical Arcs */}
                      <motion.span 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2 }}
                        className="absolute -top-4 -right-8"
                      >
                         <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                      </motion.span>
                    </span>
                  </motion.h2>
                  
                  <p className="text-neutral-400 text-lg max-w-lg leading-relaxed border-l-2 border-neutral-800 pl-6 mt-6 backdrop-blur-sm bg-black/30 p-4 rounded-r-xl">
                    Every beam calculated. Every load distributed. We use digital twins to predict the future before we build it.
                  </p>
                  <div className="pt-4 max-w-sm"><SchematicCard /></div>
                </div>
              </div>

              {/* Reorder List */}
              <motion.div style={{ x: moveForeground }} className="flex-1 relative aspect-square max-w-md">
                 <Reorder.Group axis="y" values={items} onReorder={setItems} className="relative w-full h-full grid grid-cols-2 gap-4">
                    {items.map((item) => (
                       <Reorder.Item key={item} value={item} className="cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden shadow-2xl z-20">
                          {item === 0 && <div className="h-full bg-neutral-800 border border-white/10 flex items-center justify-center"><Box className="text-blue-500 w-10 h-10"/></div>}
                          {item === 1 && <div className="h-full bg-blue-900/20 border border-blue-500/20 flex items-center justify-center"><Layers className="text-blue-400 w-10 h-10"/></div>}
                          {item === 2 && <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" className="h-full w-full object-cover opacity-50"/>}
                          {item === 3 && <div className="h-full bg-amber-900/20 border border-amber-500/20 flex items-center justify-center"><span className="text-2xl font-bold text-amber-500">01</span></div>}
                       </Reorder.Item>
                    ))}
                 </Reorder.Group>
              </motion.div>
            </div>
          </motion.div>


          {/* =========================================
              SCENE 3: REALIZATION (Curtain Reveal)
             ========================================= */}
          <motion.div 
            style={{ clipPath: realizationMask, backgroundColor: '#0f172a' }}
            className="absolute inset-0 z-50 flex items-center justify-center text-white overflow-hidden"
          >
            {/* Background Image of Finished Building */}
            <div className="absolute inset-0 z-0">
               <img 
                 src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2600&auto=format&fit=crop" 
                 alt="Finished Modern Building"
                 className="w-full h-full object-cover opacity-40"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
               <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
                  {[1,2,3,4].map((i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl group cursor-pointer"
                    >
                       <Building2 className="w-8 h-8 text-emerald-400 mb-4 group-hover:text-white transition-colors"/>
                       <h3 className="text-xl font-bold mb-1">Project {i}</h3>
                       <p className="text-xs text-neutral-400 uppercase tracking-widest">Commercial</p>
                    </motion.div>
                  ))}
               </div>
               
               <div className="order-1 md:order-2 space-y-6 text-right">
                  <div className="inline-flex items-center gap-2 text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3"/>
                    <span>Phase III: Execution</span>
                  </div>
                  <h2 className="text-6xl md:text-8xl font-bold">
                    Vision <br/> Realized
                  </h2>
                  <p className="text-xl text-neutral-300 max-w-md ml-auto">
                    From the first sketch to the final glass panel, we deliver iconic structures that define skylines.
                  </p>
                  <button className="text-emerald-400 border-b border-emerald-400 pb-1 hover:text-white hover:border-white transition-colors">
                    View Case Studies
                  </button>
               </div>
            </div>
          </motion.div>


          {/* =========================================
              SCENE 4: CONTACT (Fade Reveal)
             ========================================= */}
          <motion.div 
            style={{ opacity: contactOpacity, scale: contactScale }}
            className="absolute inset-0 z-[60] bg-black flex items-center justify-center text-white"
          >
             <div className="text-center space-y-12 max-w-4xl px-6">
                <h2 className="text-5xl md:text-9xl font-bold tracking-tighter">
                  Let's Build.
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                   <div className="space-y-4 p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors group">
                      <Phone className="w-8 h-8 text-neutral-500 group-hover:text-white"/>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-widest">Call Us</p>
                        <p className="text-xl font-mono mt-1">+1 (555) 000-BUILD</p>
                      </div>
                   </div>
                   
                   <div className="space-y-4 p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors group">
                      <Mail className="w-8 h-8 text-neutral-500 group-hover:text-white"/>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-widest">Email Us</p>
                        <p className="text-xl font-mono mt-1">hello@construct.com</p>
                      </div>
                   </div>

                   <div className="space-y-4 p-8 bg-white text-black rounded-2xl hover:bg-neutral-200 transition-colors cursor-pointer flex flex-col justify-between">
                      <ArrowRight className="w-8 h-8"/>
                      <div>
                        <p className="text-xs opacity-60 uppercase tracking-widest">Start Now</p>
                        <p className="text-xl font-bold mt-1">Request Quote</p>
                      </div>
                   </div>
                </div>

                <p className="text-neutral-600 text-sm">
                  © 2024 Construct Inc. Defining the future of infrastructure.
                </p>
             </div>
          </motion.div>


          {/* === FLOATING SHARED ELEMENT (Always on top) === */}
          <div className="absolute top-10 left-10 md:left-20 z-[70]">
             <StatusBadge mode={activeMode} />
          </div>

        </div>
      </div>
    </LayoutGroup>
  );
}