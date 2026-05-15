/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, MousePointer2, Image as ImageIcon, Layout, FileText, CheckCircle, Mail, Instagram, Star } from 'lucide-react';

// --- Components ---

// 1. Custom Cursor
function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const updateMousePosition = (e: MouseEvent) => {
      // Lerp for smooth movement
      setMousePosition(prev => ({
        x: prev.x + (e.clientX - prev.x) * 0.2,
        y: prev.y + (e.clientY - prev.y) * 0.2
      }));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (window.getComputedStyle(target).cursor === 'pointer' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-accent-primary pointer-events-none z-[100] mix-blend-screen"
      animate={{
        x: mousePosition.x - (isHovering ? 20 : 8),
        y: mousePosition.y - (isHovering ? 20 : 8),
        scale: isHovering ? 2.5 : 1,
        opacity: isHovering ? 0.5 : 1
      }}
      transition={{ type: 'tween', ease: 'linear', duration: 0 }}
      style={{
        boxShadow: isHovering ? '0 0 20px rgba(91,91,255,0.8)' : '0 0 10px rgba(91,91,255,0.5)'
      }}
    />
  );
}

// 2. Animated Pixel Background (floating squares)
function PixelBackground() {
  const pixels = Array.from({ length: 40 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {pixels.map((_, i) => {
        const size = Math.random() > 0.8 ? 4 : 2;
        return (
          <motion.div
            key={i}
            className="absolute bg-accent-primary/20"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
}

// 3. Navbar
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Work', href: '/work' },
    { name: 'Process', href: '/process' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-accent-primary">
              <path d="M20 20 L40 20 L60 60 L60 20 L80 20 L80 80 L60 80 L40 40 L40 80 L20 80 Z" />
              {/* Animated pixels breaking off */}
              <motion.rect x="10" y="25" width="8" height="8" animate={{ x: [-5, 0, -5], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
              <motion.rect x="0" y="45" width="6" height="6" fill="#7B7BFF" animate={{ x: [-8, 0, -8], opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
              <motion.rect x="15" y="65" width="9" height="9" animate={{ x: [-3, 0, -3], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} />
            </svg>
          </div>
          <span className="font-space font-bold text-xl tracking-tight text-text-primary hidden sm:block group-hover:text-accent-primary transition-colors">
            Nexus of Pixel
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {links.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link key={link.name} to={link.href} className={`text-sm hover:text-accent-primary transition-colors ${isActive ? 'text-accent-primary font-bold' : 'text-text-secondary'}`}>
                  {link.name}
                </Link>
              );
            })}
          </div>
          <Link to="/contact" className="bg-accent-primary hover:bg-accent-glow text-white px-5 py-2.5 rounded text-sm font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            Start a Project <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-text-primary" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-bg-primary z-50 flex flex-col p-6"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)} className="text-text-primary p-2">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-8 mt-12 px-4">
              {links.map((link, i) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={link.name}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-3xl font-space font-bold hover:text-accent-primary inline-block ${isActive ? 'text-accent-primary' : 'text-text-primary'}`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-8 bg-accent-primary text-white py-4 rounded font-bold block text-center"
                >
                  Start a Project
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Animated Stat Counter
function AnimatedStat({ text }: { text: string }) {
  const [count, setCount] = useState(1);
  const ref = useRef<HTMLSpanElement>(null);
  
  const numericMatch = text.match(/\d+/);
  const target = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const suffix = text.replace(/\d+/, '');

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime = performance.now();
          const duration = 2000; // 2 seconds
          
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            setCount(Math.max(1, Math.floor(easeProgress * target)));
            
            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} className="font-mono text-text-primary font-bold text-xl">{count}{suffix}</span>;
}

// 4. Hero Section
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden noise-bg">
      <PixelBackground />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        <div className="flex flex-col items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-5xl md:text-7xl font-space font-bold leading-[1.1] mb-6 text-text-primary">
              We Turn Ideas Into <br className="hidden md:block" />
              <span className="text-white">
                Pixel-Perfect Reality
              </span>
            </h1>
            <p className="text-text-secondary text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
              Nexus of Pixel Solutions — where your brand's visual identity is engineered with precision, not guesswork.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-16">
              <Link to="/contact" className="bg-accent-primary hover:bg-accent-glow text-white px-8 py-4 rounded font-medium transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(91,91,255,0.4)]">
                Start a Project
              </Link>
              <Link to="/work" className="border border-border-subtle hover:border-accent-primary hover:text-accent-primary text-text-primary px-8 py-4 rounded font-medium transition-all bg-bg-secondary/50">
                View Our Work
              </Link>
            </div>

            <div className="flex items-center gap-8 md:gap-12 border-t border-border-subtle pt-8 w-full">
              {[
                { label: "Projects Delivered", value: "98+" },
                { label: "Client Satisfaction", value: "100%" },
                { label: "Day Avg. Turnaround", value: "3" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <AnimatedStat text={stat.value} />
                  <span className="text-text-muted text-xs uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hero Right: large pixelated SVG animation representing "PIXEL" */}
        <div className="hidden md:flex justify-center items-center h-[500px] relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* We build a large visually engaging graphic out of simple HTML elements to mimic a pixel breakdown safely */}
            <div className="grid grid-cols-5 gap-2 w-64 h-64 transform -rotate-12">
               {Array.from({length: 25}).map((_, i) => {
                 // Create a shape roughly like an "N" or abstract block
                 const isFilled = [0,5,10,15,20, 1,7,13,19, 4,9,14,19,24].includes(i);
                 return (
                   <motion.div 
                     key={i}
                     className={isFilled ? "bg-accent-primary" : "bg-bg-secondary border border-border-subtle"}
                     animate={{ 
                       opacity: isFilled ? [0.8, 1, 0.8] : [0.1, 0.3, 0.1],
                       scale: isFilled ? [1, 1.05, 1] : 1
                     }}
                     transition={{
                       duration: 2 + (i % 3),
                       repeat: Infinity,
                       repeatType: "reverse",
                       delay: i * 0.05
                     }}
                   />
                 )
               })}
            </div>
            
            {/* Floating foreground pixels */}
            {Array.from({length: 8}).map((_, i) => (
               <motion.div 
                 key={'fg'+i}
                 className="absolute bg-accent-glow w-4 h-4 shadow-[0_0_15px_rgba(123,123,255,0.8)]"
                 style={{ left: `${20 + i*10}%`, top: `${30 + (i%3)*20}%` }}
                 animate={{ 
                   y: [0, -40, 0], 
                   x: [0, i%2 === 0 ? 30 : -30, 0],
                   rotate: [0, 90, 180] 
                 }}
                 transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
               />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}

// 5. Services Section
function Services() {
  const services = [
    {
      title: "Logo Design",
      desc: "Your identity, pixel-perfect. We build scalable vector marks that command attention across every platform.",
      price: "from $149",
      icon: <Layout className="w-8 h-8 text-accent-primary" />
    },
    {
      title: "Social Media Content",
      desc: "Scroll-stopping, brand-consistent templates and single posts designed for engagement.",
      price: "from $99/mo",
      icon: <MousePointer2 className="w-8 h-8 text-accent-primary" />
    },
    {
      title: "Photo Editing",
      desc: "Raw to refined. Color grading, retouching, and composition fixing for a premium aesthetic.",
      price: "from $29/img",
      icon: <ImageIcon className="w-8 h-8 text-accent-primary" />
    },
    {
      title: "Marketing Materials",
      desc: "Print and digital, ready to use. Business cards, pitch decks, and digital ads.",
      price: "from $79",
      icon: <FileText className="w-8 h-8 text-accent-primary" />
    }
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-bg-secondary relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <span className="font-mono text-accent-primary text-sm tracking-wider uppercase mb-4 inline-block">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-space font-bold text-text-primary">
            Visual Solutions.<br />Zero Guesswork.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-tertiary p-8 rounded-xl border border-border-subtle card-hover group relative overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-accent-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-bg-primary flex items-center justify-center rounded-lg border border-border-subtle mb-6 group-hover:border-accent-primary/50 transition-colors group-hover:shadow-[0_0_15px_rgba(91,91,255,0.2)]">
                  {svc.icon}
                </div>
                <h3 className="text-xl font-space font-bold text-text-primary mb-3">{svc.title}</h3>
                <p className="text-text-secondary leading-relaxed mb-6">{svc.desc}</p>
                <div className="font-mono text-text-muted text-sm border-t border-border-subtle pt-4 inline-block">
                  Starting {svc.price}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. Process Section
function Process() {
  const steps = [
    { num: "01", title: "Understand", desc: "We decode your brand's DNA before touching any tool. We gather constraints, goals, and references." },
    { num: "02", title: "Design", desc: "Concepts drafted, refined through your feedback, built right. We iterate rapidly on core ideas." },
    { num: "03", title: "Deliver", desc: "Production-ready files. No confusion about what goes where. Vectors, rasters, and guidelines included." }
  ];

  return (
    <section id="process" className="py-24 md:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
         <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="font-mono text-accent-primary text-sm tracking-wider uppercase mb-4 inline-block">
            Our Process
          </span>
          <h2 className="text-4xl md:text-5xl font-space font-bold text-text-primary">
            From Brief to Brilliant<br/>in 3 Steps
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-0 w-full h-[1px] border-t border-dashed border-border-subtle z-0">
             <motion.div 
               className="h-full border-t border-dashed border-accent-primary" 
               initial={{ width: "0%" }}
               whileInView={{ width: "100%" }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
             />
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {steps.map((step, i) => (
               <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center md:items-start text-center md:text-left"
               >
                 <div className="w-16 h-16 bg-bg-secondary border border-border-subtle rounded-full flex items-center justify-center font-mono font-bold text-xl text-text-muted mb-6 shadow-lg shadow-bg-primary">
                   {step.num}
                 </div>
                 <h3 className="text-2xl font-space font-bold text-text-primary mb-3">
                   {step.title}
                 </h3>
                 <p className="text-text-secondary leading-relaxed max-w-sm">
                   {step.desc}
                 </p>
               </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 7. Why Us
function WhyUs() {
  const reasons = [
    { title: "Pixel-Level Precision", desc: "Spacing, alignment, color balance. We sweat the small stuff so your overall look is flawless." },
    { title: "Platform-Aware", desc: "A logo must work at 32x32px too. We design for every context, screen, and medium." },
    { title: "Fast Iteration", desc: "First draft in 48h. Revise. Lock it in. Move forward. We don't drag projects out." }
  ];

  return (
    <section className="py-24 md:py-32 bg-bg-secondary relative" style={{
      backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="font-mono text-accent-primary text-sm tracking-wider uppercase mb-4 inline-block">
            Why Us
          </span>
          <h2 className="text-4xl md:text-5xl font-space font-bold text-text-primary">
            Pixel-Level Precision<br/>Meets Practical Design
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
             <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border-l-2 border-accent-primary pl-6"
             >
               <h3 className="text-xl font-space font-bold text-text-primary mb-3">
                 {reason.title}
               </h3>
               <p className="text-text-secondary leading-relaxed">
                 {reason.desc}
               </p>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 8. Work
function Work() {
  const projects = [
    { name: "Aura Fintech", tag: "Brand Identity", year: "2024", gradient: "from-blue-900 to-indigo-500" },
    { name: "Verve Energy", tag: "Social Media", year: "2024", gradient: "from-orange-600 to-amber-400" },
    { name: "Nova Studio", tag: "Marketing Prep", year: "2023", gradient: "from-emerald-800 to-teal-400" }
  ];

  return (
    <section id="work" className="py-24 md:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
         <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6"
        >
          <div>
            <span className="font-mono text-accent-primary text-sm tracking-wider uppercase mb-4 inline-block">
              Selected Work
            </span>
            <h2 className="text-4xl md:text-5xl font-space font-bold text-text-primary">
              Designed With Intent
            </h2>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {projects.map((proj, i) => (
             <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-none" // Use custom cursor behavior
             >
               <div className={`w-full aspect-[4/3] rounded-lg mb-6 relative overflow-hidden bg-gradient-to-br ${proj.gradient}`}>
                 <div className="absolute inset-0 bg-bg-primary/20 group-hover:bg-transparent transition-colors duration-500" />
                 
                 {/* Decorative elements representing work */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-overlay">
                   <div className="w-32 h-32 border-4 border-white transform rotate-12 group-hover:rotate-45 transition-transform duration-700 ease-out" />
                   <div className="w-16 h-16 bg-white rounded-full absolute -top-8 -right-8 group-hover:scale-150 transition-transform duration-700" />
                 </div>

                 {/* Hover Overlay CTA */}
                 <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <span className="flex items-center gap-2 font-mono font-bold text-white tracking-widest uppercase">
                     View Project <ArrowRight size={16} className="text-accent-primary" />
                   </span>
                 </div>
               </div>
               
               <div className="flex justify-between items-start">
                 <div>
                   <h3 className="text-xl font-space font-bold text-text-primary mb-1">{proj.name}</h3>
                   <p className="text-sm text-text-secondary">{proj.tag}</p>
                 </div>
                 <span className="font-mono text-text-muted text-sm">{proj.year}</span>
               </div>
             </motion.div>
          ))}
        </div>

        <div className="text-center font-mono text-text-secondary text-sm">
          More work available upon request — <Link to="/contact" className="text-accent-primary hover:text-accent-glow underline underline-offset-4">Start a Conversation →</Link>
        </div>
      </div>
    </section>
  );
}

// 9. Testimonials
function Testimonials() {
  const reviews = [
    { quote: "Working with Nexus felt like having an in-house designer who actually understood what we needed.", name: "Sarah K.", role: "Founder @ BrightStart Co." },
    { quote: "Turnaround was insanely fast and the logo was exactly what I had in my head but couldn't describe.", name: "Marcus T.", role: "Content Creator" }
  ];

  return (
    <section className="py-24 md:py-32 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="font-mono text-accent-primary text-sm tracking-wider uppercase mb-4 inline-block">
            What Clients Say
          </span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((rev, i) => (
             <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-bg-tertiary p-10 rounded-xl border border-border-subtle relative"
             >
               <div className="absolute top-6 left-6 text-accent-primary/20 text-8xl font-space font-bold leading-none select-none">
                 "
               </div>
               <div className="relative z-10">
                 <div className="flex gap-1 mb-6 text-accent-gold">
                   <Star fill="currentColor" size={16} />
                   <Star fill="currentColor" size={16} />
                   <Star fill="currentColor" size={16} />
                   <Star fill="currentColor" size={16} />
                   <Star fill="currentColor" size={16} />
                 </div>
                 <p className="text-xl md:text-2xl font-space text-text-primary leading-relaxed mb-8">
                   {rev.quote}
                 </p>
                 <div className="font-mono">
                   <p className="text-white font-bold mb-1">{rev.name}</p>
                   <p className="text-text-muted text-sm">{rev.role}</p>
                 </div>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 10. Contact
function Contact() {
  const [status, setStatus] = useState<'idle'|'error'|'success'>('idle');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const msg = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    if (!name || !email || !msg) {
      setStatus('error');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    // Simulate API call
    setStatus('success');
    form.reset();
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-bg-primary noise-bg border-t border-border-subtle relative">
      <div className="max-w-3xl mx-auto px-6 md:px-12 w-full relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-space font-bold text-text-primary mb-6">
            Ready to Build Something Worth Looking At?
          </h2>
          <p className="text-text-secondary text-lg">
            Tell us what you need. We'll tell you how we'll make it perfect.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className={`bg-bg-secondary p-8 md:p-10 rounded-2xl border ${status === 'error' ? 'border-red-500/50' : 'border-border-subtle'} ${shake ? 'animate-shake' : ''}`}
        >
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in">
              <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
              <h3 className="text-2xl font-space font-bold text-white mb-2">Message Received</h3>
              <p className="text-text-secondary">We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-mono text-text-muted mb-2">Name *</label>
                  <input name="name" type="text" placeholder="John Doe" className="w-full bg-bg-tertiary border border-border-subtle rounded p-4 text-white focus:outline-none focus:border-accent-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-mono text-text-muted mb-2">Email *</label>
                  <input name="email" type="email" placeholder="john@example.com" className="w-full bg-bg-tertiary border border-border-subtle rounded p-4 text-white focus:outline-none focus:border-accent-primary transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-mono text-text-muted mb-2">Project Type</label>
                <select name="type" className="w-full bg-bg-tertiary border border-border-subtle rounded p-4 text-white focus:outline-none focus:border-accent-primary transition-colors appearance-none cursor-pointer">
                  <option>Logo Design</option>
                  <option>Social Media</option>
                  <option>Photo Editing</option>
                  <option>Marketing</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-mono text-text-muted mb-2">Message *</label>
                <textarea name="message" rows={4} placeholder="Tell us about your project..." className="w-full bg-bg-tertiary border border-border-subtle rounded p-4 text-white focus:outline-none focus:border-accent-primary transition-colors resize-none"></textarea>
              </div>

              {status === 'error' && (
                 <p className="text-red-400 text-sm font-mono">Please fill in all required fields.</p>
              )}

              <button type="submit" className="w-full bg-accent-primary hover:bg-accent-glow text-white py-4 rounded font-bold transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 flex justify-center items-center gap-2">
                Send It <ArrowRight size={18} />
              </button>
            </div>
          )}
        </motion.form>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 font-mono text-sm text-text-secondary">
          <a href="mailto:hello@nexusofpixel.com" className="flex items-center gap-2 hover:text-white transition-colors">
            <Mail size={16} /> hello@nexusofpixel.com
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
            <Instagram size={16} /> @nexusofpixel
          </a>
        </div>
      </div>
    </section>
  );
}

// 11. Footer
function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border-subtle py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="w-6 h-6 fill-accent-primary">
            <path d="M20 20 L40 20 L60 60 L60 20 L80 20 L80 80 L60 80 L40 40 L40 80 L20 80 Z" />
          </svg>
          <span className="font-space font-bold text-white text-lg">N◈P</span>
        </div>

        <div className="flex gap-6">
          {['Services', 'Work', 'Process', 'About'].map((link) => (
            <Link key={link} to={`/${link.toLowerCase()}`} className="text-sm font-mono text-text-muted hover:text-accent-primary transition-colors">
              {link}
            </Link>
          ))}
        </div>

        <div className="text-sm font-mono text-text-muted">
          © 2026 Nexus of Pixel Solutions
        </div>
        
      </div>
      <div className="mt-8 text-center font-mono text-xs text-text-muted/50">
        Crafted pixel by pixel. Built for brands that mean it.
      </div>
    </footer>
  );
}

// 12. FAQ Section Component
function FAQ() {
  const faqs = [
    { q: "What is your typical turnaround time?", a: "For most initial brand identity concepts, we deliver within 48 to 72 hours. Complex web or comprehensive marketing suites may require 1-2 weeks. We believe in fast iteration without compromising quality." },
    { q: "Do you work with international clients?", a: "Yes, our remote-first structure allows us to partner with businesses worldwide. We coordinate across time zones to ensure smooth communication and delivery." },
    { q: "How many revisions are included in a project?", a: "We typically include up to two rounds of major revisions. Our 'Understand' phase is designed to align so closely with your vision that extensive revisions are rarely needed." }
  ];

  return (
    <section className="py-12 md:py-24 bg-bg-secondary">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="font-mono text-accent-primary text-sm tracking-wider uppercase mb-4 inline-block">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-space font-bold text-text-primary">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-tertiary p-8 rounded-xl border border-border-subtle"
            >
              <h3 className="text-xl font-space font-bold text-text-primary mb-4">{faq.q}</h3>
              <p className="text-text-secondary leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 13. About Page Components
function AboutUs() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-primary">
      {/* Bio Section */}
      <section className="py-12 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <span className="font-mono text-accent-primary text-sm tracking-wider uppercase mb-4 inline-block">
              About Us
            </span>
            <h1 className="text-4xl md:text-6xl font-space font-bold text-text-primary mb-8 leading-tight">
              Precision By Design.
            </h1>
            <p className="text-text-secondary text-lg md:text-xl leading-relaxed text-left md:text-center">
              We are a boutique digital design studio built on the belief that precision is paramount. In an industry crowded with templates and shortcuts, we take the path of intention. Every pixel, every color choice, and every font serves a strategic purpose. We partner with visionaries to translate their ideas into refined, scalable identities. No fluff, no guesswork. Just rigorous design crafted for serious brands.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// --- Main App Entry ---
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <main className="w-full relative selection:bg-accent-primary/30 selection:text-white">
        <CustomCursor />
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <WhyUs />
              <Testimonials />
              <FAQ />
            </>
          } />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<div className="pt-24 min-h-screen"><Services /></div>} />
          <Route path="/work" element={<div className="pt-24 min-h-screen"><Work /></div>} />
          <Route path="/process" element={<div className="pt-24 min-h-screen"><Process /></div>} />
          <Route path="/contact" element={<div className="pt-24 min-h-screen"><Contact /></div>} />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
}

