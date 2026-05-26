import { useState, useEffect, useRef } from 'react';
import { Bell, Settings, Package, DollarSign, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { dashboardService } from '../services/dashboardService';
import { inventoryService } from '../services/productService';
import MetricCard from '../components/MetricCard';

Chart.register(...registerables);

export default function Dashboard() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [summary, setSummary] = useState(null);
  const [salesByDay, setSalesByDay] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sumRes, salesRes, topRes, lowRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getSalesByDay(),
          dashboardService.getTopProducts(),
          inventoryService.getLowStock(),
        ]);
        setSummary(sumRes.data);
        setSalesByDay(salesRes.data);
        setTopProducts(topRes.data);
        setLowStock(lowRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Build Chart.js line chart
  useEffect(() => {
    if (!chartRef.current || salesByDay.length === 0) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: salesByDay.map((d) => `Day ${d.day}`),
        datasets: [{
          label: 'Sales (₱)',
          data: salesByDay.map((d) => d.total),
          borderColor: '#4780db',
          backgroundColor: 'rgba(59,130,246,0.06)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#9ca3af' } },
          y: {
            grid: { color: '#f3f4f6' },
            ticks: { font: { size: 11 }, color: '#9ca3af' },
          },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [salesByDay]);

  const formatPeso = (n) => `₱${Number(n || 0).toLocaleString()}`;

  // Skeleton while loading
  if (loading) {
    return (
      <div className="p-8 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Welcome back! Here's your business overview for {today}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <Bell size={20} />
            {lowStock.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Inventory Value"
          value={formatPeso(summary?.inventoryValue)}
          subtitle="+5.2%"
          icon={Package}
          iconColor="text-blue-400"
        />
        <MetricCard
          title="Today's Sales"
          value={formatPeso(summary?.todaySales)}
          subtitle="+12% vs avg"
          icon={DollarSign}
          iconColor="text-green-400"
        />
        <MetricCard
          title="Pending Orders"
          value={summary?.pendingOrders ?? 0}
          subtitle={`${summary?.pendingOrders ?? 0} pending transactions`}
          icon={ShoppingCart}
          iconColor="text-orange-400"
        />
        <MetricCard
          title="Low Stock Items"
          value={summary?.lowStockCount ?? lowStock.length}
          subtitle={`${summary?.lowStockCount ?? lowStock.length} items below threshold`}
          icon={AlertTriangle}
          iconColor="text-red-400"
        />
      </div>

      {/* Chart + Low Stock side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Sales Over Time</h2>
          <div className="h-56">
            <canvas ref={chartRef} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-orange-500" />
            <h2 className="font-semibold text-gray-800">Low Stock Alerts</h2>
          </div>
          <div className="space-y-4">
            {lowStock.slice(0, 5).map((item) => {
              const pct = Math.min((item.stock / item.low_stock_threshold) * 100, 100);
              return (
                <div key={item.id} className="bg-orange-50 rounded-lg p-3">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    <span className="text-sm font-semibold text-orange-600">{item.stock} units</span>
                  </div>
                  <div className="w-full bg-orange-100 rounded-full h-1.5">
                    <div
                      className="bg-orange-500 h-1.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Threshold: {item.low_stock_threshold} units</p>
                </div>
              );
            })}
            {lowStock.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No low stock items</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-green-500">↗</span>
          <h2 className="font-semibold text-gray-800">Top Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-gray-400 font-medium pb-3">Product</th>
                <th className="text-right text-gray-400 font-medium pb-3">Qty Sold</th>
                <th className="text-right text-gray-400 font-medium pb-3">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((p, i) => (
                <tr key={p.product_id || i}>
                  <td className="py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="py-3 text-right text-gray-600">{p.total_quantity}</td>
                  <td className="py-3 text-right text-gray-800 font-semibold">{formatPeso(p.total_revenue)}</td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-400">No sales data yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
