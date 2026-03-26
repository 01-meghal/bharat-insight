"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import { DataRow } from '@/lib/data';

interface AnalyticsChartProps {
  data: DataRow[];
  themeColor: string;
}

export function AnalyticsChart({ data, themeColor }: AnalyticsChartProps) {
  // Aggregate data by state for visual representation
  const chartData = data.reduce((acc, row) => {
    const existing = acc.find(item => item.state === row.state);
    if (existing) {
      existing.value += row.value;
    } else {
      acc.push({ state: row.state, value: row.value });
    }
    return acc;
  }, [] as { state: string; value: number }[]).sort((a,b) => b.value - a.value).slice(0, 5); // top 5

  const isHealth = themeColor === 'Health';
  const barColor = isHealth ? '#3b82f6' : '#10b981'; // Blue vs Emerald

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 h-full flex flex-col"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Regional Distribution Matrix</h3>
      
      <div className="flex-1 w-full min-h-[250px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
              <Tooltip
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                itemStyle={{ color: barColor, fontWeight: 'bold' }}
              />
              <Bar dataKey="value" fill={barColor} radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-slate-500">No data available for current filters.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
