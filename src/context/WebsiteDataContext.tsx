import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, ChooseFeature, InstagramPost } from '../types';

export interface HeroData {
  bgImage: string;
  pizzaImage: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  ratingValue: string;
  ratingReviews: string;
  buttonText?: string;
  buttonLink?: string;
  overlayOpacity?: number;
  alignment?: string;
  isPublished?: boolean;
}

export interface AboutData {
  title: string;
  subtitle: string;
  paragraph1: string;
  paragraph2: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  image: string;
  badge: string;
  cardTitle: string;
  cardDescription: string;
}

export interface ContactData {
  address: string;
  phone: string;
  email: string;
  website: string;
  hoursWeekdays: string;
  hoursWeekends: string;
  whatsapp?: string;
  mapsUrl?: string;
}

export interface NavbarData {
  logoText: string;
  logoColor: string;
  logoSize: string;
  logoType?: 'text' | 'image';
  logoImage?: string;
  sticky: boolean;
  transparent: boolean;
  ctaText: string;
  ctaLink: string;
  navLinks: { name: string; id: string; href: string }[];
}

export interface FooterData {
  logoText: string;
  description: string;
  copyright: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  extraNotes?: string;
  createdAt?: string;
}

export interface RestaurantEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  price: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}

export interface SystemSettings {
  siteName: string;
  currency: string;
  taxRate: number;
  enableReservations: boolean;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  size: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  email: string;
  action: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface WebsiteDataContextType {
  // States
  menuItems: MenuItem[];
  heroData: HeroData;
  aboutData: AboutData;
  contactData: ContactData;
  chooseFeatures: ChooseFeature[];
  instagramPosts: InstagramPost[];
  navbarData: NavbarData | null;
  footerData: FooterData | null;
  menuCategories: MenuCategory[];
  reservations: Reservation[];
  events: RestaurantEvent[];
  testimonials: Testimonial[];
  settings: SystemSettings | null;
  seo: SEOSettings | null;
  mediaList: MediaFile[];
  activityLogs: ActivityLog[];
  usersList: UserProfile[];

  // Auth States
  token: string | null;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchUsers: () => Promise<void>;
  createUser: (userData: any) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;

  // REST API updating Actions
  updateHeroData: (data: Partial<HeroData>) => Promise<boolean>;
  updateNavbarData: (data: Partial<NavbarData>) => Promise<boolean>;
  updateAboutData: (data: Partial<AboutData>) => Promise<boolean>;
  updateContactData: (data: Partial<ContactData>) => Promise<boolean>;
  updateFooterData: (data: Partial<FooterData>) => Promise<boolean>;
  
  // Features Actions
  addFeature: (feature: Omit<ChooseFeature, 'id'>) => Promise<boolean>;
  updateChooseFeature: (id: string, updatedFeature: Partial<ChooseFeature>) => Promise<boolean>;
  deleteFeature: (id: string) => Promise<boolean>;

  // Menu Category Actions
  addCategory: (category: Omit<MenuCategory, 'id'>) => Promise<boolean>;
  updateCategory: (id: string, data: Partial<MenuCategory>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Menu Items Actions
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<boolean>;
  updateMenuItem: (id: string, updatedItem: Partial<MenuItem>) => Promise<boolean>;
  deleteMenuItem: (id: string) => Promise<boolean>;

  // Instagram Actions
  addInstagramPost: (post: Omit<InstagramPost, 'id'>) => Promise<boolean>;
  updateInstagramPost: (id: string, updatedPost: Partial<InstagramPost>) => Promise<boolean>;
  deleteInstagramPost: (id: string) => Promise<boolean>;

  // Reservation Actions
  createReservation: (resData: Omit<Reservation, 'id'>) => Promise<boolean>;
  updateReservationStatus: (id: string, status: string) => Promise<boolean>;
  deleteReservation: (id: string) => Promise<boolean>;

  // Events Actions
  addEvent: (event: Omit<RestaurantEvent, 'id'>) => Promise<boolean>;
  updateEvent: (id: string, data: Partial<RestaurantEvent>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;

  // Testimonials Actions
  addTestimonial: (test: Omit<Testimonial, 'id'>) => Promise<boolean>;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;

  // Settings & SEO Actions
  updateSettings: (data: Partial<SystemSettings>) => Promise<boolean>;
  updateSEO: (data: Partial<SEOSettings>) => Promise<boolean>;

  // Media Library Actions
  fetchMedia: () => Promise<void>;
  uploadMediaFile: (file: File) => Promise<MediaFile | null>;
  deleteMediaFile: (filename: string) => Promise<boolean>;

  // General Actions
  refreshAllData: () => Promise<void>;
  resetToDefaults: () => Promise<boolean>;
}

const WebsiteDataContext = createContext<WebsiteDataContextType | undefined>(undefined);

export const WebsiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Core CMS states
  const [heroData, setHeroData] = useState<HeroData>({
    bgImage: '',
    pizzaImage: '',
    titleLine1: '',
    titleLine2: '',
    titleLine3: '',
    description: '',
    ratingValue: '',
    ratingReviews: ''
  });
  const [navbarData, setNavbarData] = useState<NavbarData | null>(null);
  const [aboutData, setAboutData] = useState<AboutData>({
    title: '',
    subtitle: '',
    paragraph1: '',
    paragraph2: '',
    stat1Value: '',
    stat1Label: '',
    stat2Value: '',
    stat2Label: '',
    stat3Value: '',
    stat3Label: '',
    image: '',
    badge: '',
    cardTitle: '',
    cardDescription: ''
  });
  const [contactData, setContactData] = useState<ContactData>({
    address: '',
    phone: '',
    email: '',
    website: '',
    hoursWeekdays: '',
    hoursWeekends: ''
  });
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [chooseFeatures, setChooseFeatures] = useState<ChooseFeature[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [events, setEvents] = useState<RestaurantEvent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [seo, setSeo] = useState<SEOSettings | null>(null);
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  // Auth states
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mb_admin_jwt'));
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mb_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const isAuthenticated = !!token;

  // Fetch Headers Helper
  const getHeaders = () => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Auth Operations
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Invalid credentials');
      }
      const data = await res.json();
      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('mb_admin_jwt', data.token);
      localStorage.setItem('mb_admin_user', JSON.stringify(data.user));
      // For compatibility with any legacy code looking at Pinot
      localStorage.setItem('mb_admin_authenticated', 'true');
      
      // Load user dependent data
      await refreshAllData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('mb_admin_jwt');
    localStorage.removeItem('mb_admin_user');
    localStorage.removeItem('mb_admin_authenticated');
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const createUser = async (userData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        await fetchUsers();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error creating user:', err);
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        await fetchUsers();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting user:', err);
      return false;
    }
  };

  // Dynamic Data Load Function
  const refreshAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        heroRes,
        navbarRes,
        aboutRes,
        featuresRes,
        categoriesRes,
        itemsRes,
        igRes,
        contactRes,
        footerRes,
        eventsRes,
        testimonialsRes,
        settingsRes,
        seoRes
      ] = await Promise.all([
        fetch('/api/hero'),
        fetch('/api/navbar'),
        fetch('/api/about'),
        fetch('/api/features'),
        fetch('/api/menu/categories'),
        fetch('/api/menu/items'),
        fetch('/api/instagram'),
        fetch('/api/contact'),
        fetch('/api/footer'),
        fetch('/api/events'),
        fetch('/api/testimonials'),
        fetch('/api/settings'),
        fetch('/api/seo')
      ]);

