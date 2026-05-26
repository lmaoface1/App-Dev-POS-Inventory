import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, ClipboardList } from "lucide-react";
import { salesService } from "../services/salesService";

export default function Orders() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    salesService
      .getAll()
      .then((data) => setSales(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleRow = async (saleId) => {
    if (expanded === saleId) {
      setExpanded(null);
      return;
    }
    setExpanded(saleId);
    if (!detail[saleId]) {
      try {
        const data = await salesService.getById(saleId);
        setDetail((prev) => ({ ...prev, [saleId]: data }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filtered = sales.filter(
    (s) =>
      String(s.id).includes(search) ||
      (s.cashier_name || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          All processed sales transactions
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="relative mb-5">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sale ID or cashier..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Sale ID", "Cashier", "Total Amount", "Date", "Details"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-gray-400 font-medium pb-3 pr-4"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sale) => (
                <>
                  <tr
                    key={sale.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => toggleRow(sale.id)}
                  >
                    <td className="py-3.5 pr-4 font-mono text-gray-600">
                      #{sale.id}
                    </td>
                    <td className="py-3.5 pr-4 text-gray-800">
                      {sale.cashier_name || `User #${sale.cashier_id}`}
                    </td>
                    <td className="py-3.5 pr-4 font-bold text-gray-900">
                      ₱{Number(sale.total_amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 pr-4 text-gray-500">
                      {new Date(sale.created_at).toLocaleDateString()}{" "}
                      {new Date(sale.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5">
                      <button className="text-orange-500 hover:text-orange-700 transition">
                        {expanded === sale.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded row — sale items */}
                  {expanded === sale.id && (
                    <tr key={`${sale.id}-detail`}>
                      <td colSpan={5} className="py-0">
                        <div className="bg-gray-50 rounded-lg mx-2 my-2 p-4">
                          {detail[sale.id] ? (
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left text-gray-400 font-medium pb-2">
                                    Product
                                  </th>
                                  <th className="text-right text-gray-400 font-medium pb-2">
                                    Qty
                                  </th>
                                  <th className="text-right text-gray-400 font-medium pb-2">
                                    Unit Price
                                  </th>
                                  <th className="text-right text-gray-400 font-medium pb-2">
                                    Subtotal
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {(detail[sale.id].items || []).map((item) => (
                                  <tr key={item.id}>
                                    <td className="py-2 text-gray-800">
                                      {item.product_name ||
                                        `Product #${item.product_id}`}
                                    </td>
                                    <td className="py-2 text-right text-gray-600">
                                      {item.quantity}
                                    </td>
                                    <td className="py-2 text-right text-gray-600">
                                      ₱{Number(item.unit_price).toFixed(2)}
                                    </td>
                                    <td className="py-2 text-right font-medium text-gray-800">
                                      ₱
                                      {(
                                        item.quantity * item.unit_price
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              Loading...
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    <ClipboardList
                      size={32}
                      className="mx-auto mb-2 opacity-30"
                    />
                    No orders found
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
