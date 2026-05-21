import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  BarChart3, 
  History, 
  Users, 
  FileSpreadsheet 
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col justify-between">
      <div className="p-6">
        {/* Brand Logo */}
        <h1 className="text-2xl font-black tracking-wider text-black mb-8">
          SMARTSALE
        </h1>

        {/* Nav Links */}
        <nav className="space-y-1">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-black text-white font-medium rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
          </button>

          <div className="space-y-1 pt-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors">
              <Boxes size={20} />
              <span>Inventory Management</span>
            </button>
            
            <button className="w-full flex items-center justify-between px-4 py-2 text-gray-600 hover:bg-gray-50 pl-11 rounded-lg transition-colors text-sm">
              <span>Alerts</span>
              <span className="w-5 h-5 bg-orange-600 text-white font-bold rounded-full text-[11px] flex items-center justify-center">
                !
              </span>
            </button>
          </div>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors">
            <BarChart3 size={20} />
            <span>Sales Analytics</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors">
            <History size={20} />
            <span>Order History</span>
          </button>

          <div className="space-y-1 pt-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors">
              <Users size={20} />
              <span>User Management</span>
            </button>
            <button className="w-full text-left px-4 py-1.5 text-gray-500 hover:text-black pl-11 text-sm">
              Admin
            </button>
            <button className="w-full text-left px-4 py-1.5 text-gray-500 hover:text-black pl-11 text-sm">
              Cashier
            </button>
          </div>
        </nav>
      </div>

      <div className="p-6 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors">
          <FileSpreadsheet size={20} />
          <span>Report Generation</span>
        </button>
      </div>
    </aside>
  );
}