import React, { useState, useEffect, useRef } from 'react';
import { ZoomScrollSection } from './ZoomScrollSection';
import { 
  motion, // eslint-disable-line no-unused-vars 
  // useScroll, 
  // useTransform, 
  // useSpring, 
  // useMotionValue, 
  // useMotionTemplate,
  AnimatePresence, 
  LayoutGroup,
  Reorder
} from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Hammer, 
  PaintBucket, 
  CheckCircle, 
  ArrowRight, 
  Menu, 
  X,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUpRight,
  Briefcase,
  LayoutGrid,
  Zap,
  Layers,
  ArrowDown, 
  Box, 
  Ruler, 
  CheckCircle2, 
  Building2, 
  Mail, 
  Wrench, 
  PenTool, 
  Compass
} from 'lucide-react';

// --- UTILS ---
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);
    
    // Copy ref.current to a variable to ensure cleanup runs correctly
    const currentElement = ref.current;
    if (currentElement) observer.observe(currentElement);
    
    return () => { 
      if (currentElement) observer.unobserve(currentElement); 
    };
  }, [options]);
  
  return [ref, isVisible];
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const MagneticButton = ({ children, className = "" }) => (
  <button className={`group relative overflow-hidden transition-all duration-300 active:scale-95 ${className} hover-target`}>
    <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
  </button>
);

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  useEffect(() => {
    const updatePosition = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => setIsHovering(!!e.target.closest('a, button, .cursor-pointer, .hover-target'));
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
  return (
    <>
      <style>{`
        .custom-cursor { position: fixed; top: 0; left: 0; width: 20px; height: 20px; border: 1px solid #f97316; border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); transition: width 0.3s, height 0.3s, background-color 0.3s, transform 0.1s; mix-blend-mode: difference; }
        .custom-cursor.hovered { width: 50px; height: 50px; background-color: rgba(249, 115, 22, 0.2); border-color: transparent; }
        @media (pointer: coarse) { .custom-cursor { display: none; } }
        /* GLOBAL SCROLL FIX */
        html, body { overflow-x: hidden; width: 100%; max-width: 100%; }
      `}</style>
      <div className={`custom-cursor ${isHovering ? 'hovered' : ''}`} style={{ left: `${position.x}px`, top: `${position.y}px` }} />
    </>
  );
};

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsFinished(true), 500);
          setTimeout(onComplete, 1500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [onComplete]);
  return (
    <div className={`fixed inset-0 z-[100] flex flex-col justify-between p-6 md:p-10 bg-[#111] text-white transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${isFinished ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div><span className="font-mono text-xs uppercase tracking-widest text-slate-400">Loading Resources</span></div>
        <div className="font-mono text-xs text-slate-500">THE URBAN PROJECT & INTERIORS v2.0</div>
      </div>
      <div className="flex items-end justify-between">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none font-mono">{count}%</h1>
        <div className="hidden md:block w-64 h-[1px] bg-slate-800 mb-8 relative overflow-hidden"><div className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-100 ease-out" style={{ width: `${count}%` }}></div></div>
      </div>
    </div>
  );
};



// const ZoomScrollSection = () => {
//   const containerRef = useRef(null);
//   const [activeMode, setActiveMode] = useState('construction');
//   const [items, setItems] = useState([0, 1, 2, 3]);
//   const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

//   // Updated Scroll Logic for 4 Stages
//   useEffect(() => {
//     const unsubscribe = scrollYProgress.on("change", (latest) => {
//       if (latest < 0.25) setActiveMode('construction');
//       else if (latest >= 0.25 && latest < 0.55) setActiveMode('blueprint');
//       else if (latest >= 0.55 && latest < 0.85) setActiveMode('realization');
//       else setActiveMode('contact');
//     });
//     return () => unsubscribe();
//   }, [scrollYProgress]);

//   // Scene 1: Construction (0 - 0.3)
//   const layer1Scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
//   const layer1Opacity = useTransform(scrollYProgress, [0.15, 0.3], [1, 0]);
//   const layer1Blur = useMotionTemplate`blur(${useTransform(scrollYProgress, [0.2, 0.3], ["0px", "10px"])}) brightness(0.8)`;
//   const shadowOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

//   // Scene 2: Blueprint Reveal (0.2 - 0.6) - Circle Expand
//   const clipSize = useTransform(scrollYProgress, [0.25, 0.45], ["0%", "150%"]);
//   const maskStyle = useMotionTemplate`circle(${clipSize} at 50% 50%)`;
  
//   // Scene 3: Realization Reveal (0.5 - 0.8) - Sliding Up Curtain
//   const realizationClip = useTransform(scrollYProgress, [0.5, 0.7], ["100%", "0%"]);
//   const realizationMask = useMotionTemplate`inset(${realizationClip} 0% 0% 0%)`; 
  
//   // Scene 4: Contact Reveal (0.8 - 1.0)
//   const contactOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
//   const contactScale = useTransform(scrollYProgress, [0.85, 1], [0.9, 1]);

//   // Parallax Shared
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);
//   const handleMouseMove = (e) => {
//     const { innerWidth, innerHeight } = window;
//     mouseX.set((e.clientX / innerWidth - 0.5) * 2);
//     mouseY.set((e.clientY / innerHeight - 0.5) * 2);
//   };
//   const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
//   const moveForeground = useTransform(smoothX, [-1, 1], ["-2%", "2%"]);

//   return (
//     <LayoutGroup>
//       <div ref={containerRef} className="relative h-[500vh] bg-neutral-900 font-sans selection:bg-orange-500 selection:text-black w-full overflow-hidden" onMouseMove={handleMouseMove}>
//         <NoiseOverlay />
//         <div className="sticky top-0 h-dvh w-full">
          
//           {/* SCENE 1: CONSTRUCTION ZOOM */}
//           <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black">
//             <motion.div 
//               style={{ 
//                 scale: layer1Scale, 
//                 opacity: layer1Opacity, 
//                 filter: layer1Blur
//               }} 
//               className="relative w-full h-full origin-center"
//             >
//               <img src="https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=2600&auto=format&fit=crop" alt="Construction" className="w-full h-full object-cover origin-center" />
//               <motion.div style={{ opacity: shadowOpacity }} className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
//             </motion.div>
            
//             <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
//               <AnimatePresence>
//                 {activeMode === 'construction' && (
//                   <motion.div key="title-group" exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }} transition={{ duration: 0.5 }} className="text-center px-4">
//                     <motion.h1 className="text-6xl md:text-[10rem] font-bold text-white tracking-tighter mix-blend-overlay uppercase leading-none">ODIA<br/>BUILD</motion.h1>
//                     <motion.p className="text-orange-500 tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-sm uppercase mt-4 font-mono">Zoom to Enter</motion.p>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//             <DustParticles />
//           </div>

//           {/* SCENE 2: BLUEPRINT (Circle Reveal with Shadow) */}
//           <motion.div 
//             style={{ 
//               clipPath: maskStyle,
//               backgroundColor: '#0a0a0a'
//             }} 
//             className="absolute inset-0 z-40 flex items-center justify-center text-white w-full h-full overflow-hidden"
//           >
//             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
//             <ThunderOverlay />
//             <div className="relative w-full max-w-7xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 z-10">
//               <div className="flex-1 space-y-6 md:space-y-8 text-left relative w-full">
//                 <FloatingTools />
//                 <div className="relative z-10">
//                   <div className="flex items-center gap-3 text-blue-400 font-mono text-sm tracking-widest uppercase mb-4"><Ruler className="w-4 h-4" /><span>Phase II: Vision</span></div>
//                   <motion.h2 animate={{ textShadow: ["0 0 0px #3b82f6", "0 0 20px #3b82f6", "0 0 0px #3b82f6"] }} transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }} className="text-4xl md:text-7xl font-bold leading-tight relative">
//                     Precision <br/> <span className="relative inline-block"><span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Engineering</span><motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2 }} className="absolute -top-4 -right-8"><Zap className="w-8 h-8 text-yellow-300 fill-yellow-300" /></motion.span></span>
//                   </motion.h2>
//                   <p className="text-neutral-400 text-base md:text-lg max-w-lg leading-relaxed border-l-2 border-neutral-800 pl-6 mt-6 backdrop-blur-sm bg-black/30 p-4 rounded-r-xl">Detailed structural layouts and municipal approval support in Bhubaneswar and Jatni.</p>
//                   <div className="pt-4 max-w-sm"><SchematicCard /></div>
//                 </div>
//               </div>
//               <motion.div style={{ x: moveForeground }} className="flex-1 relative aspect-square max-w-md hidden md:block">
//                  <Reorder.Group axis="y" values={items} onReorder={setItems} className="relative w-full h-full grid grid-cols-2 gap-4">
//                     {items.map((item) => (
//                        <Reorder.Item key={item} value={item} className="cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden shadow-2xl z-20">
//                           {item === 0 && <div className="h-full bg-neutral-800 border border-white/10 flex items-center justify-center"><Box className="text-blue-500 w-10 h-10"/></div>}
//                           {item === 1 && <div className="h-full bg-blue-900/20 border border-blue-500/20 flex items-center justify-center"><Layers className="text-blue-400 w-10 h-10"/></div>}
//                           {item === 2 && <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" className="h-full w-full object-cover opacity-50"/>}
//                           {item === 3 && <div className="h-full bg-orange-900/20 border border-orange-500/20 flex items-center justify-center"><span className="text-2xl font-bold text-orange-500">01</span></div>}
//                        </Reorder.Item>
//                     ))}
//                  </Reorder.Group>
//               </motion.div>
//             </div>
//           </motion.div>

//           {/* SCENE 3: REALIZATION */}
//           <motion.div style={{ clipPath: realizationMask, backgroundColor: '#0f172a' }} className="absolute inset-0 z-50 flex items-center justify-center text-white overflow-hidden">
//             <div className="absolute inset-0 z-0">
//                <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2600&auto=format&fit=crop" alt="Finished" className="w-full h-full object-cover opacity-40" />
//                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent" />
//             </div>
//             <div className="relative z-10 w-full max-w-7xl px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
//                <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
//                  {[1,2,3,4].map((i) => (
//                    <motion.div key={i} whileHover={{ scale: 1.05, y: -5 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-2xl group cursor-pointer hover:border-orange-500/50">
//                       <Building2 className="w-6 h-6 md:w-8 md:h-8 text-orange-500 mb-4 group-hover:text-white transition-colors"/>
//                       <h3 className="text-lg md:text-xl font-bold mb-1">Project {i}</h3>
//                       <p className="text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest">Odisha</p>
//                    </motion.div>
//                  ))}
//                </div>
//                <div className="order-1 md:order-2 space-y-6 text-right">
//                   <div className="inline-flex items-center gap-2 text-orange-400 border border-orange-400/30 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest"><CheckCircle2 className="w-3 h-3"/><span>Phase III: Delivery</span></div>
//                   <h2 className="text-5xl md:text-8xl font-bold">Vision <br/> <span className="text-orange-500">Realized</span></h2>
//                   <p className="text-lg md:text-xl text-neutral-300 max-w-md ml-auto">From the first sketch to the final glass panel, we deliver iconic structures.</p>
//                   <button className="text-orange-400 border-b border-orange-400 pb-1 hover:text-white hover:border-white transition-colors">View Case Studies</button>
//                </div>
//             </div>
//           </motion.div>

//           {/* SCENE 4: CONTACT */}
//           <motion.div style={{ opacity: contactOpacity, scale: contactScale }} className="absolute inset-0 z-[60] bg-black flex items-center justify-center text-white">
//              <div className="text-center space-y-8 md:space-y-12 max-w-4xl px-6">
//                 <h2 className="text-5xl md:text-9xl font-bold tracking-tighter">Let's Build.</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-left">
//                    <div className="space-y-4 p-6 md:p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors group">
//                       <Phone className="w-8 h-8 text-neutral-500 group-hover:text-white"/>
//                       <div><p className="text-xs text-neutral-500 uppercase tracking-widest">Call Us</p><p className="text-lg md:text-xl font-mono mt-1">+91 98765 43210</p></div>
//                    </div>
//                    <div className="space-y-4 p-6 md:p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors group">
//                       <MapPin className="w-8 h-8 text-neutral-500 group-hover:text-white"/>
//                       <div><p className="text-xs text-neutral-500 uppercase tracking-widest">Visit HQ</p><p className="text-xs md:text-sm font-mono mt-1">District Center,<br/>Bhubaneswar</p></div>
//                    </div>
//                    <div className="space-y-4 p-6 md:p-8 bg-orange-600 text-white rounded-2xl hover:bg-orange-500 transition-colors cursor-pointer flex flex-col justify-between">
//                       <ArrowRight className="w-8 h-8"/>
//                       <div><p className="text-xs opacity-80 uppercase tracking-widest">Start Now</p><p className="text-lg md:text-xl font-bold mt-1">Get Quote</p></div>
//                    </div>
//                 </div>
//                 <p className="text-neutral-600 text-xs md:text-sm">© 2024 OdiaBuild. Defining the future of Odisha's infrastructure.</p>
//              </div>
//           </motion.div>

//           {/* FLOATING STATUS */}
//           <div className="absolute top-20 left-4 md:top-10 md:left-10 z-[70]">
//              <StatusBadge mode={activeMode} />
//           </div>
//         </div>
//       </div>
//     </LayoutGroup>
//   );
// };

// --- MAIN APP COMPONENT ---
const ThreeDCarousel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const projects = [
    { title: "Royal Villa Patia", category: "Luxury Residential", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&h=800&fit=crop", desc: "A 5000 sqft masterpiece combining traditional Odia stone cladding with modern glass facades." },
    { title: "Hotel Golden Sands", category: "Commercial Hospitality", image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600&h=800&fit=crop", desc: "Sea-facing luxury hotel in Puri with 40 rooms, designed for maximum occupancy and comfort." },
    { title: "Jatni Market Complex", category: "Commercial Hub", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&h=800&fit=crop", desc: "Modern shopping complex with earthquake-resistant structure and high-traffic retail spaces." },
    { title: "Zen Interior Duplex", category: "Interior Design", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&h=800&fit=crop", desc: "Minimalist interior project in Khandagiri featuring automated lighting and Italian marble." },
    { title: "Smart Office Hub", category: "Corporate", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&h=800&fit=crop", desc: "Tech-enabled office space in Infocity with ergonomic design and sustainable materials." }
  ];

  const len = projects.length;
  const theta = 360 / len;
  const radius = 320; 
  const activeIndex = ((Math.round(selectedIndex) % len) + len) % len;

  const nextSlide = () => setSelectedIndex((prev) => prev + 1);
  const prevSlide = () => setSelectedIndex((prev) => prev - 1);

  useEffect(() => {
    if (isPaused || isDragging) return;
    const interval = setInterval(nextSlide, 3000); 
    return () => clearInterval(interval);
  }, [isPaused, isDragging]);

  const handleMouseDown = (e) => { setIsDragging(true); setStartX(e.clientX); setIsPaused(true); };
  const handleMouseMove = (e) => { if (!isDragging) return; setDragOffset(e.clientX - startX); };
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const slideThreshold = 100; 
    const slidesMoved = -dragOffset / slideThreshold; 
    setSelectedIndex(Math.round(selectedIndex + slidesMoved));
    setDragOffset(0);
  };
  const handleMouseLeave = () => { if (isDragging) handleMouseUp(); setIsPaused(false); };

  const currentRotation = -(selectedIndex * theta) + (dragOffset * (theta / 100));

  return (
    <div 
      className="relative h-[800px] w-full flex flex-col items-center justify-center overflow-hidden bg-slate-50 cursor-grab active:cursor-grabbing select-none hover-target"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="text-center mb-16 relative z-20 pointer-events-none">
         <div className="h-8 overflow-hidden mb-2">
            <div className="transition-transform duration-500 ease-out" style={{ transform: `translateY(-${activeIndex * 32}px)` }}>
              {projects.map((p, i) => (
                <div key={i} className="h-8 text-orange-600 font-bold uppercase tracking-widest text-sm flex items-center justify-center">{p.category}</div>
              ))}
            </div>
         </div>
         <div className="h-16 overflow-hidden">
            <div className="transition-transform duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)" style={{ transform: `translateY(-${activeIndex * 64}px)` }}>
               {projects.map((p, i) => (
                 <div key={i} className="h-16 text-4xl md:text-5xl font-bold text-slate-900 flex items-center justify-center">{p.title}</div>
               ))}
            </div>
         </div>
         <div className="h-12 overflow-hidden mt-4 max-w-lg mx-auto">
            <div className="transition-transform duration-500 ease-out delay-100" style={{ transform: `translateY(-${activeIndex * 48}px)` }}>
               {projects.map((p, i) => (
                 <div key={i} className="h-12 text-slate-500 text-sm md:text-base flex items-center justify-center">{p.desc}</div>
               ))}
            </div>
         </div>
      </div>
      
      {/* 3D Container - Made Responsive */}
      <div className="relative w-full max-w-[90vw] md:max-w-4xl h-[450px] z-10 flex justify-center perspective-container" style={{ perspective: '1200px' }}>
        <div className={`w-[260px] md:w-[300px] h-[350px] md:h-[400px] relative transition-transform ease-[cubic-bezier(0.25,1,0.5,1)] ${isDragging ? 'duration-0' : 'duration-700'}`} style={{ transform: `translateZ(-${radius}px) rotateY(${currentRotation}deg)`, transformStyle: 'preserve-3d' }}>
          {projects.map((project, index) => {
            const angle = index * theta;
            const isActive = activeIndex === index;
            return (
              <div key={index} className={`absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-white shadow-2xl border-4 border-white transition-all duration-500`} style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)`, backfaceVisibility: 'hidden' }}>
                <img src={project.image} alt={project.title} className="w-full h-full object-cover pointer-events-none" />
                <div className="absolute inset-0 bg-black/60 transition-opacity duration-500" style={{ opacity: isActive ? 0 : 0.6 }}></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-4 mt-8 z-20">
         <button onClick={prevSlide} className="w-14 h-14 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors shadow-lg active:scale-95 z-30 hover-target">←</button>
         <button onClick={nextSlide} className="w-14 h-14 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors shadow-lg active:scale-95 z-30 hover-target">→</button>
      </div>
    </div>
  );
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);

  // Hero Strip Images
  const heroImages = [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&h=400&fit=crop"
  ];

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-slate-900 selection:bg-orange-500 selection:text-white w-full">
      
      <Preloader onComplete={() => setIsLoading(false)} />
      <CustomCursor />

      {/* --- INLINE STYLES --- */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-6 left-0 right-0 z-50 transition-all duration-500 flex justify-center px-4 ${isLoading ? 'opacity-0' : 'opacity-100 delay-1000'}`}>
        <div className={`
          relative flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500
          ${scrolled ? 'w-full max-w-5xl bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/10' : 'w-full max-w-7xl bg-transparent'}
        `}>
            
            <div className="flex items-center gap-3 hover-target cursor-pointer">
              <div className={`p-2 rounded-full transition-colors ${scrolled ? 'bg-orange-500' : 'bg-slate-900'}`}>
                {/* <Hammer className="w-5 h-5 text-white" /> */}
                <img src='/urban_logo.png' className="w-6 h-6 text-white" />

              </div>
              <div className={`flex flex-col ${scrolled ? 'text-white' : 'text-slate-900'}`}>
                <span className="font-bold leading-none tracking-tight">The Urban Project & Interior</span>
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Bhubaneswar</span>
              </div>
            </div>

            <div className={`hidden md:flex items-center gap-1 p-1 rounded-full ${scrolled ? 'bg-white/10 border border-white/5' : 'bg-white border border-slate-200 shadow-sm'}`}>
              {[{ name: 'Home', href: '#home' }, { name: 'Expertise', href: '#services' }, { name: 'Work', href: '#portfolio' }].map((link) => (
                <a key={link.name} href={link.href} className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 hover-target ${scrolled ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'}`}>
                  {link.name}
                </a>
              ))}
            </div>

            <div className="hidden md:block">
              <button className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 hover-target ${scrolled ? 'bg-white text-slate-900' : 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'}`}>
                Start Project <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button className={`md:hidden p-2 rounded-full hover-target ${scrolled ? 'text-white bg-white/10' : 'text-slate-900 bg-white shadow-sm'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header id="home" className="relative pt-32 md:pt-40 pb-20 px-6 min-h-screen flex flex-col justify-center overflow-hidden">
        {/* FIXED: Wrapped background blobs in overflow-hidden div */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-200/60 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-sm font-bold tracking-widest uppercase text-slate-500">Available in Jatni & Bhubaneswar</span>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold text-slate-900 leading-[0.9] tracking-tight mb-8">
              Build <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 italic pr-4">Better</span>
              Living.
            </h1>
          </FadeIn>

          <FadeIn delay={200} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-12 border-t border-slate-200 pt-8 md:pt-12 mt-8 md:mt-12">
            <p className="max-w-xl text-lg md:text-xl text-slate-600 leading-relaxed font-light">
              We combine <strong className="text-slate-900 font-semibold">Odisha's cultural heritage</strong> with modern architectural precision. 
              A seamless journey from land breaking to interior finishing.
            </p>
            
            <div className="flex gap-4">
              <MagneticButton className="bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-orange-500/20">
                View Portfolio <ArrowUpRight className="w-5 h-5" />
              </MagneticButton>
              <div className="flex -space-x-4">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 overflow-hidden hover-target">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Client" className="w-full h-full object-cover"/>
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700">50+</div>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={400} className="mt-20 -mx-6 md:-mx-20 overflow-hidden relative">
          <div className="flex gap-6 animate-scroll whitespace-nowrap px-6 w-max">
             {[...heroImages, ...heroImages].map((src, i) => (
               <div key={i} className="min-w-[260px] md:min-w-[500px] h-[300px] md:h-[400px] rounded-3xl overflow-hidden relative group hover-target cursor-none">
                 <img src={src} alt={`Project ${i}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-110"/>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               </div>
             ))}
          </div>
        </FadeIn>
      </header>

      {/* --- BENTO GRID SECTION --- */}
      <section className="py-12 md:py-24 px-6 bg-white overflow-hidden">
        <div className="container mx-auto max-w-7xl">
           <div className="mb-16">
             <span className="text-orange-600 font-bold uppercase tracking-widest text-xs border border-orange-200 px-3 py-1 rounded-full bg-orange-50">Our Advantage</span>
             <h2 className="text-4xl md:text-5xl font-bold mt-6 text-slate-900">Why Odisha Builds With Us</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-6 h-auto md:h-[600px]">
              <FadeIn className="md:col-span-2 md:row-span-2 rounded-[2.5rem] bg-slate-950 p-8 md:p-10 relative overflow-hidden group hover-target min-h-[400px]">
                 <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                   <LayoutGrid size={120} className="text-white" />
                 </div>
                 <div className="relative z-10 h-full flex flex-col justify-between">
                   <div>
                     <div className="bg-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl shadow-orange-900/50"><Zap size={28} /></div>
                     <h3 className="text-3xl text-white font-bold mb-4">Complete Turnkey Solutions</h3>
                     <p className="text-slate-400 text-lg leading-relaxed">Stop juggling contractors. We handle excavation, construction, plumbing, electrical, and interior styling.</p>
                   </div>
                   <button className="self-start text-white border-b border-orange-500 pb-1 hover:text-orange-500 transition-colors mt-6 md:mt-0">Read our process</button>
                 </div>
              </FadeIn>

              <FadeIn delay={100} className="md:col-span-2 bg-orange-50 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 group hover:bg-orange-100 transition-colors duration-500 hover-target">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform duration-500">🤝</div>
                 <div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-2">100% Odia Communication</h3>
                   <p className="text-slate-600">No language barriers. We explain technical details in Odia, making sure you understand every rupee spent.</p>
                 </div>
              </FadeIn>

              <FadeIn delay={200} className="md:col-span-1 bg-slate-100 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:bg-slate-200 transition-colors duration-500 hover-target min-h-[200px]">
                 <MapPin className="text-slate-900 w-10 h-10 mb-4" />
                 <div><h3 className="text-xl font-bold mb-1">Jatni Office</h3><p className="text-sm text-slate-500">Main Market Road</p></div>
              </FadeIn>

              <FadeIn delay={300} className="md:col-span-1 bg-slate-100 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:bg-slate-200 transition-colors duration-500 hover-target min-h-[200px]">
                 <Briefcase className="text-slate-900 w-10 h-10 mb-4" />
                 <div><h3 className="text-xl font-bold mb-1">BBS HQ</h3><p className="text-sm text-slate-500">Chandrasekharpur</p></div>
              </FadeIn>
           </div>
        </div>
      </section>

      {/* --- STICKY SCROLL SERVICES --- */}
      <section id="services" className="bg-[#111] py-12 md:py-32 text-white selection:bg-orange-500 selection:text-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row gap-12 md:gap-20">
            <div className="lg:w-1/2 lg:sticky lg:top-32 h-fit">
               <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-4 block">Our Expertise</span>
               <h2 className="text-4xl md:text-6xl font-bold mb-12">Mastery in <br/> Every Detail.</h2>
               <div className="flex flex-col gap-6">
                 {[
                   { title: "Residential Construction", desc: "Duplexes and apartments built with earthquake-resistant tech." },
                   { title: "Luxury Interiors", desc: "Modular kitchens and false ceilings inspired by global trends." },
                   { title: "Commercial Projects", desc: "Hotels and guest houses designed for maximum occupancy." }
                 ].map((service, index) => (
                   <div key={index} className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 hover-target ${activeService === index ? 'bg-white/10 border-l-4 border-orange-500' : 'hover:bg-white/5 border-l-4 border-transparent'}`} onMouseEnter={() => setActiveService(index)}>
                     <h3 className={`text-xl font-bold mb-2 ${activeService === index ? 'text-white' : 'text-slate-400'}`}>{service.title}</h3>
                     <p className={`text-sm leading-relaxed ${activeService === index ? 'text-slate-300' : 'text-slate-500'}`}>{service.desc}</p>
                   </div>
                 ))}
               </div>
            </div>
            <div className="lg:w-1/2 h-[400px] md:h-[600px] relative rounded-[3rem] overflow-hidden border border-white/10 hover-target">
               {[
                 "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&fit=crop",
                 "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&fit=crop",
                 "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&fit=crop"
               ].map((src, index) => (
                 <img key={index} src={src} alt="Service" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${activeService === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}/>
               ))}
               <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                  <div className="flex justify-between items-center">
                    <div><p className="text-xs text-slate-300 uppercase tracking-wider mb-1">Project Highlight</p><p className="font-bold text-lg">Patia Royal Villa • 2024</p></div>
                    <div className="bg-white text-black p-3 rounded-full"><ArrowUpRight size={20}/></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW: ZOOM SCROLL EXPERIENCE --- */}
      {/* <ZoomScrollSection /> */}
      <ZoomScrollSection />

      {/* --- 3D CAROUSEL PORTFOLIO --- */}
      <section id="portfolio" className="py-12 md:py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-12 text-center">
              <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">Selected Works</span>
              <h2 className="text-4xl font-bold mt-2 text-slate-900">Project Spotlight</h2>
              <p className="text-slate-500 mt-4 max-w-2xl">Spin through our recent completions across Odisha.</p>
          </div>
          <ThreeDCarousel />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="contact" className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-24 text-center relative overflow-hidden group hover-target">
             <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
             <h2 className="text-3xl md:text-7xl font-bold text-white mb-8 relative z-10">Let's build your <br/> legacy together.</h2>
             <p className="text-slate-400 text-lg md:text-xl mb-12 relative z-10">Coffee is on us at our Jatni or Bhubaneswar office.</p>
             <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
               <button className="bg-orange-500 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-orange-600 transition-colors shadow-xl shadow-orange-500/30 hover-target">Schedule Site Visit</button>
               <button className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-full text-lg font-bold hover:bg-white/20 transition-colors backdrop-blur-md hover-target">+91 98765 43210</button>
             </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mt-12 text-sm text-slate-500">
            <p>© 2024 OdiaBuild. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-slate-900 hover-target">Instagram</a>
               <a href="#" className="hover:text-slate-900 hover-target">LinkedIn</a>
               <a href="#" className="hover:text-slate-900 hover-target">Facebook</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;