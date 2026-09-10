import React, { useState, useEffect, useMemo } from 'react';
import { storage } from './services/storage';
import { Product, Category, CategorySlug, CartItem, Order, ClinicAppointment } from './types';

// Component Imports
import { Navbar } from './components/Navbar';
import { HeroBento } from './components/HeroBento';
import { WeeklyDealsSection } from './components/WeeklyDealsSection';
import { ShopByCategoryCircles } from './components/ShopByCategoryCircles';
import { PopularProductsSection } from './components/PopularProductsSection';
import { PromoWideBanner } from './components/PromoWideBanner';
import { FeaturedTabsSection } from './components/FeaturedTabsSection';
import { AppDownloadBanner } from './components/AppDownloadBanner';
import { ProductGrid } from './components/ProductGrid';
import { ClinicSection } from './components/ClinicSection';
import { LatestNewsSection } from './components/LatestNewsSection';
import { Footer } from './components/Footer';

// Modals
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AppointmentModal } from './components/AppointmentModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { WishlistModal } from './components/WishlistModal';
import { AdminPanel } from './components/AdminPanel';

/**
 * Filters the products state based on the searchQuery string to match
 * product names and descriptions, ensuring the UI updates dynamically as the user types.
 */
export const performSearch = (productsList: Product[], query: string): Product[] => {
  if (!query || !query.trim()) {
    return productsList;
  }
  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

  return productsList.filter((product) => {
    const name = (product.name || '').toLowerCase();
    const description = (product.description || '').toLowerCase();
    const brand = (product.brand || '').toLowerCase();
    const categoryName = (product.categoryName || product.category || '').toLowerCase();

    // Direct match for product name or description
    if (name.includes(cleanQuery) || description.includes(cleanQuery)) {
      return true;
    }

    // Match all tokens across name, description, brand, and category
    const combinedText = `${name} ${description} ${brand} ${categoryName} ${product.specifications?.frameShape || ''} ${product.specifications?.frameMaterial || ''}`.toLowerCase();
    return queryTokens.every((token) => combinedText.includes(token));
  });
};

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<ClinicAppointment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeColorFilter, setActiveColorFilter] = useState<string | undefined>();

  // Dynamically filtered products as the user types
  const searchedProducts = useMemo(() => {
    return performSearch(products, searchQuery);
  }, [products, searchQuery]);

  // Modals & Drawers state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data and reactive subscription
  useEffect(() => {
    const updateLocalState = () => {
      setProducts(storage.getProducts());
      setCategories(storage.getCategories());
      setCart(storage.getCart());
      setWishlist(storage.getWishlist());
      setOrders(storage.getOrders());
      setAppointments(storage.getAppointments());
    };

    updateLocalState();
    const unsubscribe = storage.subscribe(updateLocalState);
    return () => unsubscribe();
  }, []);

  // Check URL hash for direct admin routing
  useEffect(() => {
    const checkAdminRoute = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setIsAdminOpen(true);
      }
    };
    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, []);

  // Global Escape key listener to close active modals in reverse hierarchy order
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmedOrder) {
          setConfirmedOrder(null);
          return;
        }
        if (isCheckoutOpen) {
          setIsCheckoutOpen(false);
          return;
        }
        if (selectedProduct) {
          setSelectedProduct(null);
          return;
        }
        if (isCartOpen) {
          setIsCartOpen(false);
          return;
        }
        if (isAppointmentOpen) {
          setIsAppointmentOpen(false);
          return;
        }
        if (isTrackingOpen) {
          setIsTrackingOpen(false);
          return;
        }
        if (isWishlistOpen) {
          setIsWishlistOpen(false);
          return;
        }
        if (isAdminOpen) {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', ' ');
          }
          return;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    confirmedOrder,
    isCheckoutOpen,
    selectedProduct,
    isCartOpen,
    isAppointmentOpen,
    isTrackingOpen,
    isWishlistOpen,
    isAdminOpen,
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const scrollToCatalogue = () => {
    const el = document.getElementById('catalogue-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (slug: CategorySlug) => {
    setSelectedCategory(slug);
    scrollToCatalogue();
  };

  const handleToggleWishlist = (productId: string) => {
    const isSaved = storage.toggleWishlist(productId);
    showToast(isSaved ? 'Frame saved to wishlist' : 'Removed from wishlist');
  };

  const handleAddToCart = (item: CartItem) => {
    storage.addToCart(item);
    showToast(`Added "${item.product.name}" to cart`);
  };

  const handleQuickAddToCart = (product: Product) => {
    const defaultColor = product.colors[0] || { name: 'Standard', hex: '#1E2022' };
    const defaultSize = product.sizes[0] || 'Medium (52mm)';
    const item: CartItem = {
      cartItemId: `quick-${Date.now()}-${product.id}`,
      product,
      selectedColor: defaultColor,
      selectedSize: defaultSize,
      lensOption: product.category === 'sunglasses' ? 'frame_only' : 'zero_power',
      lensPrice: 0,
      quantity: 1,
      unitPrice: product.price,
      prescriptionDetails: { hasPrescriptionLater: true },
    };
    storage.addToCart(item);
    setIsCartOpen(true);
  };

  const handleDirectBuyNow = (item: CartItem) => {
    storage.addToCart(item);
    setAppliedDiscount(0);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    storage.createOrder(newOrder);
    storage.clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setConfirmedOrder(newOrder);
  };

  const handleOpenTrackingWithId = (id: string) => {
    setConfirmedOrder(null);
    setTrackOrderId(id);
    setIsTrackingOpen(true);
  };

  const cartTotalAmount = (cart || []).reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen bg-[#FCFDFE] text-slate-900 font-sans antialiased flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E2022] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Top Green Bar, Search, and Menu (Matching image.png) */}
      <Navbar
        cartCount={(cart || []).reduce((sum, item) => sum + (item.quantity || 1), 0)}
        cartTotal={cartTotalAmount}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
        onOpenTracking={() => {
          setTrackOrderId('');
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={handleSelectCategory}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onClearSearchFilters={() => setActiveColorFilter(undefined)}
      />

      <main className="flex-1">
        {/* 2. Hero Bento 4-Box Grid (Matching image.png) */}
        <HeroBento
          featuredProducts={products}
          onSelectCategory={handleSelectCategory}
          onExploreAll={scrollToCatalogue}
          onOpenAppointment={() => setIsAppointmentOpen(true)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onFilterByColor={(hex) => {
            setActiveColorFilter(hex);
            scrollToCatalogue();
          }}
        />

        {/* 3. Weekly Best Deals (Matching image.png deep green card, countdown, 5 cards + 3 banners) */}
        <WeeklyDealsSection
          products={products}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAddToCart={handleQuickAddToCart}
          onSelectCategory={handleSelectCategory}
        />

        {/* 4. Shop Deals by Category (Matching image.png circular cards) */}
        <ShopByCategoryCircles
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onOpenAppointment={() => setIsAppointmentOpen(true)}
        />

        {/* 5. Popular Products (Matching image.png 5-column grid with Load More) */}
        <PopularProductsSection
          products={products}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAddToCart={handleQuickAddToCart}
        />

        {/* 6. Middle Wide Promo Banner (Matching image.png) */}
        <PromoWideBanner
          onSelectCategory={handleSelectCategory}
          onOpenAppointment={() => setIsAppointmentOpen(true)}
        />

        {/* 7. New Arrivals / Best Seller / Best Offers with Left Promo Card (Matching image.png) */}
        <FeaturedTabsSection
          products={products}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAddToCart={handleQuickAddToCart}
          onExploreAll={scrollToCatalogue}
        />

        {/* 8. App & Direct Clinic Booking Banner (Matching image.png phone mockups) */}
        <AppDownloadBanner onOpenAppointment={() => setIsAppointmentOpen(true)} />

        {/* 9. Complete Product Catalogue with Live Filtering */}
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAddToCart={handleQuickAddToCart}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          activeColorFilter={activeColorFilter}
          onClearColorFilter={() => setActiveColorFilter(undefined)}
        />

        {/* 10. Clinic Doctor Profile & Refraction Machine Section */}
        <ClinicSection onOpenAppointment={() => setIsAppointmentOpen(true)} />

        {/* 11. Latest News & Clinical Guides (Matching image.png) */}
        <LatestNewsSection onOpenAppointment={() => setIsAppointmentOpen(true)} />
      </main>

      {/* 12. Footer with 4 Perks & Newsletter (Matching image.png) */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
        onOpenOrderTracking={() => {
          setTrackOrderId('');
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* MODALS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleDirectBuyNow}
        onOpenAppointment={() => {
          setSelectedProduct(null);
          setIsAppointmentOpen(true);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart || []}
        cartItems={cart || []}
        onUpdateQuantity={(itemId, qty) => storage.updateCartQuantity(itemId, qty)}
        onRemoveItem={(itemId) => storage.removeFromCart(itemId)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenAppointment={() => {
          setIsCartOpen(false);
          setIsAppointmentOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart || []}
        cartItems={cart || []}
        initialDiscount={appliedDiscount}
        onOrderSuccess={handleOrderPlaced}
      />

      {confirmedOrder && (
        <OrderSuccessModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          onTrackOrder={handleOpenTrackingWithId}
        />
      )}

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        onBookSuccess={() => showToast('Eye examination booked successfully!')}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        initialOrderId={trackOrderId}
        onClose={() => setIsTrackingOpen(false)}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        allProducts={products}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => {
          setIsWishlistOpen(false);
          setSelectedProduct(p);
        }}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', ' ');
          }
        }}
        products={products}
        categories={categories}
        orders={orders}
        appointments={appointments}
      />
    </div>
  );
};

export default App;
