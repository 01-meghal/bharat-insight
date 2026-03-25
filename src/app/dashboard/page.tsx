"use client";

import { useAppStore } from "@/store/useAppStore";
import { fetchDepartmentData } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Sparkles, Filter, Loader2, BrainCircuit } from "lucide-react";

export default function DashboardPage() {
  const { department, filterState, filterYear, searchQuery, setFilterState, setFilterYear, setSearchQuery } = useAppStore();
  
  // Theme styling based on department
  const themeAccent = department === 'Health' ? 'text-blue-400' : 'text-emerald-400';
  const bgAccent = department === 'Health' ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30';
  const buttonLg = department === 'Health' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500';

  // Fetch Dataset
  const { data = [], isLoading } = useQuery({
    queryKey: ['departmentData', department],
    queryFn: () => fetchDepartmentData(department),
  });

  // Extract unique filter options
  const states = useMemo(() => Array.from(new Set(data.map(d => d.state))).sort(), [data]);
  const years = useMemo(() => Array.from(new Set(data.map(d => d.year.toString()))).sort((a,b) => Number(b) - Number(a)), [data]);

  // Apply Filters
  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchState = filterState === 'All' || row.state === filterState;
      const matchYear = filterYear === 'All' || row.year.toString() === filterYear;
      const matchSearch = row.metricName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          row.state.toLowerCase().includes(searchQuery.toLowerCase());
      return matchState && matchYear && matchSearch;
    });
  }, [data, filterState, filterYear, searchQuery]);

  // AI Insight State
  const [insight, setInsight] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    setInsight('');
    
    // Prepare a summary of data to send to Gemini (limit to prevent huge payloads)
    const summaryData = filteredData.slice(0, 15).map(row => `${row.year} ${row.state} - ${row.metricName}: ${row.value}`);
    const context = `Department: ${department}. Filters: State=${filterState}, Year=${filterYear}. Row count: ${filteredData.length}. Sample data: ${summaryData.join(' | ')}`;

    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
      });
      const result = await response.json();
      setInsight(result.insight || "No insight generated.");
    } catch (e) {
      setInsight("Failed to generate insight. Ensure Gemini API key is configured.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 max-h-screen">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{department} Dashboard</h1>
          <p className="text-slate-400 mt-1">Analyze and explore public {department.toLowerCase()} records.</p>
        </div>
        
        {/* Generate AI Insights Button */}
        <button 
          onClick={handleGenerateInsights}
          disabled={isGenerating || isLoading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white ${buttonLg}`}
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Generate AI Insights
        </button>
      </div>

      {/* AI Insights Panel */}
      {(insight || isGenerating) && (
        <div className={`p-6 rounded-2xl border backdrop-blur-sm ${bgAccent} animate-in fade-in slide-in-from-top-4 duration-500`}>
          <div className="flex items-center gap-3 mb-3">
            <BrainCircuit className="w-6 h-6" />
            <h3 className="text-lg font-semibold text-white">Gemini Insights</h3>
          </div>
          {isGenerating ? (
            <div className="space-y-2">
              <div className="h-4 bg-slate-800/50 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-slate-800/50 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-slate-800/50 rounded w-4/6 animate-pulse"></div>
            </div>
          ) : (
            <p className="text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">{insight}</p>
          )}
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <Filter className="w-5 h-5 text-slate-500 ml-2 shadow-sm" />
        
        <select 
          value={filterState} 
          onChange={(e) => setFilterState(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-sm rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-slate-500 transition-colors"
        >
          <option value="All">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select 
          value={filterYear} 
          onChange={(e) => setFilterYear(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-sm rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-slate-500 transition-colors"
        >
          <option value="All">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <div className="relative flex-1 min-w-[200px] ml-auto">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search metric or state..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-sm rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
             <Loader2 className={`w-10 h-10 animate-spin ${themeAccent}`} />
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-slate-950 border-b border-slate-800 sticky top-0 z-10 shadow-sm">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold text-slate-300">State</th>
                <th scope="col" className="px-6 py-4 font-semibold text-slate-300">Year</th>
                <th scope="col" className="px-6 py-4 font-semibold text-slate-300">Metric</th>
                <th scope="col" className="px-6 py-4 font-semibold text-slate-300 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-200">{row.state}</td>
                    <td className="px-6 py-4">{row.year}</td>
                    <td className="px-6 py-4">{row.metricName}</td>
                    <td className={`px-6 py-4 font-mono text-right font-medium group-hover:${themeAccent} transition-colors`}>
                      {row.value.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No data found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
