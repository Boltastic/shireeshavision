import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Star,
  ArrowRight,
  ShieldCheck,
  Truck,
  Check,
  ChevronDown,
  Sparkles,
  HelpCircle,
  FileText,
  Upload,
} from 'lucide-react';
import { CartItem, LensTypeOption, Product, ProductColor } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (cartItem: CartItem) => void;
  onDirectBuyNow: (cartItem: CartItem) => void;
  onOpenAppointment: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onDirectBuyNow,
  onOpenAppointment,
}) => {
  if (!product) return null;

  // Selected variant state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Standard', hex: '#1E2022' }
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0] || 'Medium (52mm)'
  );
  const [quantity, setQuantity] = useState<number>(1);

  // Lens customizer state
  const [lensOption, setLensOption] = useState<LensTypeOption>(
    product.category === 'sunglasses' ? 'frame_only' : 'zero_power'
  );
  const [rxMode, setRxMode] = useState<'later' | 'enter' | 'clinic'>('clinic');
  const [rightSph, setRightSph] = useState('0.00');
  const [leftSph, setLeftSph] = useState('0.00');

  // Accordion toggle state
  const [descOpen, setDescOpen] = useState(true);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(true);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lens pricing map
  const lensPricing: Record<LensTypeOption, { label: string; price: number; desc: string }> = {
    zero_power: {
      label: 'Zero Power / Blue Light Cut',
      price: 0,
      desc: 'Blocks 98% digital blue ray fatigue. Ideal for computer work & screens.',
    },
    anti_glare_bluecut: {
      label: 'Anti-Glare Blue-Cut Prescription',
      price: 699,
      desc: 'Computerized anti-reflective coating with precision prescription.',
    },
    single_vision_distance: {
      label: 'Single Vision (Distance)',
      price: 499,
      desc: 'Precision single-vision lenses for driving, walking & daily wear.',
    },
    single_vision_reading: {
      label: 'Single Vision (Reading)',
      price: 499,
      desc: 'Optimal near vision comfort for books, phones & paperwork.',
    },
    progressive_bifocal: {
      label: 'Digital Progressive / Bifocal',
      price: 1499,
      desc: 'Seamless transition between distance and reading without lines.',
    },
    frame_only: {
      label: 'Frame Only (Without Lenses)',
      price: 0,
      desc: 'Supplied with demo/polarized lenses. Fit lenses anywhere.',
    },
  };

  const currentLensPrice = lensPricing[lensOption].price;
  const unitPrice = product.price + currentLensPrice;
  const totalPrice = unitPrice * quantity;

  const buildCartItem = (): CartItem => {
    return {
      cartItemId: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product,
      selectedColor,
      selectedSize,
      lensOption,
      lensPrice: currentLensPrice,
      quantity,
      unitPrice,
      prescriptionDetails: {
        hasPrescriptionLater: rxMode !== 'enter',
        rightEyeSph: rxMode === 'enter' ? rightSph : undefined,
        leftEyeSph: rxMode === 'enter' ? leftSph : undefined,
      },
    };
  };

  const handleAddToCart = () => {
    onAddToCart(buildCartItem());
    onClose();
  };

  const handleBuyNow = () => {
    onDirectBuyNow(buildCartItem());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-[#F9FAFB]">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Store</span>
            <span>/</span>
            <span className="text-teal-700 font-bold capitalize">{product.categoryName}</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close product modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          {/* Main Product Showcase - Reference 1 (WINK) Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Image Gallery Mosaic (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Primary Large Hero View */}
              <div className="relative aspect-[4/3] w-full rounded-3xl bg-[#F6F8FA] border border-slate-200/90 overflow-hidden flex items-center justify-center p-6 shadow-inner">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl drop-shadow-md transition-all duration-300"
                />

                {/* Pill Tag */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-bold text-slate-800 border border-slate-200/80 shadow-xs">
                  {product.specifications?.frameShape || 'Precision Frame'}
                </div>

                {/* Wishlist Icon Button */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-500'
                      : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white'
                  }`}
                  title={isWishlisted ? 'Saved in wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails Row */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square rounded-2xl bg-[#F6F8FA] border overflow-hidden p-1.5 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                          : 'border-slate-200/80 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Configuration & Buy Column (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
              <div>
                {/* Brand & Title */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
                    {product.brand}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    In Stock ({product.stockQuantity} ready)
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#24103B] tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Rating Bar */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                  <span className="text-xs text-slate-500">
                    ({product.reviewCount} customer reviews)
                  </span>
                </div>

                {/* Reference 1 (WINK) Price & Buy Now Banner */}
                <div className="mt-5 p-4 rounded-3xl bg-[#0B2A22] text-white flex items-center justify-between gap-3 shadow-md border border-emerald-950">
                  <div>
                    <div className="text-[11px] text-emerald-200 font-medium">Total Price</div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </div>
                    {product.originalPrice > product.price && (
                      <div className="text-xs text-emerald-300/80 line-through">
                        ₹{(product.originalPrice * quantity).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleBuyNow}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md group cursor-pointer active:scale-95"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Color Selection Swatches */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-700">Select Frame Color:</span>
                      <span className="font-semibold text-teal-700">{selectedColor.name}</span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      {product.colors.map((c, i) => {
                        const isSelected = selectedColor.name === c.name;
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedColor(c)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'border-teal-500 bg-teal-50/70 text-teal-900 ring-2 ring-teal-500/20 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
                            {isSelected && <Check className="w-3 h-3 text-teal-600 ml-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Selector Pills */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-700">Frame Size:</span>
                      <span className="text-[11px] text-teal-700 font-medium">Standard Fit</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {product.sizes.map((sz, i) => {
                        const isSelected = selectedSize === sz;
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedSize(sz)}
                            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#0A2E24] bg-[#0A2E24] text-white shadow-xs'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50 bg-white'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Lens Customizer (Crucial for eyewear!) */}
                <div className="mt-6 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      Choose Your Lens Package
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      Doctor Calibrated
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(Object.keys(lensPricing) as LensTypeOption[]).map((key) => {
                      const item = lensPricing[key];
                      const isSelected = lensOption === key;
                      return (
                        <label
                          key={key}
                          onClick={() => setLensOption(key)}
                          className={`flex items-start justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'border-teal-500 bg-white shadow-xs ring-1 ring-teal-500/30'
                              : 'border-slate-200/80 bg-white/70 hover:bg-white text-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-2 pr-2">
                            <input
                              type="radio"
                              name="lensOption"
                              checked={isSelected}
                              onChange={() => setLensOption(key)}
                              className="mt-0.5 text-teal-600 focus:ring-teal-500"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{item.label}</div>
                              <div className="text-[11px] text-slate-500 leading-snug">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900 whitespace-nowrap text-xs">
                            {item.price === 0 ? 'Included' : `+₹${item.price}`}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Prescription Mode Selector if powered lens */}
                  {lensOption !== 'zero_power' && lensOption !== 'frame_only' && (
                    <div className="pt-2 border-t border-slate-200/80 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Prescription Power Option:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setRxMode('clinic')}
                          className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                            rxMode === 'clinic'
                              ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          Free Test At Clinic
                        </button>
                        <button
                          type="button"
                          onClick={() => setRxMode('later')}
                          className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                            rxMode === 'later'
                              ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          Send via WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => setRxMode('enter')}
                          className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                            rxMode === 'enter'
                              ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          Enter SPH Now
                        </button>
                      </div>

                      {rxMode === 'enter' && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500">
                              Right Eye (OD) SPH
                            </label>
                            <input
                              type="text"
                              value={rightSph}
                              onChange={(e) => setRightSph(e.target.value)}
                              placeholder="-1.25"
                              className="w-full text-xs p-1.5 border border-slate-300 rounded-lg bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500">
                              Left Eye (OS) SPH
                            </label>
                            <input
                              type="text"
                              value={leftSph}
                              onChange={(e) => setLeftSph(e.target.value)}
                              placeholder="-1.50"
                              className="w-full text-xs p-1.5 border border-slate-300 rounded-lg bg-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quantity & Add to Cart Controls */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-full bg-white px-2 py-1 shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-5 rounded-full border border-[#0A2E24] bg-white hover:bg-emerald-50/40 text-[#0A2E24] font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Accordions (Reference 1 Style) */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            {/* Description Accordion */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setDescOpen(!descOpen)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span>Product Description</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    descOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {descOpen && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {product.description}
                </div>
              )}
            </div>

            {/* Specifications Accordion */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setSpecsOpen(!specsOpen)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span>Frame Specifications & Dimensions</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    specsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {specsOpen && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px] font-bold">MATERIAL</span>
                      <span className="font-semibold text-slate-800">
                        {product.specifications?.frameMaterial}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px] font-bold">DIMENSIONS</span>
                      <span className="font-semibold text-slate-800">
                        {product.specifications?.frameDimensions || '52-18-142 mm'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px] font-bold">SHAPE</span>
                      <span className="font-semibold text-slate-800">
                        {product.specifications?.frameShape}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px] font-bold">WEIGHT</span>
                      <span className="font-semibold text-slate-800">
                        {product.specifications?.weight}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px] font-bold">GENDER</span>
                      <span className="font-semibold text-slate-800">
                        {product.specifications?.gender}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px] font-bold">WARRANTY</span>
                      <span className="font-semibold text-slate-800">
                        {product.specifications?.warranty}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping & Clinic Guarantee */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setShippingOpen(!shippingOpen)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span>Delivery & In-Clinic Services</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    shippingOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {shippingOpen && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-teal-600" />
                    <span>
                      Free Express Delivery across India (2-4 business days) or same-day pickup at
                      Shireesha 6/6 Vision Care Center.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span>
                      Free lifetime nosepad replacement, frame realignment, and ultrasonic cleaning
                      at our clinic.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Reviews Section (Reference 1 Style) */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Patient & Customer Reviews</h3>
                <p className="text-xs text-slate-500">
                  Real verified testimonials from Shireesha 6/6 Vision Care clients
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating} / 5.0
              </div>
            </div>

            <div className="space-y-3">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                        {rev.verified && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No reviews yet for this frame.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
