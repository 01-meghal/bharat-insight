import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; isUp: boolean };
  themeAccent: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, themeAccent }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col relative overflow-hidden group hover:border-slate-700 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg bg-slate-950/50 border border-slate-800 ${themeAccent} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.isUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
            {trend.isUp ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
      <div className="z-10 relative">
        <h3 className="text-slate-400 font-medium text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
      </div>
      
      {/* Decorative gradient blur based on theme */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-slate-800 rounded-full blur-[50px] opacity-40 group-hover:opacity-60 transition-opacity" />
    </motion.div>
  );
}
