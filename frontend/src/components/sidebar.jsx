import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingCart, ClipboardList,
  Users, BarChart2, LogOut, Store
} from 'lucide-react';

const adminLinks = [
  { to: '/dashboard',  label: 'Dashboard',          icon: LayoutDashboard },
  { to: '/inventory',  label: 'Inventory Management', icon: Package },
  { to: '/sales',      label: 'Sales Analytics',     icon: BarChart2 },
  { to: '/orders',     label: 'Order History',        icon: ClipboardList },
  { to: '/users',      label: 'User Management',      icon: Users },
  { to: '/reports',    label: 'Report Generation',    icon: BarChart2 },
];

const cashierLinks = [
  { to: '/pos',    label: 'Point of Sale', icon: ShoppingCart },
  { to: '/orders', label: 'My Orders',     icon: ClipboardList },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'admin' ? adminLinks : cashierLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-52 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Store size={20} className="text-orange-500" />
          <span className="font-bold text-gray-900 text-lg">SmartSale</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'Cashier Panel'}
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 w-full transition-all duration-150"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
