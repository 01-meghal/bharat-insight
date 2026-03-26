"use client";

import { useAppStore } from "@/store/useAppStore";
import { BarChart3, BrainCircuit, Globe2, LayoutDashboard, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { department, setDepartment } = useAppStore();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Theme based on Department
  const themeColors = {
    Health: "from-blue-600/20 to-cyan-400/20",
    Agriculture: "from-emerald-600/20 to-lime-400/20",
  };
  
  const accentColors = {
    Health: "text-blue-400 border-blue-400/50",
    Agriculture: "text-emerald-400 border-emerald-400/50",
  };

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "AI Insights", icon: BrainCircuit, href: "/dashboard/insights" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-slate-950 text-slate-50">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-lg ${accentColors[department]} bg-slate-900`}>
            {department === 'Health' ? <BarChart3 className="w-5 h-5" /> : <Globe2 className="w-5 h-5" />}
          </div>
          <span className="text-xl font-bold tracking-tight">Bharat-Insight</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white transition-colors focus:outline-none">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar background effect (Desktop only) */}
      <div className={`hidden md:block absolute top-0 left-0 w-64 h-full bg-gradient-to-b ${themeColors[department]} opacity-30 pointer-events-none transition-colors duration-1000`}></div>

      {/* Sidebar Navigation */}
      <aside className={`absolute md:relative z-40 w-64 h-[calc(100vh-73px)] md:h-full border-r border-slate-800 bg-slate-950 md:bg-slate-950/80 md:backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0 top-[73px]' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 overflow-y-auto flex-1">
          <Link href="/" className="hidden md:flex items-center gap-2 mb-8">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-lg transition-colors ${accentColors[department]} bg-slate-900`}>
              {department === 'Health' ? <BarChart3 className="w-5 h-5" /> : <Globe2 className="w-5 h-5" />}
            </div>
            <span className="text-xl font-bold tracking-tight">Bharat-Insight</span>
          </Link>

          {/* Department Switcher */}
          <div className="mb-8 mt-2 md:mt-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Department</p>
            <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 relative">
              <button
                onClick={() => { setDepartment('Health'); setIsMobileMenuOpen(false); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg z-10 transition-colors ${department === 'Health' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Health
              </button>
              <button
                onClick={() => { setDepartment('Agriculture'); setIsMobileMenuOpen(false); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg z-10 transition-colors ${department === 'Agriculture' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Agriculture
              </button>
              
              {/* Highlight Pill */}
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-in-out ${department === 'Health' ? 'left-1 bg-blue-600' : 'left-[calc(50%+2px)] bg-emerald-600'}`} 
              />
            </div>
          </div>

          <nav className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? `bg-slate-800 text-white ${department === 'Health' ? 'shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)]' : 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'}` 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive && (department === 'Health' ? 'text-blue-400' : 'text-emerald-400')}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 md:border-t-0 border-t border-slate-800">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 top-[73px] bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Context */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
         <div className="flex-1 overflow-auto p-4 md:p-8 relative z-10 w-full">
            {children}
         </div>
         {/* Subtle radial gradient background */}
         <div className={`absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-[0.15] transition-colors duration-1000 ${department === 'Health' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
      </main>
    </div>
  );
}
