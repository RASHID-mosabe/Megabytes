import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, ChooseFeature, InstagramPost } from '../types';
import {
  defaultUsers,
  defaultHeroData,
  defaultNavbarData,
  defaultAboutData,
  defaultChooseFeatures,
  defaultMenuCategories,
  defaultMenuItems,
  defaultInstagramPosts,
  defaultContactData,
  defaultFooterData,
  defaultEvents,
  defaultTestimonials,
  defaultSettings,
  defaultSeo
} from '../data/defaultData';

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

function getStoredOrDefault<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn(`Failed to parse stored ${key}`, e);
  }
  return defaultValue;
}

function saveStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key}`, e);
  }
}

export const WebsiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Core CMS states with seed defaults + localStorage persistence
  const [heroData, setHeroDataState] = useState<HeroData>(() => getStoredOrDefault('mb_heroData', defaultHeroData));
  const [navbarData, setNavbarDataState] = useState<NavbarData>(() => getStoredOrDefault('mb_navbarData', defaultNavbarData));
  const [aboutData, setAboutDataState] = useState<AboutData>(() => getStoredOrDefault('mb_aboutData', defaultAboutData));
  const [contactData, setContactDataState] = useState<ContactData>(() => getStoredOrDefault('mb_contactData', defaultContactData));
  const [footerData, setFooterDataState] = useState<FooterData>(() => getStoredOrDefault('mb_footerData', defaultFooterData));
  const [chooseFeatures, setChooseFeaturesState] = useState<ChooseFeature[]>(() => getStoredOrDefault('mb_chooseFeatures', defaultChooseFeatures));
  const [menuCategories, setMenuCategoriesState] = useState<MenuCategory[]>(() => getStoredOrDefault('mb_menuCategories', defaultMenuCategories));
  const [menuItems, setMenuItemsState] = useState<MenuItem[]>(() => getStoredOrDefault('mb_menuItems', defaultMenuItems));
  const [instagramPosts, setInstagramPostsState] = useState<InstagramPost[]>(() => getStoredOrDefault('mb_instagramPosts', defaultInstagramPosts));
  const [reservations, setReservationsState] = useState<Reservation[]>(() => getStoredOrDefault('mb_reservations', []));
  const [events, setEventsState] = useState<RestaurantEvent[]>(() => getStoredOrDefault('mb_events', defaultEvents));
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(() => getStoredOrDefault('mb_testimonials', defaultTestimonials));
  const [settings, setSettingsState] = useState<SystemSettings>(() => getStoredOrDefault('mb_settings', defaultSettings));
  const [seo, setSeoState] = useState<SEOSettings>(() => getStoredOrDefault('mb_seo', defaultSeo));
  const [mediaList, setMediaListState] = useState<MediaFile[]>(() => getStoredOrDefault('mb_mediaList', []));
  const [activityLogs, setActivityLogsState] = useState<ActivityLog[]>(() => getStoredOrDefault('mb_activityLogs', []));
  const [usersList, setUsersListState] = useState<UserProfile[]>(() => getStoredOrDefault('mb_usersList', defaultUsers));

  // State Wrappers that automatically save to localStorage
  const setHeroData = (value: HeroData | ((prev: HeroData) => HeroData)) => {
    setHeroDataState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_heroData', next);
      return next;
    });
  };

  const setNavbarData = (value: NavbarData | ((prev: NavbarData) => NavbarData)) => {
    setNavbarDataState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_navbarData', next);
      return next;
    });
  };

  const setAboutData = (value: AboutData | ((prev: AboutData) => AboutData)) => {
    setAboutDataState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_aboutData', next);
      return next;
    });
  };

  const setContactData = (value: ContactData | ((prev: ContactData) => ContactData)) => {
    setContactDataState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_contactData', next);
      return next;
    });
  };

  const setFooterData = (value: FooterData | ((prev: FooterData) => FooterData)) => {
    setFooterDataState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_footerData', next);
      return next;
    });
  };

  const setChooseFeatures = (value: ChooseFeature[] | ((prev: ChooseFeature[]) => ChooseFeature[])) => {
    setChooseFeaturesState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_chooseFeatures', next);
      return next;
    });
  };

  const setMenuCategories = (value: MenuCategory[] | ((prev: MenuCategory[]) => MenuCategory[])) => {
    setMenuCategoriesState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_menuCategories', next);
      return next;
    });
  };

  const setMenuItems = (value: MenuItem[] | ((prev: MenuItem[]) => MenuItem[])) => {
    setMenuItemsState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_menuItems', next);
      return next;
    });
  };

  const setInstagramPosts = (value: InstagramPost[] | ((prev: InstagramPost[]) => InstagramPost[])) => {
    setInstagramPostsState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_instagramPosts', next);
      return next;
    });
  };

  const setReservations = (value: Reservation[] | ((prev: Reservation[]) => Reservation[])) => {
    setReservationsState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_reservations', next);
      return next;
    });
  };

  const setEvents = (value: RestaurantEvent[] | ((prev: RestaurantEvent[]) => RestaurantEvent[])) => {
    setEventsState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_events', next);
      return next;
    });
  };

  const setTestimonials = (value: Testimonial[] | ((prev: Testimonial[]) => Testimonial[])) => {
    setTestimonialsState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_testimonials', next);
      return next;
    });
  };

  const setSettings = (value: SystemSettings | ((prev: SystemSettings) => SystemSettings)) => {
    setSettingsState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_settings', next);
      return next;
    });
  };

  const setSeo = (value: SEOSettings | ((prev: SEOSettings) => SEOSettings)) => {
    setSeoState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_seo', next);
      return next;
    });
  };

  const setMediaList = (value: MediaFile[] | ((prev: MediaFile[]) => MediaFile[])) => {
    setMediaListState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_mediaList', next);
      return next;
    });
  };

  const setActivityLogs = (value: ActivityLog[] | ((prev: ActivityLog[]) => ActivityLog[])) => {
    setActivityLogsState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_activityLogs', next);
      return next;
    });
  };

  const setUsersList = (value: UserProfile[] | ((prev: UserProfile[]) => UserProfile[])) => {
    setUsersListState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      saveStored('mb_usersList', next);
      return next;
    });
  };

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
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem('mb_admin_jwt', data.token);
        localStorage.setItem('mb_admin_user', JSON.stringify(data.user));
        return true;
      }
    } catch (err) {
      console.warn('API login unavailable, checking local accounts:', err);
    }

    // Local fallback authentication for Vercel static hosting
    const normEmail = email.trim().toLowerCase();
    if (normEmail === 'admin@megabytes.com' && password === 'admin123') {
      const user: UserProfile = { id: 'u1', email: 'admin@megabytes.com', role: 'Super Admin', name: 'Super Admin' };
      const fakeToken = 'demo_token_' + Date.now();
      setToken(fakeToken);
      setCurrentUser(user);
      localStorage.setItem('mb_admin_jwt', fakeToken);
      localStorage.setItem('mb_admin_user', JSON.stringify(user));
      return true;
    } else if (normEmail === 'editor@megabytes.com' && password === 'editor123') {
      const user: UserProfile = { id: 'u2', email: 'editor@megabytes.com', role: 'Editor', name: 'Editor John' };
      const fakeToken = 'demo_token_' + Date.now();
      setToken(fakeToken);
      setCurrentUser(user);
      localStorage.setItem('mb_admin_jwt', fakeToken);
      localStorage.setItem('mb_admin_user', JSON.stringify(user));
      return true;
    }

    // Check custom created users in usersList
    const customUser = usersList.find((u) => u.email.toLowerCase() === normEmail);
    if (customUser && password === 'admin123') {
      const fakeToken = 'demo_token_' + Date.now();
      setToken(fakeToken);
      setCurrentUser(customUser);
      localStorage.setItem('mb_admin_jwt', fakeToken);
      localStorage.setItem('mb_admin_user', JSON.stringify(customUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('mb_admin_jwt');
    localStorage.removeItem('mb_admin_user');
  };

  // User Management
  const fetchUsers = async (): Promise<void> => {
    try {
      const res = await fetch('/api/users', { headers: getHeaders() });
      if (res.ok) {
        setUsersList(await res.json());
      }
    } catch (err) {
      console.warn('Fetch users API unavailable, using local users list:', err);
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
        const created = await res.json();
        setUsersList((prev) => [...prev, created]);
        return true;
      }
    } catch (err) {
      console.warn('Create user API unavailable, saving locally:', err);
    }
    const newUser: UserProfile = { id: `u-${Date.now()}`, email: userData.email, role: userData.role || 'Editor', name: userData.name || 'Staff' };
    setUsersList((prev) => [...prev, newUser]);
    return true;
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setUsersList((prev) => prev.filter((u) => u.id !== id));
        return true;
      }
    } catch (err) {
      console.warn('Delete user API unavailable, saving locally:', err);
    }
    setUsersList((prev) => prev.filter((u) => u.id !== id));
    return true;
  };

  // Fetch all CMS data from server if available
  const refreshAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
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
        fetch('/api/hero').catch(() => null),
        fetch('/api/navbar').catch(() => null),
        fetch('/api/about').catch(() => null),
        fetch('/api/features').catch(() => null),
        fetch('/api/menu/categories').catch(() => null),
        fetch('/api/menu/items').catch(() => null),
        fetch('/api/instagram').catch(() => null),
        fetch('/api/contact').catch(() => null),
        fetch('/api/footer').catch(() => null),
        fetch('/api/events').catch(() => null),
        fetch('/api/testimonials').catch(() => null),
        fetch('/api/settings').catch(() => null),
        fetch('/api/seo').catch(() => null)
      ]);

      if (heroRes?.ok) setHeroData(await heroRes.json());
      if (navbarRes?.ok) setNavbarData(await navbarRes.json());
      if (aboutRes?.ok) setAboutData(await aboutRes.json());
      if (featuresRes?.ok) setChooseFeatures(await featuresRes.json());
      if (categoriesRes?.ok) setMenuCategories(await categoriesRes.json());
      if (itemsRes?.ok) setMenuItems(await itemsRes.json());
      if (igRes?.ok) setInstagramPosts(await igRes.json());
      if (contactRes?.ok) setContactData(await contactRes.json());
      if (footerRes?.ok) setFooterData(await footerRes.json());
      if (eventsRes?.ok) setEvents(await eventsRes.json());
      if (testimonialsRes?.ok) setTestimonials(await testimonialsRes.json());
      if (settingsRes?.ok) setSettings(await settingsRes.json());
      if (seoRes?.ok) setSeo(await seoRes.json());

      if (token) {
        const [reservationsRes, logsRes] = await Promise.all([
          fetch('/api/reservations', { headers: getHeaders() }).catch(() => null),
          fetch('/api/logs', { headers: getHeaders() }).catch(() => null)
        ]);
        if (reservationsRes?.ok) setReservations(await reservationsRes.json());
        if (logsRes?.ok) setActivityLogs(await logsRes.json());
        if (currentUser?.role === 'Super Admin') {
          await fetchUsers().catch(() => {});
        }
        await fetchMedia().catch(() => {});
      }
    } catch (err: any) {
      console.warn('API refresh skipped or failed; using local persistent data:', err);
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    setHeroData((prev) => ({ ...prev, ...data }));
    return true;
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    setNavbarData((prev) => prev ? { ...prev, ...data } : { ...defaultNavbarData, ...data });
    return true;
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    setAboutData((prev) => ({ ...prev, ...data }));
    return true;
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    setContactData((prev) => ({ ...prev, ...data }));
    return true;
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    setFooterData((prev) => prev ? { ...prev, ...data } : { ...defaultFooterData, ...data });
    return true;
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    const created: ChooseFeature = { id: `feat-${Date.now()}`, ...feature };
    setChooseFeatures((prev) => [...prev, created]);
    return true;
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    setChooseFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, ...updatedFeature } : f)));
    return true;
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
    } catch (err) {
      console.warn('API delete unavailable, saving locally:', err);
    }
    setChooseFeatures((prev) => prev.filter((f) => f.id !== id));
    return true;
  };

  // Categories
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    const created: MenuCategory = { id: `cat-${Date.now()}`, displayOrder: menuCategories.length + 1, isVisible: true, ...category };
    setMenuCategories((prev) => [...prev, created]);
    return true;
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    setMenuCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    return true;
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
    } catch (err) {
      console.warn('API delete unavailable, saving locally:', err);
    }
    setMenuCategories((prev) => prev.filter((c) => c.id !== id));
    return true;
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    const created: MenuItem = { id: `item-${Date.now()}`, ...item };
    setMenuItems((prev) => [...prev, created]);
    return true;
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
        setMenuItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
        return true;
      }
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    setMenuItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updatedItem } : i)));
    return true;
  };

  const deleteMenuItem = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/menu/items/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setMenuItems((prev) => prev.filter((i) => i.id !== id));
        return true;
      }
    } catch (err) {
      console.warn('API delete unavailable, saving locally:', err);
    }
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
    return true;
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    const created: InstagramPost = { id: `ig-${Date.now()}`, ...post };
    setInstagramPosts((prev) => [...prev, created]);
    return true;
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
    } catch (err) {
      console.warn('API update unavailable, saving locally:', err);
    }
    setInstagramPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedPost } : p)));
    return true;
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
    } catch (err) {
      console.warn('API delete unavailable, saving locally:', err);
    }
    setInstagramPosts((prev) => prev.filter((p) => p.id !== id));
    return true;
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
        setReservations((prev) => [created, ...prev]);
        return true;
      }
    } catch (err) {
      console.warn('API create reservation unavailable, saving locally:', err);
    }
    const created: Reservation = { id: `res-${Date.now()}`, status: 'Pending', createdAt: new Date().toISOString(), ...resData };
    setReservations((prev) => [created, ...prev]);
    return true;
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
    } catch (err) {
      console.warn('API update reservation status unavailable, saving locally:', err);
    }
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    return true;
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
    } catch (err) {
      console.warn('API delete reservation unavailable, saving locally:', err);
    }
    setReservations((prev) => prev.filter((r) => r.id !== id));
    return true;
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
    } catch (err) {
      console.warn('API add event unavailable, saving locally:', err);
    }
    const created: RestaurantEvent = { id: `ev-${Date.now()}`, ...event };
    setEvents((prev) => [...prev, created]);
    return true;
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
    } catch (err) {
      console.warn('API update event unavailable, saving locally:', err);
    }
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    return true;
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
    } catch (err) {
      console.warn('API delete event unavailable, saving locally:', err);
    }
    setEvents((prev) => prev.filter((e) => e.id !== id));
    return true;
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
    } catch (err) {
      console.warn('API add testimonial unavailable, saving locally:', err);
    }
    const created: Testimonial = { id: `test-${Date.now()}`, ...test };
    setTestimonials((prev) => [...prev, created]);
    return true;
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
    } catch (err) {
      console.warn('API update testimonial unavailable, saving locally:', err);
    }
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    return true;
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
    } catch (err) {
      console.warn('API delete testimonial unavailable, saving locally:', err);
    }
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    return true;
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
    } catch (err) {
      console.warn('API update settings unavailable, saving locally:', err);
    }
    setSettings((prev) => prev ? { ...prev, ...data } : { ...defaultSettings, ...data });
    return true;
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
    } catch (err) {
      console.warn('API update SEO unavailable, saving locally:', err);
    }
    setSeo((prev) => prev ? { ...prev, ...data } : { ...defaultSeo, ...data });
    return true;
  };

  // Media Library
  const fetchMedia = async (): Promise<void> => {
    try {
      const res = await fetch('/api/media', { headers: getHeaders() });
      if (res.ok) {
        setMediaList(await res.json());
      }
    } catch (err) {
      console.warn('API fetch media unavailable, using local media list:', err);
    }
  };

  const uploadMediaFile = async (file: File): Promise<MediaFile | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      if (res.ok) {
        const uploaded: MediaFile = await res.json();
        setMediaList((prev) => [uploaded, ...prev]);
        return uploaded;
      }
    } catch (err) {
      console.warn('API upload media unavailable, encoding locally as base64 data URL:', err);
    }

    // Base64 local image reader fallback for Vercel static deployments
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const mediaItem: MediaFile = {
          id: `media-${Date.now()}`,
          filename: file.name,
          url: dataUrl,
          size: (file.size / 1024).toFixed(1) + ' KB',
          createdAt: new Date().toISOString()
        };
        setMediaList((prev) => [mediaItem, ...prev]);
        resolve(mediaItem);
      };
      reader.readAsDataURL(file);
    });
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
    } catch (err) {
      console.warn('API delete media unavailable, saving locally:', err);
    }
    setMediaList((prev) => prev.filter((m) => m.filename !== filename));
    return true;
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
    } catch (err) {
      console.warn('API reset unavailable, clearing localStorage and restoring seed defaults:', err);
    }

    localStorage.removeItem('mb_heroData');
    localStorage.removeItem('mb_navbarData');
    localStorage.removeItem('mb_aboutData');
    localStorage.removeItem('mb_contactData');
    localStorage.removeItem('mb_footerData');
    localStorage.removeItem('mb_chooseFeatures');
    localStorage.removeItem('mb_menuCategories');
    localStorage.removeItem('mb_menuItems');
    localStorage.removeItem('mb_instagramPosts');
    localStorage.removeItem('mb_reservations');
    localStorage.removeItem('mb_events');
    localStorage.removeItem('mb_testimonials');
    localStorage.removeItem('mb_settings');
    localStorage.removeItem('mb_seo');
    localStorage.removeItem('mb_mediaList');
    localStorage.removeItem('mb_activityLogs');
    localStorage.removeItem('mb_usersList');

    setHeroData(defaultHeroData);
    setNavbarData(defaultNavbarData);
    setAboutData(defaultAboutData);
    setContactData(defaultContactData);
    setFooterData(defaultFooterData);
    setChooseFeatures(defaultChooseFeatures);
    setMenuCategories(defaultMenuCategories);
    setMenuItems(defaultMenuItems);
    setInstagramPosts(defaultInstagramPosts);
    setReservations([]);
    setEvents(defaultEvents);
    setTestimonials(defaultTestimonials);
    setSettings(defaultSettings);
    setSeo(defaultSeo);
    setMediaList([]);
    setActivityLogs([]);
    setUsersList(defaultUsers);

    return true;
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
