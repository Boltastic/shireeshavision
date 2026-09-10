import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  ChevronDown,
  Sparkles,
  Zap,
  Lock,
  Menu,
  X,
  MapPin,
  Truck,
  Phone,
  Calendar,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CategorySlug, Product } from '../types';
import { CLINIC_INFO } from '../data/initialData';

interface NavbarProps {
  cartCount: number;
  cartTotal?: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAppointment: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (cat: CategorySlug) => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  onClearSearchFilters?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal = 0,
  wishlistCount,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onOpenAppointment,
  onOpenTracking,
  onOpenAdmin,
  onSelectCategory,
  products = [],
  onSelectProduct,
  onClearSearchFilters,
}) => {
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Reset highlight index when query changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

  // Close search suggestions / account popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
        setHighlightedIndex(-1);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: { label: string; slug: CategorySlug }[] = [
    { label: 'All Eyewear', slug: 'all' },
    { label: 'Eyeglasses', slug: 'eyeglasses' },
    { label: 'Sunglasses', slug: 'sunglasses' },
    { label: 'Computer & Blue-Cut Glasses', slug: 'computer-glasses' },
    { label: 'Contact Lenses', slug: 'contact-lenses' },
    { label: 'Kids Eyewear', slug: 'kids' },
  ];

  // Live matching products for real-time search suggestions
  const matchingProducts = useMemo(() => {
    if (!searchQuery.trim() || !products.length) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter((p) => {
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchCat = p.categoryName.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchShape = p.specifications?.frameShape?.toLowerCase().includes(q);
        return matchName || matchBrand || matchCat || matchDesc || matchShape;
      })
      .slice(0, 5);
  }, [searchQuery, products]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If escape key pressed, close suggestions
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchFocused(false);
      setHighlightedIndex(-1);
      return;
    }

    if (!matchingProducts.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsSearchFocused(true);
      setHighlightedIndex((prev) =>
        prev < matchingProducts.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsSearchFocused(true);
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : matchingProducts.length - 1
      );
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < matchingProducts.length) {
        e.preventDefault();
        handleSelectSuggestion(matchingProducts[highlightedIndex]);
      }
      // If highlightedIndex is -1, let form submit naturally
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    setHighlightedIndex(-1);
    setMobileMenuOpen(false);
    onSelectCategory('all');
    if (onClearSearchFilters) onClearSearchFilters();
    const catalogEl = document.getElementById('catalogue-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    setIsSearchFocused(false);
    setHighlightedIndex(-1);
    setMobileMenuOpen(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const scrollToDeals = () => {
    const dealsEl = document.getElementById('weekly-deals-section');
    if (dealsEl) {
      dealsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToClinic = () => {
    const clinicEl = document.getElementById('clinic-section');
    if (clinicEl) {
      clinicEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-2xs">
      {/* 1. TOP GREEN ANNOUNCEMENT BAR (Matches image.png) */}
      <div className="bg-[#0A2E24] text-white text-[11px] sm:text-xs py-2 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex-1 text-center">
            <span className="inline-flex items-center gap-1.5 font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Free Computerized Eye Test & Flat 20% Off Your First Frame</span>
              <span
                className="text-amber-400 font-bold ml-1 cursor-pointer hover:underline"
                onClick={onOpenAppointment}
              >
                ⚡ Grab Now! &gt;
              </span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-300 font-medium">
            <button onClick={onOpenTracking} className="hover:text-amber-300 flex items-center gap-1 cursor-pointer">
              <Truck className="w-3 h-3 text-amber-400" />
              Track Order
            </button>
            <span className="text-slate-600">|</span>
            <button onClick={scrollToClinic} className="hover:text-amber-300 flex items-center gap-1 cursor-pointer">
              <MapPin className="w-3 h-3 text-amber-400" />
              Find Store
            </button>
            <span className="text-slate-600">|</span>
            <a href={`tel:${CLINIC_INFO.phone.replace(/\s+/g, '')}`} className="hover:text-amber-300 flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              {CLINIC_INFO.phone}
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Matches image.png structure) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => {
            onSelectCategory('all');
            onSearchChange('');
            if (onClearSearchFilters) onClearSearchFilters();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer flex-shrink-0"
          title="Return to Home"
        >
          <BrandLogo size="md" />
        </div>

        {/* Elongated Pill Search Bar with Yellow/Orange "Search" Button (image.png) */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl mx-4 relative">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center"
          >
            <div className="relative w-full flex items-center bg-white border border-amber-300 hover:border-amber-400 focus-within:border-amber-500 rounded-full p-1 pl-4 transition-all shadow-xs">
              <input
                type="text"
                role="combobox"
                aria-expanded={isSearchFocused && matchingProducts.length > 0}
                aria-autocomplete="list"
                aria-controls="search-suggestions-list"
                aria-activedescendant={
                  highlightedIndex >= 0 && matchingProducts[highlightedIndex]
                    ? `search-suggestion-${matchingProducts[highlightedIndex].id}`
                    : undefined
                }
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search in Product..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none pr-3"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setIsSearchFocused(false);
                    setHighlightedIndex(-1);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1 mr-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-5 sm:px-6 py-2 rounded-full font-semibold text-xs transition-colors shadow-xs cursor-pointer flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Live Search Suggestions Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div
              id="search-suggestions-list"
              role="listbox"
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 z-50 overflow-hidden animate-in fade-in-50 duration-150"
            >
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">
                  Search Results for "{searchQuery}"
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="hidden sm:inline text-[10px] text-slate-400">
                    Use ↑ ↓ to navigate, Enter to select
                  </span>
                  <span className="font-bold text-teal-700">{matchingProducts.length} frames found</span>
                </span>
              </div>

              {matchingProducts.length > 0 ? (
                <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                  {matchingProducts.map((p, idx) => {
                    const isHighlighted = idx === highlightedIndex;
                    return (
                      <div
                        key={p.id}
                        id={`search-suggestion-${p.id}`}
                        role="option"
                        aria-selected={isHighlighted}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        onClick={() => handleSelectSuggestion(p)}
                        className={`px-4 py-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isHighlighted
                            ? 'bg-amber-100/90 text-slate-900 border-l-4 border-l-amber-500 pl-3 font-medium'
                            : 'hover:bg-amber-50/70 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-2">
                              <span>{p.name}</span>
                              {isHighlighted && (
                                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono">
                                  ↵ Select
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <span className="text-teal-700 font-semibold">{p.brand}</span>
                              <span>•</span>
                              <span className="capitalize">{p.categoryName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-black text-slate-900">
                            ₹{p.price.toLocaleString('en-IN')}
                          </div>
                          {p.originalPrice > p.price && (
                            <div className="text-[10px] text-slate-400 line-through">
                              ₹{p.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="p-3 bg-[#F9FAFB] border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1"
                    >
                      <span>View all matching frames in store</span>
                      <span>&rarr;</span>
                    </button>
                    <span className="text-[10px] text-slate-400">Press Enter ↵</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center space-y-2">
                  <p className="text-xs text-slate-600">
                    No frames found for "{searchQuery}".
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400">Try searching:</span>
                    {['Ray-Ban', 'Aviator', 'Blue-Cut', 'Titanium', 'Kids'].map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => {
                          onSearchChange(keyword);
                          setIsSearchFocused(true);
                        }}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 font-medium cursor-pointer"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Header Icons: Wishlist, Cart, Login */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Wishlist Heart with Badge */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-slate-700 hover:text-amber-600 transition-colors cursor-pointer"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#EF4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag with Badge & Total */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 p-1.5 text-slate-700 hover:text-amber-600 transition-colors cursor-pointer"
            title="Cart"
            aria-label="Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#EF4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            {cartTotal > 0 && (
              <span className="hidden sm:inline text-xs font-bold text-slate-900">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          <div ref={accountRef} className="relative hidden sm:block">
            <div
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-amber-600 p-1 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-slate-400">Hello,</span>
                <span className="font-semibold text-xs flex items-center gap-0.5">
                  Account <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </div>

            {/* Account Popover Menu */}
            {isAccountOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in-50 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-bold text-xs text-slate-900">Patient & Customer Portal</div>
                  <div className="text-[10px] text-slate-500">Shireesha 6/6 Vision Care</div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onOpenTracking();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <Truck className="w-4 h-4 text-teal-600" />
                    <span>Track Orders & Lens Cutting</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onOpenAppointment();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Book Clinic Eye Examination</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onOpenWishlist();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>My Saved Frames ({wishlistCount})</span>
                  </button>

                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Store Manager Admin (/admin)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. SECONDARY NAVBAR (Menu Bar matching image.png) */}
      <div className="hidden md:block border-t border-slate-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-semibold text-slate-700">
          {/* Left: "Browse Categories ⌵" Button */}
          <div className="relative">
            <button
              onClick={() => setIsBrowseOpen(!isBrowseOpen)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full flex items-center gap-2 font-semibold transition-colors cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5 text-slate-600" />
              <span>Browse Categories</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {isBrowseOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in-50 duration-150">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      onSelectCategory(cat.slug);
                      setIsBrowseOpen(false);
                      const catEl = document.getElementById('catalogue-section');
                      if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-amber-600 flex items-center justify-between text-xs cursor-pointer font-medium"
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center Links: Shop, Supper Deals, Find Store, What's New, Special Offer, Page */}
          <nav className="flex items-center gap-6">
            <button
              onClick={() => {
                onSelectCategory('all');
                const catEl = document.getElementById('catalogue-section');
                if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Shop <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={scrollToDeals}
              className="hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Super Deals <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={scrollToClinic}
              className="hover:text-amber-600 transition-colors cursor-pointer"
            >
              Find Store
            </button>

            <button
              onClick={() => {
                onSelectCategory('all');
                const featEl = document.getElementById('featured-tabs-section');
                if (featEl) {
                  featEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  const catEl = document.getElementById('catalogue-section');
                  if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              What's New <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={scrollToDeals}
              className="hover:text-amber-600 flex items-center gap-1 text-amber-600 transition-colors cursor-pointer font-bold"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Special Offer
            </button>

            <button
              onClick={scrollToClinic}
              className="hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Clinic Info <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </nav>

          {/* Right: Quick Action Admin & Book Eye Test */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAppointment}
              className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <span>Book Free Eye Test</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Admin Portal (/admin)"
              aria-label="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onKeyDown={handleSearchKeyDown}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsSearchFocused(true);
              }}
              placeholder="Search in Product..."
              className="w-full pl-3 pr-20 py-2.5 bg-slate-50 border border-amber-300 rounded-full text-xs text-slate-800 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#F59E0B] text-white px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Mobile search suggestions */}
          {searchQuery.trim().length > 0 && matchingProducts.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-2 divide-y divide-slate-200 max-h-48 overflow-y-auto">
              {matchingProducts.map((p, idx) => {
                const isHighlighted = idx === highlightedIndex;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectSuggestion(p)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`py-2 px-2 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      isHighlighted ? 'bg-amber-100 font-semibold' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded object-cover bg-white" />
                      <div className="truncate">
                        <div className="font-bold text-slate-900 truncate">{p.name}</div>
                        <div className="text-[10px] text-teal-700">{p.brand}</div>
                      </div>
                    </div>
                    <div className="font-bold text-slate-900">₹{p.price.toLocaleString('en-IN')}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  setMobileMenuOpen(false);
                  const catEl = document.getElementById('catalogue-section');
                  if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-2 bg-slate-50 rounded-lg text-left hover:bg-amber-50 hover:text-amber-700 cursor-pointer"
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAppointment();
              }}
              className="text-emerald-700 font-semibold cursor-pointer"
            >
              Book Eye Test
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="text-slate-600 cursor-pointer flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5 text-amber-500" />
              Track Order
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-slate-500 flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
