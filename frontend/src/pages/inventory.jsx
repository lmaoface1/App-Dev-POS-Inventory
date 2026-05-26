import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package, AlertTriangle } from 'lucide-react';
import { productService, inventoryService } from '../services/productService';

const EMPTY_FORM = { name: '', category: '', price: '', stock: '', low_stock_threshold: '' };

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'adjust' | null
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [adjustQty, setAdjustQty] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await inventoryService.getAll();
      setProducts(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_FORM); setSelected(null); setError(''); setModal('add'); };
  const openEdit = (p) => { setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, low_stock_threshold: p.low_stock_threshold }); setSelected(p); setError(''); setModal('edit'); };
  const openAdjust = (p) => { setSelected(p); setAdjustQty(''); setError(''); setModal('adjust'); };

  const closeModal = () => { setModal(null); setSelected(null); setSaving(false); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        low_stock_threshold: parseInt(form.low_stock_threshold, 10),
      };
      if (modal === 'add') await productService.create(payload);
      else await productService.update(selected.id, payload);
      await fetchProducts();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await productService.delete(id);
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleAdjust = async () => {
    setSaving(true); setError('');
    try {
      await inventoryService.adjustStock(selected.id, parseInt(adjustQty, 10));
      await fetchProducts();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setSaving(false);
    }
  };

  const isLow = (p) => p.stock <= p.low_stock_threshold;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage products and stock levels</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="relative mb-5">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or category..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Product Name', 'Category', 'Price', 'Stock', 'Threshold', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-gray-400 font-medium pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 pr-4 font-medium text-gray-800">{p.name}</td>
                    <td className="py-3.5 pr-4 text-gray-500">{p.category}</td>
                    <td className="py-3.5 pr-4 text-gray-800">₱{Number(p.price).toFixed(2)}</td>
                    <td className="py-3.5 pr-4">
                      <span className={`font-semibold ${isLow(p) ? 'text-red-500' : 'text-gray-800'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-gray-500">{p.low_stock_threshold}</td>
                    <td className="py-3.5 pr-4">
                      {isLow(p) ? (
                        <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-fit">
                          <AlertTriangle size={11} /> Low Stock
                        </span>
                      ) : (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">OK</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openAdjust(p)}
                          className="text-xs text-blue-500 hover:text-blue-700 border border-blue-100 hover:border-blue-300 px-2 py-1 rounded transition"
                        >
                          Adjust
                        </button>
                        <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-orange-500 transition">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500 transition">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">
                      <Package size={32} className="mx-auto mb-2 opacity-30" />
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add / Edit */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5">
              {modal === 'add' ? 'Add Product' : 'Edit Product'}
            </h2>
            {error && <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
            <div className="space-y-4">
              {[
                { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Coffee Beans' },
                { label: 'Category', key: 'category', type: 'text', placeholder: 'e.g. Beverages' },
                { label: 'Price (₱)', key: 'price', type: 'number', placeholder: '0.00' },
                { label: 'Stock Quantity', key: 'stock', type: 'number', placeholder: '0' },
                { label: 'Low Stock Threshold', key: 'low_stock_threshold', type: 'number', placeholder: '10' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adjust Stock */}
      {modal === 'adjust' && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-1">Adjust Stock</h2>
            <p className="text-sm text-gray-500 mb-5">{selected?.name} — Current: {selected?.stock} units</p>
            {error && <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Quantity (use negative to subtract)
              </label>
              <input
                type="number"
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                placeholder="e.g. 50 or -10"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleAdjust} disabled={saving} className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition">
                {saving ? 'Adjusting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
