import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Printer,
} from "lucide-react";
import { productService } from "../services/productService";
import { salesService } from "../services/salesService";
import { useAuth } from "../context/AuthContext";

export default function POS() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    productService
      .getAll()
      .then((data) => setProducts(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) => p.stock > 0 && p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          unit_price: product.price,
          quantity: 1,
          maxStock: product.stock,
        },
      ];
    });
  };

  const updateQty = (product_id, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product_id === product_id
            ? { ...i, quantity: Math.min(i.quantity + delta, i.maxStock) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const removeItem = (product_id) =>
    setCart((prev) => prev.filter((i) => i.product_id !== product_id));

  const total = cart.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    try {
      const res = await salesService.processSale({
        items: cart.map(({ product_id, quantity, unit_price }) => ({
          product_id,
          quantity,
          unit_price,
        })),
      });
      setReceipt({
        ...res.data,
        items: cart,
        total,
        cashier: user?.name,
        date: new Date(),
      });
      setCart([]);
      // Refresh products so stock counts update
      const updated = await productService.getAll();
      setProducts(updated || []);
    } catch (err) {
      alert(
        err.response?.data?.message || "Checkout failed. Please try again.",
      );
    } finally {
      setProcessing(false);
    }
  };

  if (receipt) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {/* Receipt Header */}
          <div className="text-center border-b border-dashed border-gray-200 pb-4 mb-4">
            <h2 className="font-bold text-lg text-gray-900">SmartSale</h2>
            <p className="text-xs text-gray-400">Official Receipt</p>
            <p className="text-xs text-gray-400 mt-1">
              {receipt.date.toLocaleDateString()}{" "}
              {receipt.date.toLocaleTimeString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Cashier: {receipt.cashier}
            </p>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-4">
            {receipt.items.map((item) => (
              <div
                key={item.product_id}
                className="flex justify-between text-sm"
              >
                <div>
                  <span className="text-gray-800">{item.name}</span>
                  <span className="text-gray-400 ml-2">×{item.quantity}</span>
                </div>
                <span className="text-gray-800">
                  ₱{(item.unit_price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between font-bold text-gray-900">
            <span>TOTAL</span>
            <span>₱{receipt.total.toFixed(2)}</span>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Thank you for your purchase!
          </p>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              <Printer size={15} /> Print
            </button>
            <button
              onClick={() => setReceipt(null)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2.5 rounded-lg transition"
            >
              New Sale
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Product Grid */}
      <div className="flex-1 overflow-auto p-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Select products to add to cart
          </p>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-28 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map((p) => {
              const inCart = cart.find((i) => i.product_id === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className={`bg-white rounded-xl border text-left p-4 transition hover:border-orange-300 hover:shadow-sm ${
                    inCart
                      ? "border-orange-300 bg-orange-50"
                      : "border-gray-100"
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                    <ShoppingCart size={14} className="text-gray-400" />
                  </div>
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-bold text-orange-500">
                      ₱{Number(p.price).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {p.stock} left
                    </span>
                  </div>
                  {inCart && (
                    <span className="mt-1.5 inline-block text-xs text-orange-600 font-medium">
                      In cart: {inCart.quantity}
                    </span>
                  )}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-400">
                No products available
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart Panel */}
      <div className="w-80 bg-white border-l border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-orange-500" />
            <h2 className="font-semibold text-gray-800">Cart</h2>
            {cart.length > 0 && (
              <span className="ml-auto text-xs bg-orange-500 text-white rounded-full px-2 py-0.5">
                {cart.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product_id} className="bg-gray-50 rounded-xl p-3">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-gray-800 flex-1 pr-2">
                    {item.name}
                  </p>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-gray-300 hover:text-red-500 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.product_id, -1)}
                      className="w-6 h-6 bg-white rounded-md border border-gray-200 flex items-center justify-center hover:border-orange-300 transition"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.product_id, 1)}
                      className="w-6 h-6 bg-white rounded-md border border-gray-200 flex items-center justify-center hover:border-orange-300 transition"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    ₱{(item.unit_price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total + Checkout */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Subtotal</span>
            <span className="font-bold text-gray-900">₱{total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
          >
            {processing ? "Processing..." : `Checkout — ₱${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
