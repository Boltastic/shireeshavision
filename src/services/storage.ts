import {
  Category,
  CartItem,
  ClinicAppointment,
  Order,
  OrderStatus,
  Product,
} from '../types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'shireesha_products_v1',
  CATEGORIES: 'shireesha_categories_v1',
  ORDERS: 'shireesha_orders_v1',
  CART: 'shireesha_cart_v1',
  WISHLIST: 'shireesha_wishlist_v1',
  APPOINTMENTS: 'shireesha_appointments_v1',
};

type Listener<T> = (data: T) => void;

class StorageService {
  private productListeners: Listener<Product[]>[] = [];
  private orderListeners: Listener<Order[]>[] = [];
  private cartListeners: Listener<CartItem[]>[] = [];
  private wishlistListeners: Listener<string[]>[] = [];
  private categoryListeners: Listener<Category[]>[] = [];
  private appointmentListeners: Listener<ClinicAppointment[]>[] = [];

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
    }
  }

  // General subscribe for all updates
  private allListeners: Array<() => void> = [];

  subscribe(listener: () => void) {
    this.allListeners.push(listener);
    return () => {
      this.allListeners = this.allListeners.filter((l) => l !== listener);
    };
  }

  private notifyAll() {
    this.allListeners.forEach((fn) => fn());
  }

  // ---- PRODUCTS ----
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) return INITIAL_PRODUCTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  saveProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.productListeners.forEach((fn) => fn(products));
    this.notifyAll();
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    const updated = [newProduct, ...products];
    this.saveProducts(updated);
    return newProduct;
  }

  updateProduct(product: Product): Product {
    const products = this.getProducts();
    const updated = products.map((p) => (p.id === product.id ? product : p));
    this.saveProducts(updated);
    return product;
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const updated = products.filter((p) => p.id !== id);
    this.saveProducts(updated);
    return true;
  }

  subscribeProducts(listener: Listener<Product[]>) {
    this.productListeners.push(listener);
    return () => {
      this.productListeners = this.productListeners.filter((l) => l !== listener);
    };
  }

  // ---- CATEGORIES ----
  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) return INITIAL_CATEGORIES;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  saveCategories(categories: Category[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.categoryListeners.forEach((fn) => fn(categories));
    this.notifyAll();
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    const updated = [...categories, newCat];
    this.saveCategories(updated);
    return newCat;
  }

  updateCategory(category: Category): Category {
    const categories = this.getCategories();
    const updated = categories.map((c) => (c.id === category.id ? category : c));
    this.saveCategories(updated);
    return category;
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const updated = categories.filter((c) => c.id !== id);
    this.saveCategories(updated);
    return true;
  }

  subscribeCategories(listener: Listener<Category[]>) {
    this.categoryListeners.push(listener);
    return () => {
      this.categoryListeners = this.categoryListeners.filter((l) => l !== listener);
    };
  }

  // ---- ORDERS ----
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) return INITIAL_ORDERS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  }

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find(
      (o) =>
        o.id.toLowerCase() === id.trim().toLowerCase() ||
        o.trackingNumber.toLowerCase() === id.trim().toLowerCase() ||
        o.customer.phone.includes(id.trim())
    );
  }

  saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.orderListeners.forEach((fn) => fn(orders));
    this.notifyAll();
  }

  createOrder(order: Order): Order {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    this.saveOrders(updated);
    return order;
  }

  addOrder(order: Omit<Order, 'id' | 'date' | 'trackingNumber' | 'statusHistory'>): Order {
    const orders = this.getOrders();
    const orderId = `SH66-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `DEL-66-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...order,
      id: orderId,
      date: new Date().toISOString(),
      trackingNumber,
      statusHistory: [
        {
          status: 'Pending',
          date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          note: 'Order submitted online. Awaiting clinic verification.',
        },
      ],
    };
    const updated = [newOrder, ...orders];
    this.saveOrders(updated);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      note: note || `Order marked as ${status} by Shireesha 6/6 Vision Care team.`,
    });

    this.saveOrders([...orders]);
    return order;
  }

  subscribeOrders(listener: Listener<Order[]>) {
    this.orderListeners.push(listener);
    return () => {
      this.orderListeners = this.orderListeners.filter((l) => l !== listener);
    };
  }

  // ---- CART ----
  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveCart(cart: CartItem[]) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.cartListeners.forEach((fn) => fn(cart));
    this.notifyAll();
  }

  addToCart(item: CartItem): CartItem[] {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      (ci) =>
        ci.product.id === item.product.id &&
        ci.selectedColor.name === item.selectedColor.name &&
        ci.selectedSize === item.selectedSize &&
        ci.lensOption === item.lensOption
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    this.saveCart(cart);
    return cart;
  }

  updateCartQuantity(cartItemId: string, quantity: number): CartItem[] {
    const cart = this.getCart();
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }
    const updated = cart.map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    );
    this.saveCart(updated);
    return updated;
  }

  removeFromCart(cartItemId: string): CartItem[] {
    const cart = this.getCart();
    const updated = cart.filter((item) => item.cartItemId !== cartItemId);
    this.saveCart(updated);
    return updated;
  }

  clearCart() {
    this.saveCart([]);
  }

  subscribeCart(listener: Listener<CartItem[]>) {
    this.cartListeners.push(listener);
    return () => {
      this.cartListeners = this.cartListeners.filter((l) => l !== listener);
    };
  }

  // ---- WISHLIST ----
  getWishlist(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
    this.wishlistListeners.forEach((fn) => fn(updated));
    this.notifyAll();
    return !exists;
  }

  subscribeWishlist(listener: Listener<string[]>) {
    this.wishlistListeners.push(listener);
    return () => {
      this.wishlistListeners = this.wishlistListeners.filter((l) => l !== listener);
    };
  }

  // ---- APPOINTMENTS ----
  getAppointments(): ClinicAppointment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (!data) return INITIAL_APPOINTMENTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  }

  saveAppointments(appointments: ClinicAppointment[]) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    this.appointmentListeners.forEach((fn) => fn(appointments));
    this.notifyAll();
  }

  addAppointment(
    appointment: Omit<ClinicAppointment, 'id' | 'status' | 'createdAt'>
  ): ClinicAppointment {
    const appointments = this.getAppointments();
    const newApt: ClinicAppointment = {
      ...appointment,
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    const updated = [newApt, ...appointments];
    this.saveAppointments(updated);
    return newApt;
  }

  updateAppointmentStatus(id: string, status: 'Confirmed' | 'Completed' | 'Cancelled') {
    const appointments = this.getAppointments();
    const updated = appointments.map((a) => (a.id === id ? { ...a, status } : a));
    this.saveAppointments(updated);
  }

  subscribeAppointments(listener: Listener<ClinicAppointment[]>) {
    this.appointmentListeners.push(listener);
    return () => {
      this.appointmentListeners = this.appointmentListeners.filter((l) => l !== listener);
    };
  }

  // Reset demo data back to authentic catalogue
  resetToInitial() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    this.productListeners.forEach((fn) => fn(INITIAL_PRODUCTS));
    this.categoryListeners.forEach((fn) => fn(INITIAL_CATEGORIES));
    this.orderListeners.forEach((fn) => fn(INITIAL_ORDERS));
    this.appointmentListeners.forEach((fn) => fn(INITIAL_APPOINTMENTS));
  }
}

export const storage = new StorageService();
