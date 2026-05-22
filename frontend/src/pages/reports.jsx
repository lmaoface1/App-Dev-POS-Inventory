import { useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { salesService } from '../services/salesService';
import { inventoryService } from '../services/productService';

function toCSV(rows, headers) {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.join(',')];
  rows.forEach((row) => lines.push(headers.map((h) => escape(row[h])).join(',')));
  return lines.join('\n');
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [generating, setGenerating] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const generateSalesReport = async () => {
    setGenerating('sales');
    try {
      const res = await salesService.getAll();
      let sales = res.data || [];
      if (dateFrom) sales = sales.filter((s) => new Date(s.created_at) >= new Date(dateFrom));
      if (dateTo) sales = sales.filter((s) => new Date(s.created_at) <= new Date(dateTo + 'T23:59:59'));
      const headers = ['id', 'cashier_id', 'total_amount', 'created_at'];
      const csv = toCSV(sales, headers);
      downloadCSV(csv, `smartsale_sales_${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (err) {
      alert('Failed to generate report');
    } finally {
      setGenerating(null);
    }
  };

  const generateInventoryReport = async () => {
    setGenerating('inventory');
    try {
      const res = await inventoryService.getAll();
      const products = res.data || [];
      const headers = ['id', 'name', 'category', 'price', 'stock', 'low_stock_threshold', 'created_at'];
      const csv = toCSV(products, headers);
      downloadCSV(csv, `smartsale_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (err) {
      alert('Failed to generate report');
    } finally {
      setGenerating(null);
    }
  };

  const reportCards = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'All transactions with cashier, amount, and date. Filter by date range below.',
      icon: FileText,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      action: generateSalesReport,
      dateFilter: true,
    },
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Full product list with current stock levels, prices, and low stock thresholds.',
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      action: generateInventoryReport,
      dateFilter: false,
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Report Generation</h1>
        <p className="text-sm text-gray-400 mt-0.5">Download CSV reports for sales and inventory</p>
      </div>

      {/* Date filter for sales */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-gray-400" />
          <h2 className="font-semibold text-gray-700 text-sm">Sales Date Filter (optional)</h2>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-xs text-gray-400 mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="text-xs text-gray-400 hover:text-gray-600 mt-4"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportCards.map(({ id, title, description, icon: Icon, color, bg, border, action, dateFilter }) => (
          <div key={id} className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-400 mt-0.5">{description}</p>
                {dateFilter && (dateFrom || dateTo) && (
                  <p className="text-xs text-orange-500 mt-1">
                    Filtered: {dateFrom || '∞'} → {dateTo || '∞'}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={action}
              disabled={generating === id}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition ${
                id === 'sales'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-60'
                  : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-60'
              }`}
            >
              <Download size={15} />
              {generating === id ? 'Generating...' : `Download ${title} CSV`}
            </button>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-sm text-gray-500">
        <p className="font-medium text-gray-700 mb-1">About reports</p>
        <p>Reports are downloaded as CSV files that open in Excel, Google Sheets, or any spreadsheet app. Data is pulled live from the database at the time of export.</p>
      </div>
    </div>
  );
}
