import React, { useState } from 'react';
import { ArrowUpRight, AlertCircle, Plus, FileText } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function Dashboard() {
  const [summary] = useState({
    totalInventory: 125450,
    todaySales: 8900,
    pendingOrders: 14,
    lowStockCount: 12
  });

  // Generic Mock Data for Low Stock Panel
  const [lowStockAlerts] = useState([
    { id: 1, name: 'Product A', unitsBelow: 40 },
    { id: 2, name: 'Product B', unitsBelow: 40 },
    { id: 3, name: 'Product C', unitsBelow: 40 },
  ]);

  // Generic Mock Data for Top Sellers Panel
  const [topProducts] = useState([
    { rank: 1, name: 'Product A', volume: 315 },
    { rank: 2, name: 'Product D', volume: 12 },
    { rank: 3, name: 'Product E', volume: 10 },
  ]);

  const chartData = {
    labels: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30'],
    datasets: [
      {
        fill: true,
        label: 'Sales Performance',
        data: [1100, 1500, 2100, 1900, 2600, 3100, 4000, 4800, 6000, 6800, 6500, 7800, 8000, 8800, 9900],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 0,
        max: 10000,
        ticks: {
          callback: (value) => '₱' + value.toLocaleString(),
          stepSize: 2000
        }
      }
    }
  };

  return (
    /* ADDED: w-full max-w-full min-w-0 overflow-x-hidden 
      This prevents your chart widths from pushing the sidebar layout off-screen.
    */
    <div className="flex-1 w-full max-w-full min-w-0 bg-[#fafafa] p-10 overflow-y-auto overflow-x-hidden">
      {/* Header Panel */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome to SmartSale Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm">
            <Plus size={16} />
            <span>New Transaction</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            <FileText size={16} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200/80 p-6 rounded-2xl relative shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-700">Total Inventory Value</span>
            <ArrowUpRight size={18} className="text-gray-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black tracking-tight">₱{summary.totalInventory.toLocaleString()}</h3>
            <span className="text-xs font-bold text-green-600 inline-block mt-2 bg-green-50 px-2 py-0.5 rounded">
              +5.2%
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-6 rounded-2xl relative shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-700">Today's Sales</span>
            <ArrowUpRight size={18} className="text-gray-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black tracking-tight">₱{summary.todaySales.toLocaleString()}</h3>
            <span className="text-xs font-bold text-green-600 inline-block mt-2 bg-green-50 px-2 py-0.5 rounded">
              +12% vs avg
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-6 rounded-2xl shadow-sm">
          <span className="text-sm font-semibold text-gray-700 block">Pending Orders</span>
          <div className="mt-4">
            <h3 className="text-3xl font-black tracking-tight">{summary.pendingOrders}</h3>
            <span className="text-xs font-medium text-gray-500 block mt-2">
              {summary.pendingOrders} pending transactions
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-6 rounded-2xl shadow-sm">
          <span className="text-sm font-semibold text-gray-700 block">Low Stock Items</span>
          <div className="mt-4">
            <h3 className="text-3xl font-black tracking-tight text-black">{summary.lowStockCount}</h3>
            <span className="text-xs font-medium text-gray-500 block mt-2">
              {summary.lowStockCount} items below threshold
            </span>
          </div>
        </div>
      </div>

      {/* Charts & Split Lists Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Low Stock Panel */}
        <div className="xl:col-span-3 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle size={18} className="text-orange-600" />
            <h4 className="font-bold text-gray-900">Low Stock Alerts</h4>
          </div>
          <div className="space-y-4">
            {lowStockAlerts.map((item) => (
              <div key={item.id} className="text-sm font-medium text-gray-800 pb-2 border-b border-b-gray-50">
                {item.name} <span className="text-gray-400 font-normal">({item.unitsBelow} units below threshold)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Chart */}
        <div className="xl:col-span-6 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Live Sales Performance</h4>
            <span className="text-xs font-semibold text-gray-400">Last 30 days</span>
          </div>
          <div className="flex-1 min-h-[220px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Top Sellers Panel */}
        <div className="xl:col-span-3 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <h4 className="font-bold text-gray-900 mb-6">Top Selling Products</h4>
          <div className="space-y-4">
            {topProducts.map((prod) => (
              <div key={prod.rank} className="flex items-center justify-between text-sm font-medium">
                <div className="flex items-center gap-2 text-gray-900">
                  <span className="text-gray-400 font-normal">{prod.rank}.</span>
                  <span>{prod.name}</span>
                </div>
                <span className="text-gray-500 font-semibold">({prod.volume})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}