import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  Search,
  CheckCircle,
  Eye,
  Lock,
  LogOut,
  RotateCcw,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import {
  Category,
  CategorySlug,
  ClinicAppointment,
  Order,
  OrderStatus,
  Product,
  ProductColor,
} from '../types';
import { storage } from '../services/storage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  categories?: Category[];
  orders?: Order[];
  appointments?: ClinicAppointment[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products = storage.getProducts(),
  categories = storage.getCategories(),
  orders = storage.getOrders(),
  appointments = storage.getAppointments(),
}) => {
  // Simple clean authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'categories' | 'appointments'>('dashboard');

  // Product Add / Edit Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Filter & Search states
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Close on Escape key press (close child form if open, otherwise close admin panel)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingProduct || isAddingProduct) {
          setEditingProduct(null);
          setIsAddingProduct(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, editingProduct, isAddingProduct, onClose]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passcode: "admin66" or "vision66"
    if (passwordInput === 'admin66' || passwordInput === 'vision66' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Use "admin66" to access management.');
    }
  };

  // Dashboard Stats Calculations
  const totalProducts = (products || []).length;
  const activeProducts = (products || []).filter((p) => p && p.inStock).length;
  const totalOrders = (orders || []).length;
  const pendingOrders = (orders || []).filter(
    (o) => o && (o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing')
  ).length;
  const completedOrders = (orders || []).filter((o) => o && o.orderStatus === 'Delivered').length;
  const totalRevenue = (orders || [])
    .filter((o) => o && o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (o?.total || 0), 0);

  // Orders Filtered
  const filteredOrders = orders.filter((ord) => {
    if (orderStatusFilter !== 'all' && ord.orderStatus !== orderStatusFilter) {
      return false;
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchName = ord.customer.fullName.toLowerCase().includes(q);
      const matchPhone = ord.customer.phone.includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  // Products Filtered
  const filteredProducts = products.filter((prod) => {
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        prod.name.toLowerCase().includes(q) ||
        prod.brand.toLowerCase().includes(q) ||
        prod.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    storage.updateOrderStatus(orderId, newStatus);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to remove this frame from the store catalogue?')) {
      storage.deleteProduct(id);
    }
  };

  const handleToggleStock = (product: Product) => {
    storage.updateProduct({
      ...product,
      inStock: !product.inStock,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[96vh] flex flex-col">
        {/* Admin Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-[#0A2E24] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              6/6
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                Store & Clinic Administration
              </h2>
              <p className="text-xs text-emerald-200">
                Shireesha 6/6 Vision Care • Management Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 text-slate-200 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#0A2E24] flex items-center justify-center mx-auto border border-emerald-200">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Admin Sign In</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your store manager passcode to manage frames, orders, and patient eye checkups.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Passcode (Default: admin66)"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                autoFocus
              />
              {authError && <p className="text-xs font-semibold text-rose-600">{authError}</p>}
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#0A2E24] hover:bg-[#061e17] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Unlock Management Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex items-center gap-2 px-6 border-b border-slate-200 bg-[#F9FAFB] overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'border-teal-600 text-teal-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'products'
                    ? 'border-teal-600 text-teal-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Products Catalogue</span>
                <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full">
                  {products.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'border-teal-600 text-teal-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Orders Management</span>
                {pendingOrders > 0 && (
                  <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                    {pendingOrders}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'appointments'
                    ? 'border-teal-600 text-teal-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Clinic Eye Exams</span>
                <span className="text-[10px] bg-teal-100 text-teal-900 px-1.5 py-0.2 rounded-full">
                  {appointments.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'categories'
                    ? 'border-teal-600 text-teal-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Categories
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* TAB: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Total Revenue
                        </span>
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[11px] text-emerald-600 font-medium">
                        From completed & confirmed orders
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Active Orders
                        </span>
                        <ShoppingBag className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">{pendingOrders}</div>
                      <span className="text-[11px] text-slate-500">
                        {completedOrders} delivered to patients
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Catalogue Frames
                        </span>
                        <Package className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">{totalProducts}</div>
                      <span className="text-[11px] text-teal-700 font-medium">
                        {activeProducts} currently in-stock
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Clinic Checkups
                        </span>
                        <Clock className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">
                        {appointments.length}
                      </div>
                      <span className="text-[11px] text-slate-500">Computerized eye exams</span>
                    </div>
                  </div>

                  {/* Recent Orders Overview */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900">Recent Customer Orders</h3>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-teal-700 hover:underline"
                      >
                        View All Orders
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      {orders.slice(0, 4).map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                              <span className="font-semibold text-slate-700">
                                • {ord.customer.fullName}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {ord.items.length} items • Phone: {ord.customer.phone}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-black text-slate-900">
                              ₹{ord.total.toLocaleString('en-IN')}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.orderStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'Processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Data Reset Button */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Demo Data Reset</div>
                      <div className="text-[11px] text-slate-500">
                        Restore catalogue to initial Shireesha 6/6 Vision Care defaults
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Reset catalogue and demo data back to default?')) {
                          storage.resetToInitial();
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products by title or brand..."
                        className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <button
                      onClick={() => setIsAddingProduct(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A2E24] hover:bg-[#061e17] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Product</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8FAFC] text-slate-400 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="p-3">Product</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredProducts.map((prod) => (
                            <tr key={prod.id} className="hover:bg-slate-50">
                              <td className="p-3 flex items-center gap-3">
                                <img
                                  src={prod.images[0]}
                                  alt={prod.name}
                                  className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0"
                                />
                                <div className="truncate max-w-xs">
                                  <div className="font-bold text-slate-900 truncate">
                                    {prod.name}
                                  </div>
                                  <div className="text-[11px] text-teal-700 font-semibold">
                                    {prod.brand}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 font-medium text-slate-600 capitalize">
                                {prod.categoryName}
                              </td>
                              <td className="p-3 font-bold text-slate-900">
                                ₹{prod.price.toLocaleString('en-IN')}
                              </td>
                              <td className="p-3 font-semibold text-slate-700">
                                {prod.stockQuantity} units
                              </td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleToggleStock(prod)}
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                    prod.inStock
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  {prod.inStock ? 'In Stock' : 'Out of Stock'}
                                </button>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingProduct(prod)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                    title="Edit product"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                    title="Delete product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search by Order ID, customer, or phone..."
                        className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Status:</span>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="text-xs p-2 rounded-xl border border-slate-200 bg-white font-medium"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-slate-900">
                                {ord.id}
                              </span>
                              <span className="text-xs font-semibold text-slate-600">
                                • {new Date(ord.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Tracking: <span className="font-mono text-teal-700">{ord.trackingNumber}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-slate-900">
                              ₹{ord.total.toLocaleString('en-IN')}
                            </span>
                            <select
                              value={ord.orderStatus}
                              onChange={(e) =>
                                handleStatusChange(ord.id, e.target.value as OrderStatus)
                              }
                              className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer ${
                                ord.orderStatus === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : ord.orderStatus === 'Processing'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : ord.orderStatus === 'Shipped'
                                  ? 'bg-purple-50 text-purple-800 border-purple-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer & Shipping Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                              Customer Information
                            </span>
                            <div className="font-bold text-slate-800">{ord.customer.fullName}</div>
                            <div>Phone: {ord.customer.phone}</div>
                            {ord.customer.email && <div>Email: {ord.customer.email}</div>}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                              Shipping / Delivery Address
                            </span>
                            <div>{ord.customer.address}</div>
                            <div>
                              {ord.customer.city}, {ord.customer.state} – {ord.customer.pincode}
                            </div>
                          </div>
                        </div>

                        {/* Items in order */}
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Ordered Products ({ord.items.length})
                          </span>
                          <div className="space-y-1.5">
                            {ord.items.map((it) => (
                              <div
                                key={it.cartItemId}
                                className="flex items-center justify-between text-xs py-1"
                              >
                                <span className="font-medium text-slate-800">
                                  {it.product.name} (x{it.quantity}) • {it.selectedColor.name} •{' '}
                                  {it.lensOption}
                                </span>
                                <span className="font-bold text-slate-900">
                                  ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">
                      In-Clinic Eye Examination Appointments
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      Clinic Timings: 9:30 AM – 8:30 PM
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8FAFC] text-slate-400 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Patient Name</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Date & Slot</th>
                          <th className="p-3">Examination Reason</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {appointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-slate-900">{apt.id}</td>
                            <td className="p-3 font-bold text-slate-800">{apt.patientName}</td>
                            <td className="p-3 font-medium text-slate-700">{apt.phone}</td>
                            <td className="p-3 text-slate-800 font-semibold">
                              {apt.date} • {apt.timeSlot}
                            </td>
                            <td className="p-3 text-teal-800 font-medium">{apt.serviceType}</td>
                            <td className="p-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-900">
                                {apt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">Active Eyewear Categories</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{cat.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {cat.itemCount} Frames in Catalogue
                            </div>
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      {(isAddingProduct || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setIsAddingProduct(false);
            setEditingProduct(null);
          }}
          onSave={(prodData) => {
            if (editingProduct) {
              storage.updateProduct({ ...prodData, id: editingProduct.id });
            } else {
              storage.addProduct(prodData);
            }
            setIsAddingProduct(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(product?.name || '');
  const [brand, setBrand] = useState(product?.brand || '6/6 Signature');
  const [category, setCategory] = useState<CategorySlug>(product?.category || 'eyeglasses');
  const [price, setPrice] = useState(product?.price || 1499);
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || 2499);
  const [description, setDescription] = useState(product?.description || '');
  const [imageUrl, setImageUrl] = useState(
    product?.images[0] ||
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80'
  );
  const [frameShape, setFrameShape] = useState(
    product?.specifications?.frameShape || 'Rectangle'
  );
  const [frameMaterial, setFrameMaterial] = useState(
    product?.specifications?.frameMaterial || 'TR90 Ultra-Flex'
  );
  const [frameType, setFrameType] = useState(
    product?.specifications?.frameType || 'Full-Rim'
  );
  const [gender, setGender] = useState(
    product?.specifications?.gender || 'Unisex'
  );
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity || 20);
  const [inStock, setInStock] = useState(product?.inStock !== false);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival || false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller || false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

    const savedData = {
      name,
      brand,
      category,
      categoryName: categories.find((c) => c.slug === category)?.name || 'Eyewear',
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercentage: Math.max(0, discount),
      rating: product?.rating || 4.9,
      reviewCount: product?.reviewCount || 12,
      images: [imageUrl],
      colors: product?.colors || [
        { name: 'Classic Black', hex: '#1E2022' },
        { name: 'Teal Blue', hex: '#0D9488' },
      ],
      sizes: product?.sizes || ['Medium (52mm)'],
      stockQuantity: Number(stockQuantity),
      inStock: inStock && Number(stockQuantity) > 0,
      isFeatured,
      isNewArrival,
      isBestSeller,
      description: description || `${name} premium frame with computerized lens fitting.`,
      specifications: {
        frameDimensions: '52-18-142 mm',
        frameMaterial,
        frameShape,
        frameType,
        gender,
        weight: '16g',
        warranty: '1 Year Clinical Warranty',
        prescriptionCompatible: true,
      },
      reviews: product?.reviews || [],
    };

    onSave(savedData);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900">
            {product ? 'Edit Product Details' : 'Add New Eyewear to Store'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-black flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Titanium Wayfarer Blue-Cut"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ray-Ban, Acuvue, 6/6 Signature"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategorySlug)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Sale Price (₹) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Original Price (₹)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Stock Units</label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">Product Image</label>
            <div className="flex items-center gap-3">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                />
              )}
              <div className="flex-1 space-y-1.5">
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste Image URL (https://...)"
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer text-xs font-semibold">
                  <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
                  <span>Upload local image file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Frame Shape</label>
              <select
                value={frameShape}
                onChange={(e) => setFrameShape(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="Rectangle">Rectangle</option>
                <option value="Round">Round</option>
                <option value="Aviator">Aviator</option>
                <option value="Cat-Eye">Cat-Eye</option>
                <option value="Geometric">Geometric</option>
                <option value="Browline">Browline</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Frame Material</label>
              <input
                type="text"
                value={frameMaterial}
                onChange={(e) => setFrameMaterial(e.target.value)}
                placeholder="Titanium, Acetate, TR90"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              >
              </input>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Frame Type</label>
              <select
                value={frameType}
                onChange={(e) => setFrameType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="Full-Rim">Full-Rim</option>
                <option value="Semi-Rimless">Semi-Rimless</option>
                <option value="Rimless">Rimless</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="Unisex">Unisex</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
          </div>

          {/* Product Flags */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 border-slate-300 w-4 h-4"
              />
              <span className="font-semibold text-slate-700">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 border-slate-300 w-4 h-4"
              />
              <span className="font-semibold text-slate-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 border-slate-300 w-4 h-4"
              />
              <span className="font-semibold text-slate-700">New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 border-slate-300 w-4 h-4"
              />
              <span className="font-semibold text-slate-700">Best Seller</span>
            </label>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide frame comfort and lens fitting specifications..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0A2E24] text-white text-xs font-bold hover:bg-[#061e17] cursor-pointer active:scale-95 shadow-xs"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
