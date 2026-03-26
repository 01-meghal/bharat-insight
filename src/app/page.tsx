"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BrainCircuit, Globe2, Activity, Database } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col relative overflow-hidden font-sans">
      
      {/* Neo-brutalist / Modern Grid Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 py-6 relative z-10 flex-1 flex flex-col pt-8">
        
        {/* Navigation */}
        <header className="flex justify-between items-center py-4 mb-8 md:mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">Bharat-<span className="text-blue-400">Insight</span></span>
          </div>
          <nav>
            <Link href="/dashboard">
              <button className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md">
                Enter App
              </button>
            </Link>
          </nav>
        </header>

        {/* Dynamic Hero Section */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-16 pb-20">
          
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 space-y-8 max-w-2xl relative z-10">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 uppercase tracking-widest backdrop-blur-md">
              <Globe2 className="w-3.5 h-3.5" /> Analytics Platform
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1]">
              Next-Gen <br /> Data Intelligence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-cyan-300 to-emerald-400">
                For India
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
              Transforming scattered public department statistics into centralized, beautiful, and AI-driven interactive dashboards.
            </motion.p>
            
            <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-xl font-bold text-lg transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
                  Launch Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating UI Mockup Representation */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
            className="flex-1 relative w-full max-w-lg hidden md:block"
          >
            {/* Main Glass Card */}
            <div className="relative p-6 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl shadow-2xl skew-y-6 rotate-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="h-4 w-24 bg-slate-800 rounded-full" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex flex-col gap-2">
                  <Activity className="w-5 h-5" />
                  <div className="h-6 w-16 bg-blue-500/20 rounded" />
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex flex-col gap-2">
                  <Database className="w-5 h-5" />
                  <div className="h-6 w-16 bg-emerald-500/20 rounded" />
                </div>
              </div>

              <div className="w-full h-32 rounded-xl bg-slate-800/50 border border-slate-700 flex items-end p-4 gap-2">
                {[40, 70, 45, 90, 65, 30].map((h, i) => (
                  <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 1 + (i * 0.1), duration: 0.8 }} className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm" />
                ))}
              </div>
            </div>
            
            {/* Floating Mini Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 p-5 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur-lg shadow-2xl flex items-center gap-4"
            >
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <BrainCircuit className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="h-2 w-20 bg-slate-600 rounded-full mb-2" />
                <div className="h-2 w-32 bg-slate-700 rounded-full" />
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
