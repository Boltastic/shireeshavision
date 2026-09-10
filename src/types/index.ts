export type CategorySlug =
  | 'all'
  | 'eyeglasses'
  | 'sunglasses'
  | 'contact-lenses'
  | 'kids'
  | 'computer-glasses';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
  verified: boolean;
}

export interface ProductSpecifications {
  frameDimensions?: string; // e.g. "51-18-142 mm"
  lensWidth?: number; // in mm
  bridgeWidth?: number; // in mm
  templeLength?: number; // in mm
  frameMaterial: string; // e.g. "Premium Italian Acetate", "Ultralight Titanium", "TR90 Flexible"
  frameShape: 'Rectangle' | 'Round' | 'Aviator' | 'Cat-Eye' | 'Geometric' | 'Square' | 'Browline';
  frameType: 'Full-Rim' | 'Half-Rim' | 'Rimless';
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  weight: string; // e.g. "18 grams"
  warranty: string; // e.g. "1 Year Comprehensive Warranty"
  prescriptionCompatible: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategorySlug;
  categoryName: string;
  price: number; // in INR / local currency
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[]; // e.g. ["Narrow (49mm)", "Medium (52mm)", "Wide (55mm)"]
  stockQuantity: number;
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  description: string;
  specifications: ProductSpecifications;
  reviews: ProductReview[];
}

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  badge?: string;
  itemCount: number;
  isActive: boolean;
}

export type LensTypeOption =
  | 'zero_power' // Blue Light & UV Protection (0 power)
  | 'anti_glare_bluecut' // Single vision with computerized anti-reflective
  | 'single_vision_distance' // Distance prescription
  | 'single_vision_reading' // Reading prescription
  | 'progressive_bifocal' // Bifocal / Multi-focal
  | 'frame_only'; // Frame only without prescription lenses

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  lensOption: LensTypeOption;
  lensPrice: number;
  prescriptionDetails?: {
    uploadedPrescriptionUrl?: string;
    hasPrescriptionLater: boolean;
    rightEyeSph?: string;
    leftEyeSph?: string;
    rightEyeCyl?: string;
    leftEyeCyl?: string;
  };
  quantity: number;
  unitPrice: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  date: string;
  note: string;
}

export interface Order {
  id: string;
  date: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'cod' | 'upi_card' | 'pay_at_clinic';
  paymentStatus: 'Paid' | 'Pending at Delivery/Clinic';
  orderStatus: OrderStatus;
  trackingNumber: string;
  statusHistory: OrderStatusHistoryItem[];
}

export interface ClinicAppointment {
  id: string;
  patientName: string;
  phone: string;
  email?: string;
  date: string;
  timeSlot: string;
  serviceType:
    | 'Computerised Eye Examination'
    | 'Prescription & Power Check'
    | 'Contact Lens Trial & Fitting'
    | 'Children Vision Care'
    | 'Frame Styling Consultation';
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  category: CategorySlug;
  minPrice: number;
  maxPrice: number;
  selectedBrands: string[];
  selectedShapes: string[];
  selectedMaterials: string[];
  selectedGenders: string[];
  selectedColors: string[];
  inStockOnly: boolean;
  sortBy: 'popularity' | 'price-low' | 'price-high' | 'rating' | 'newest';
}
