"use client";

import { useAppStore } from "@/store/useAppStore";
import { fetchDepartmentData } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Sparkles, Filter, Loader2, BrainCircuit, Activity, Hash, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom Components
import { StatCard } from "@/components/dashboard/StatCard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { DataTableWidget } from "@/components/dashboard/DataTableWidget";

export default function DashboardPage() {
  const { department, filterState, filterYear, searchQuery, setFilterState, setFilterYear, setSearchQuery } = useAppStore();
  
  // Dynamic Themes
  const themeAccent = department === 'Health' ? 'text-blue-400' : 'text-emerald-400';
  const bgAccent = department === 'Health' ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30';
  const buttonLg = department === 'Health' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20';

  // Data Fetching
  const { data = [], isLoading } = useQuery({
    queryKey: ['departmentData', department],
    queryFn: () => fetchDepartmentData(department),
  });

  // Extract Dropdown Options
  const states = useMemo(() => Array.from(new Set(data.map(d => d.state))).sort(), [data]);
  const years = useMemo(() => Array.from(new Set(data.map(d => d.year.toString()))).sort((a,b) => Number(b) - Number(a)), [data]);

  // Handle Filtering
  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchState = filterState === 'All' || row.state === filterState;
      const matchYear = filterYear === 'All' || row.year.toString() === filterYear;
      const matchSearch = row.metricName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          row.state.toLowerCase().includes(searchQuery.toLowerCase());
      return matchState && matchYear && matchSearch;
    });
  }, [data, filterState, filterYear, searchQuery]);

  // Derived KPIs
  const totalRecords = filteredData.length;
  const totalValue = filteredData.reduce((acc, row) => acc + row.value, 0);
  
  // Find top state by total value in current filter
  const stateTotals = filteredData.reduce((acc, row) => {
    acc[row.state] = (acc[row.state] || 0) + row.value;
    return acc;
  }, {} as Record<string, number>);
  const topState = Object.entries(stateTotals).sort((a,b) => b[1] - a[1])[0] || ['N/A', 0];

  // AI Configuration
  const [insight, setInsight] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    setInsight('');
    const summaryData = filteredData.slice(0, 10).map(row => `${row.year} ${row.state}: ${row.value}`);
    const context = `Dept: ${department}. Filters: State=${filterState}, Year=${filterYear}. Rows: ${filteredData.length}. Highest State is ${topState[0]} with ${topState[1]}. Sample: ${summaryData.join(', ')}`;

    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
      });
      const result = await response.json();
      setInsight(result.insight || "No insight generated.");
    } catch (e) {
      setInsight("Failed to generate insight. Check if API is available.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className={`w-12 h-12 animate-spin ${themeAccent}`} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 overflow-x-hidden">
      {/* Header & Controls Group */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">{department} Analytics</h1>
          <p className="text-slate-400">Deep-dive into regional metrics and AI-driven growth patterns.</p>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col sm:flex-row w-full xl:w-auto items-center gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-xl shrink-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="bg-slate-950 border border-slate-700 text-sm rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-slate-500 w-full sm:w-auto">
              <option value="All">All Regions</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="bg-slate-950 border border-slate-700 text-sm rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-slate-500 w-full sm:w-auto">
              <option value="All">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          
          <div className="relative w-full sm:w-[250px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search metrics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-sm rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-slate-500" />
          </div>
        </div>
      </motion.div>

      {/* KPI Grid (Bento Box Row 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Regional Value" value={totalValue >= 1000 ? `${(totalValue / 1000).toFixed(1)}k` : totalValue} icon={Activity} themeAccent={themeAccent} description="Aggregate across selected filters" trend={{ value: 12.5, isUp: true }} />
        <StatCard title="Highest Performing Region" value={topState[0]} icon={Trophy} themeAccent={themeAccent} description={`Leading with ${Number(topState[1]).toLocaleString()} metrics`} />
        <StatCard title="Total Database Records" value={totalRecords} icon={Hash} themeAccent={themeAccent} description="Active rows matching current query" />
      </div>

      {/* Main Grid (Bento Box Row 2) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
        {/* Analytics Chart - Takes up 2 columns on wide screens */}
        <div className="xl:col-span-2 flex flex-col min-h-[400px]">
          <AnalyticsChart data={filteredData} themeColor={department} />
        </div>

        {/* AI Control Panel - Takes up 1 column */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -z-10 group-hover:bg-purple-600/20 transition-all duration-700" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Gemini Synapse</h3>
            </div>
            
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Use Google's Gemini 2.5 AI model to scan the currently filtered dataset and generate an automated executive summary.
            </p>

            <button onClick={handleGenerateInsights} disabled={isGenerating} className={`mt-auto flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-white ${buttonLg}`}>
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
              Generate Analysis
            </button>
          </div>

          <AnimatePresence>
            {(insight || isGenerating) && (
              <motion.div initial={{ opacity: 0, height: 0, y: 20 }} animate={{ opacity: 1, height: 'auto', y: 0 }} className={`p-6 rounded-2xl border backdrop-blur-md ${bgAccent}`}>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI Observation
                </h4>
                {isGenerating ? (
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-800/80 rounded w-full animate-pulse" />
                    <div className="h-3 bg-slate-800/80 rounded w-5/6 animate-pulse" />
                    <div className="h-3 bg-slate-800/80 rounded w-4/6 animate-pulse" />
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{insight}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Data Table Bottom Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full h-[500px]">
        <DataTableWidget data={filteredData} themeAccent={themeAccent} />
      </motion.div>
    </div>
  );
}
