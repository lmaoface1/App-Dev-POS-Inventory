import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { dashboardService } from '../services/dashboardService';

Chart.register(...registerables);

export default function SalesAnalytics() {
  const lineRef = useRef(null);
  const barRef = useRef(null);
  const lineChart = useRef(null);
  const barChart = useRef(null);
  const [salesByDay, setSalesByDay] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    Promise.all([
      dashboardService.getSalesByDay(),
      dashboardService.getTopProducts(),
      dashboardService.getSummary(),
    ])
      .then(([salesRes, topRes, sumRes]) => {
        setSalesByDay(salesRes.data || []);
        setTopProducts(topRes.data || []);
        setSummary(sumRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Line chart
  useEffect(() => {
    if (!lineRef.current || salesByDay.length === 0) return;
    if (lineChart.current) lineChart.current.destroy();
    lineChart.current = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: salesByDay.map((d) => `Day ${d.day}`),
        datasets: [{
          label: 'Sales (₱)',
          data: salesByDay.map((d) => d.total),
          borderColor: '#f97316',
          backgroundColor: 'rgba(249,115,22,0.08)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#f97316',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#9ca3af' } },
          y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, color: '#9ca3af' } },
        },
      },
    });
    return () => lineChart.current?.destroy();
  }, [salesByDay]);

  // Bar chart — top products
  useEffect(() => {
    if (!barRef.current || topProducts.length === 0) return;
    if (barChart.current) barChart.current.destroy();
    barChart.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: topProducts.map((p) => p.name),
        datasets: [{
          label: 'Revenue (₱)',
          data: topProducts.map((p) => p.total_revenue),
          backgroundColor: 'rgba(249,115,22,0.75)',
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#9ca3af' } },
          y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, color: '#9ca3af' } },
        },
      },
    });
    return () => barChart.current?.destroy();
  }, [topProducts]);

  const formatPeso = (n) => `₱${Number(n || 0).toLocaleString()}`;

  const stats = [
    { label: 'Total Revenue', value: formatPeso(summary?.totalRevenue), color: 'text-green-600', bg: 'bg-green-50' },
    { label: "Today's Sales", value: formatPeso(summary?.todaySales), color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Transactions', value: summary?.totalTransactions ?? '—', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg. Sale Value', value: formatPeso(summary?.avgSale), color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>
        <p className="text-sm text-gray-400 mt-0.5">Revenue trends and product performance</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{loading ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      {/* Line chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Daily Sales — Last 30 Days</h2>
        <div className="h-64">
          {loading
            ? <div className="h-full bg-gray-100 rounded-lg animate-pulse" />
            : <canvas ref={lineRef} />
          }
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Top Products by Revenue</h2>
        <div className="h-64">
          {loading
            ? <div className="h-full bg-gray-100 rounded-lg animate-pulse" />
            : <canvas ref={barRef} />
          }
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Product Sales Breakdown</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-gray-400 font-medium pb-3">Product</th>
              <th className="text-right text-gray-400 font-medium pb-3">Units Sold</th>
              <th className="text-right text-gray-400 font-medium pb-3">Revenue</th>
              <th className="text-right text-gray-400 font-medium pb-3">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topProducts.map((p, i) => {
              const totalRev = topProducts.reduce((s, x) => s + Number(x.total_revenue), 0);
              const share = totalRev > 0 ? ((Number(p.total_revenue) / totalRev) * 100).toFixed(1) : '0';
              return (
                <tr key={i}>
                  <td className="py-3.5 text-gray-800 font-medium">{p.name}</td>
                  <td className="py-3.5 text-right text-gray-600">{p.total_quantity}</td>
                  <td className="py-3.5 text-right font-semibold text-gray-900">{formatPeso(p.total_revenue)}</td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${share}%` }} />
                      </div>
                      <span className="text-gray-500 text-xs w-10 text-right">{share}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