      if (heroRes.ok) setHeroData(await heroRes.json());
      if (navbarRes.ok) setNavbarData(await navbarRes.json());
      if (aboutRes.ok) setAboutData(await aboutRes.json());
      if (featuresRes.ok) setChooseFeatures(await featuresRes.json());
      if (categoriesRes.ok) setMenuCategories(await categoriesRes.json());
      if (itemsRes.ok) setMenuItems(await itemsRes.json());
      if (igRes.ok) setInstagramPosts(await igRes.json());
      if (contactRes.ok) setContactData(await contactRes.json());
      if (footerRes.ok) setFooterData(await footerRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (seoRes.ok) setSeo(await seoRes.json());

      // Logged in user routes
      if (token) {
        const [reservationsRes, logsRes] = await Promise.all([
          fetch('/api/reservations', { headers: getHeaders() }),
          fetch('/api/logs', { headers: getHeaders() })
        ]);
        if (reservationsRes.ok) setReservations(await reservationsRes.json());
        if (logsRes.ok) setActivityLogs(await logsRes.json());
        if (currentUser?.role === 'Super Admin') {
          await fetchUsers();
        }
        await fetchMedia();
      }
    } catch (err: any) {
      console.error('Error refreshing CMS data:', err);
      setError('Failed to fetch data from CMS REST API backend.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load initially
  useEffect(() => {
    refreshAllData();
  }, [token]);

  // Section Update Methods
  const updateHeroData = async (data: Partial<HeroData>): Promise<boolean> => {
    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setHeroData(await res.json());
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateNavbarData = async (data: Partial<NavbarData>): Promise<boolean> => {
    try {
      const res = await fetch('/api/navbar', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setNavbarData(await res.json());
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateAboutData = async (data: Partial<AboutData>): Promise<boolean> => {
    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setAboutData(await res.json());
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateContactData = async (data: Partial<ContactData>): Promise<boolean> => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setContactData(await res.json());
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateFooterData = async (data: Partial<FooterData>): Promise<boolean> => {
    try {
      const res = await fetch('/api/footer', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setFooterData(await res.json());
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Features
  const addFeature = async (feature: Omit<ChooseFeature, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/features', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(feature)
      });
      if (res.ok) {
        const created = await res.json();
        setChooseFeatures((prev) => [...prev, created]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateChooseFeature = async (id: string, updatedFeature: Partial<ChooseFeature>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/features/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedFeature)
      });
      if (res.ok) {
        const updated = await res.json();
        setChooseFeatures((prev) => prev.map((f) => (f.id === id ? updated : f)));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteFeature = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/features/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setChooseFeatures((prev) => prev.filter((f) => f.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Menu Category Actions
  const addCategory = async (category: Omit<MenuCategory, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/menu/categories', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(category)
      });
      if (res.ok) {
        const created = await res.json();
        setMenuCategories((prev) => [...prev, created]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateCategory = async (id: string, data: Partial<MenuCategory>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/menu/categories/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setMenuCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/menu/categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setMenuCategories((prev) => prev.filter((c) => c.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Menu Items
  const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/menu/items', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const created = await res.json();
        setMenuItems((prev) => [...prev, created]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateMenuItem = async (id: string, updatedItem: Partial<MenuItem>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/menu/items/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedItem)
      });
      if (res.ok) {
        const updated = await res.json();
        setMenuItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteMenuItem = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/menu/items/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setMenuItems((prev) => prev.filter((item) => item.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Instagram
  const addInstagramPost = async (post: Omit<InstagramPost, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/instagram', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(post)
      });
      if (res.ok) {
        const created = await res.json();
        setInstagramPosts((prev) => [...prev, created]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateInstagramPost = async (id: string, updatedPost: Partial<InstagramPost>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/instagram/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedPost)
      });
      if (res.ok) {
        const updated = await res.json();
        setInstagramPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteInstagramPost = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/instagram/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setInstagramPosts((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Reservations
  const createReservation = async (resData: Omit<Reservation, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resData)
      });
      if (res.ok) {
        const created = await res.json();
        setReservations((prev) => [...prev, created]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateReservationStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteReservation = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Events
  const addEvent = async (event: Omit<RestaurantEvent, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(event)
      });
      if (res.ok) {
        const created = await res.json();
        setEvents((prev) => [...prev, created]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateEvent = async (id: string, data: Partial<RestaurantEvent>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Testimonials
  const addTestimonial = async (test: Omit<Testimonial, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(test)
      });
      if (res.ok) {
        const created = await res.json();
        setTestimonials((prev) => [...prev, created]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateTestimonial = async (id: string, data: Partial<Testimonial>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setTestimonials((prev) => prev.map((t) => (t.id === id ? updated : t)));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Settings & SEO
  const updateSettings = async (data: Partial<SystemSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSettings(await res.json());
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateSEO = async (data: Partial<SEOSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/seo', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSeo(await res.json());
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Media Library Operations
  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media', { headers: getHeaders() });
      if (res.ok) {
        setMediaList(await res.json());
      }
    } catch (err) {
      console.error('Error listing files:', err);
    }
  };

  const uploadMediaFile = async (file: File): Promise<MediaFile | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const uploaded: MediaFile = await res.json();
        setMediaList((prev) => [uploaded, ...prev]);
        return uploaded;
      }
      return null;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  const deleteMediaFile = async (filename: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/media/${filename}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.filename !== filename));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Delete media failed:', err);
      return false;
    }
  };

  // Restore seed values
  const resetToDefaults = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/reset-defaults', {
        method: 'POST',
        headers: getHeaders()
      });
      if (res.ok) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <WebsiteDataContext.Provider
      value={{
        menuItems,
        heroData,
        aboutData,
        contactData,
        chooseFeatures,
        instagramPosts,
        navbarData,
        footerData,
        menuCategories,
        reservations,
        events,
        testimonials,
        settings,
        seo,
        mediaList,
        activityLogs,
        usersList,

        // Auth
        token,
        currentUser,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        fetchUsers,
        createUser,
        deleteUser,

        // REST API operations
        updateHeroData,
        updateNavbarData,
        updateAboutData,
        updateContactData,
        updateFooterData,
        
        // Features
        addFeature,
        updateChooseFeature,
        deleteFeature,

        // Categories
        addCategory,
        updateCategory,
        deleteCategory,

        // Menu items
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,

        // Instagram
        addInstagramPost,
        updateInstagramPost,
        deleteInstagramPost,

        // Reservations
        createReservation,
        updateReservationStatus,
        deleteReservation,

        // Events
        addEvent,
        updateEvent,
        deleteEvent,

        // Testimonials
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        // Settings & SEO
        updateSettings,
        updateSEO,

        // Media List
        fetchMedia,
        uploadMediaFile,
        deleteMediaFile,

        refreshAllData,
        resetToDefaults
      }}
    >
      {children}
    </WebsiteDataContext.Provider>
  );
};

export const useWebsiteData = () => {
  const context = useContext(WebsiteDataContext);
  if (!context) {
    throw new Error('useWebsiteData must be used within a WebsiteDataProvider');
  }
  return context;
};
