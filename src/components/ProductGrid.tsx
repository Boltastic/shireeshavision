import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { CategorySlug, FilterState, Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  selectedCategory: CategorySlug;
  onSelectCategory: (cat: CategorySlug) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  searchQuery: string;
  onClearSearch: () => void;
  activeColorFilter?: string;
  onClearColorFilter?: () => void;
}

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

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  searchQuery,
  onClearSearch,
  activeColorFilter,
  onClearColorFilter,
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter criteria state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: selectedCategory,
    minPrice: 0,
    maxPrice: 10000,
    selectedBrands: [],
    selectedShapes: [],
    selectedMaterials: [],
    selectedGenders: [],
    selectedColors: [],
    inStockOnly: false,
    sortBy: 'popularity',
  });

  // Extract unique brands and shapes from available products
  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);
  }, [products]);

  const availableShapes = useMemo(() => {
    return Array.from(
      new Set(products.map((p) => p.specifications?.frameShape).filter(Boolean))
    );
  }, [products]);

  // Filter & Sort Logic using performSearch
  const filteredProducts = useMemo(() => {
    // 1. Filter products based on searchQuery matching names and descriptions
    const searchedProducts = performSearch(products, searchQuery);

    return searchedProducts
      .filter((product) => {
        // Category
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Active Color Filter from Hero or Filter State
        if (activeColorFilter) {
          const hasColor = product.colors.some(
            (c) => c.hex.toLowerCase() === activeColorFilter.toLowerCase()
          );
          if (!hasColor) return false;
        }

        // Brands
        if (
          filters.selectedBrands.length > 0 &&
          !filters.selectedBrands.includes(product.brand)
        ) {
          return false;
        }

        // Frame Shapes
        if (
          filters.selectedShapes.length > 0 &&
          !filters.selectedShapes.includes(product.specifications?.frameShape)
        ) {
          return false;
        }

        // Price range
        if (product.price < filters.minPrice || product.price > filters.maxPrice) {
          return false;
        }

        // In Stock Only
        if (filters.inStockOnly && !product.inStock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-low') return a.price - b.price;
        if (filters.sortBy === 'price-high') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        // Default Popularity
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, activeColorFilter, filters]);

  const toggleBrand = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand],
    }));
  };

  const toggleShape = (shape: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedShapes: prev.selectedShapes.includes(shape)
        ? prev.selectedShapes.filter((s) => s !== shape)
        : [...prev.selectedShapes, shape],
    }));
  };

  const resetAllFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      minPrice: 0,
      maxPrice: 10000,
      selectedBrands: [],
      selectedShapes: [],
      selectedMaterials: [],
      selectedGenders: [],
      selectedColors: [],
      inStockOnly: false,
      sortBy: 'popularity',
    });
    if (onClearSearch) onClearSearch();
    if (onClearColorFilter) onClearColorFilter();
    onSelectCategory('all');
  };

  const hasActiveFilters =
    filters.selectedBrands.length > 0 ||
    filters.selectedShapes.length > 0 ||
    filters.inStockOnly ||
    filters.maxPrice < 10000 ||
    Boolean(searchQuery) ||
    Boolean(activeColorFilter) ||
    selectedCategory !== 'all';

  return (
    <section id="catalogue-section" className="py-8 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {selectedCategory === 'all'
                ? 'All Eyewear & Lenses'
                : selectedCategory === 'eyeglasses'
                ? 'Prescription Eyeglasses'
                : selectedCategory === 'sunglasses'
                ? 'Polarized & UV Sunglasses'
                : selectedCategory === 'computer-glasses'
                ? 'Blue-Cut Screen Glasses'
                : selectedCategory === 'contact-lenses'
                ? 'Contact Lenses & Care'
                : 'Kids Eyewear'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-bold">
              {filteredProducts.length} frames
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Every frame includes a 1-year clinic warranty and computerized lens fitting check
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative inline-block text-left">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-full text-xs font-semibold text-slate-700 shadow-xs">
              <span className="text-slate-400 font-normal">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
                }
                className="bg-transparent focus:outline-none cursor-pointer font-bold text-slate-800 pr-1"
              >
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Row */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap py-3 border-b border-slate-100">
          <span className="text-xs text-slate-400 font-medium">Applied Filters:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
              "{searchQuery}"
              <button onClick={onClearSearch} className="hover:text-teal-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200">
              {selectedCategory}
              <button onClick={() => onSelectCategory('all')} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeColorFilter && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white"
                style={{ backgroundColor: activeColorFilter }}
              />
              Color Filter
              {onClearColorFilter && (
                <button onClick={onClearColorFilter} className="hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          )}

          {filters.selectedBrands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium"
            >
              {b}
              <button onClick={() => toggleBrand(b)} className="hover:text-slate-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.selectedShapes.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium"
            >
              {s}
              <button onClick={() => toggleShape(s)} className="hover:text-slate-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={resetAllFilters}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 ml-auto cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </button>
        </div>
      )}

      {/* Main Content Layout: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Desktop Filter Sidebar (3 Cols) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 self-start max-h-[calc(100vh-140px)] overflow-y-auto pr-2 no-scrollbar">
          {/* Brand Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Brand & Maker
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center justify-between text-xs font-medium text-slate-700 hover:text-teal-800 cursor-pointer select-none"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded text-teal-600 focus:ring-teal-500 border-slate-300 w-4 h-4"
                    />
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Frame Shape Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Frame Shape
            </h3>
            <div className="space-y-2">
              {availableShapes.map((shape) => (
                <label
                  key={shape}
                  className="flex items-center justify-between text-xs font-medium text-slate-700 hover:text-teal-800 cursor-pointer select-none"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.selectedShapes.includes(shape)}
                      onChange={() => toggleShape(shape)}
                      className="rounded text-teal-600 focus:ring-teal-500 border-slate-300 w-4 h-4"
                    />
                    {shape}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Price Cap
              </h3>
              <span className="text-xs font-bold text-teal-700">
                Up to ₹{filters.maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="200"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>₹1,000</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">In-Stock Only</span>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
              className="rounded text-teal-600 focus:ring-teal-500 border-slate-300 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Clinic Promise Badge */}
          <div className="p-4 rounded-2xl bg-[#0B2A22] border border-emerald-950 text-white text-xs space-y-2 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-teal-300">
              <Sparkles className="w-3.5 h-3.5" />
              6/6 Clinic Guarantee
            </div>
            <p className="text-emerald-100/80 text-[11px] leading-relaxed">
              Every prescription lens is crafted using digital wavefront mapping and inspected on our
              clinical lensometer.
            </p>
          </div>
        </aside>

        {/* Product Cards Grid (9 Cols on desktop) */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No matching frames found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                We couldn't find any frames matching your active filter criteria. Try resetting
                filters or search terms.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 rounded-full bg-[#1E2022] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onSelectProduct={onSelectProduct}
                  onQuickAddToCart={onQuickAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Filter Products</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Brands */}
              <div className="py-4 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Brands
                </h4>
                <div className="space-y-2">
                  {availableBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 text-xs text-slate-700 font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={filters.selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded text-teal-600 focus:ring-teal-500 border-slate-300 w-4 h-4"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

              {/* Shapes */}
              <div className="py-4 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Shapes
                </h4>
                <div className="space-y-2">
                  {availableShapes.map((shape) => (
                    <label
                      key={shape}
                      className="flex items-center gap-2 text-xs text-slate-700 font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={filters.selectedShapes.includes(shape)}
                        onChange={() => toggleShape(shape)}
                        className="rounded text-teal-600 focus:ring-teal-500 border-slate-300 w-4 h-4"
                      />
                      {shape}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="py-4">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500">Max Price:</span>
                  <span className="text-teal-700">₹{filters.maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="200"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full accent-teal-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1E2022] text-white text-xs font-bold"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
