"use client";

import { DataRow } from "@/lib/data";

interface DataTableWidgetProps {
  data: DataRow[];
  themeAccent: string;
}

export function DataTableWidget({ data, themeAccent }: DataTableWidgetProps) {
  return (
    <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-lg font-semibold text-white">Records Database</h3>
      </div>
      <div className="flex-1 overflow-auto">
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
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/80 transition-colors group">
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
                  No records found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
