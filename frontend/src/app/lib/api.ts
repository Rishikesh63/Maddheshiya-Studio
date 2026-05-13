const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    next: { revalidate: 60 },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

// ── Portfolio ────────────────────────────────────────────────────────────────

export interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
}

export interface PortfolioGalleryImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  category: PortfolioCategory;
  thumbnail: string;
  gallery: string | null;
  video_url: string | null;
  client_name: string;
  location: string;
  description: string;
  service_type: string;
  featured: boolean;
  status: string;
  gallery_images: PortfolioGalleryImage[];
  published_at: string;
}

export function getPortfolioItems(params?: {
  category?: string;
  featured?: boolean;
}): Promise<PortfolioItem[]> {
  const q = new URLSearchParams();
  if (params?.category) q.set('category', params.category);
  if (params?.featured) q.set('featured', 'true');
  return apiFetch(`/api/portfolio/items/?${q}`);
}

export function getPortfolioItem(slug: string): Promise<PortfolioItem> {
  return apiFetch(`/api/portfolio/items/${slug}/`);
}

export function getPortfolioCategories(): Promise<PortfolioCategory[]> {
  return apiFetch('/api/portfolio/categories/');
}

// ── Services ─────────────────────────────────────────────────────────────────

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  image: string | null;
  order: number;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  short_description: string;
  hero_image: string;
  icon: string | null;
  status: string;
  featured: boolean;
  order: number;
}

export function getServices(params?: {
  category?: string;
  featured?: boolean;
}): Promise<Service[]> {
  const q = new URLSearchParams();
  if (params?.category) q.set('category', params.category);
  if (params?.featured) q.set('featured', 'true');
  return apiFetch(`/api/portfolio/services/?${q}`);
}

// ── Bookings ─────────────────────────────────────────────────────────────────

export interface Location {
  id: number;
  name: string;
  slug: string;
  state: string;
  travel_charge: string;
  description: string;
}

export interface Package {
  id: number;
  name: string;
  slug: string;
  service_type: string;
  service_type_display: string;
  description: string;
  price: string;
  duration_hours: number;
  inclusions: string;
  inclusions_list: string[];
  advance_required: string;
  featured: boolean;
  order: number;
}

export interface AvailabilitySlot {
  id: number;
  date: string;
  location: Location;
  status: 'available' | 'booked' | 'limited' | 'blocked';
  max_slots: number;
  booked_slots: number;
  available_slots: number;
  is_available: boolean;
  notes: string;
}

export interface BookingPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_type: string;
  event_date: string;
  event_time?: string;
  location: number;
  venue_name?: string;
  venue_address?: string;
  package: number;
  guest_count?: number;
  notes?: string;
}

export interface BookingConfirmation {
  booking_id: string;
  customer_name: string;
  customer_email: string;
  event_date: string;
  location: Location;
  package: Package;
  total_amount: string;
  advance_amount: string;
  status: string;
}

export function getLocations(): Promise<Location[]> {
  return apiFetch('/api/bookings/locations/');
}

export function getPackages(serviceType?: string): Promise<Package[]> {
  const q = new URLSearchParams();
  if (serviceType) q.set('service_type', serviceType);
  return apiFetch(`/api/bookings/packages/?${q}`);
}

export function getAvailability(month: string, location?: string): Promise<AvailabilitySlot[]> {
  const q = new URLSearchParams({ month });
  if (location) q.set('location', location);
  return apiFetch(`/api/bookings/availability/?${q}`);
}

export async function createBooking(payload: BookingPayload): Promise<BookingConfirmation> {
  const res = await fetch(apiUrl('/api/bookings/bookings/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}

// ── Products ─────────────────────────────────────────────────────────────────

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  category_type: 'digital' | 'printing';
  description: string;
  icon: string | null;
  image: string | null;
  order: number;
}

export interface ProductSample {
  id: number;
  image: string;
  title: string;
  description: string;
  order: number;
}

export interface ProductFeature {
  id: number;
  feature_name: string;
  feature_value: string;
  order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  short_description: string;
  thumbnail: string;
  hero_image: string | null;
  price: string;
  discount_price: string | null;
  current_price: string;
  has_discount: boolean;
  discount_percentage: number;
  status: string;
  delivery_timeframe: string;
  customization_available: boolean;
  customization_options_list: string[];
  featured: boolean;
  samples?: ProductSample[];
  features?: ProductFeature[];
}

export function getProducts(params?: {
  category?: string;
  category_type?: string;
  featured?: boolean;
}): Promise<Product[]> {
  const q = new URLSearchParams();
  if (params?.category) q.set('category', params.category);
  if (params?.category_type) q.set('category_type', params.category_type);
  if (params?.featured) q.set('featured', 'true');
  return apiFetch(`/api/products/products/?${q}`);
}

export function getProduct(slug: string): Promise<Product> {
  return apiFetch(`/api/products/products/${slug}/`);
}

export function getProductCategories(categoryType?: string): Promise<ProductCategory[]> {
  const q = new URLSearchParams();
  if (categoryType) q.set('category_type', categoryType);
  return apiFetch(`/api/products/categories/?${q}`);
}
