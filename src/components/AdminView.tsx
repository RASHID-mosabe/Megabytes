import React, { useState } from 'react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { 
  Lock, Key, RefreshCw, Save, Plus, Edit2, Trash2, Check, AlertCircle, 
  Settings, Image, AlignLeft, Info, HelpCircle, Utensils, Award, Users, 
  MapPin, Phone, Mail, Clock, Eye, Sparkles, Upload, LogOut, CheckCircle,
  FileText, Calendar, Star, BarChart2, Shield, Database, Compass, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab = 
  | 'dashboard' | 'hero' | 'about' | 'menu' 
  | 'contact' 
  | 'users' | 'settings' 
  | 'seo' | 'logs';

export default function AdminView() {
  const {
    menuItems, heroData, aboutData, contactData, chooseFeatures, instagramPosts,
    footerData, menuCategories, reservations,
    settings, seo, mediaList, activityLogs, usersList, currentUser, isAuthenticated,
    login, logout, createUser, deleteUser, updateHeroData, navbarData, updateNavbarData,
    updateAboutData, updateContactData, updateFooterData, addFeature, updateChooseFeature,
    deleteFeature, addCategory, updateCategory, deleteCategory, addMenuItem,
    updateMenuItem, deleteMenuItem, addInstagramPost, updateInstagramPost,
    deleteInstagramPost, updateReservationStatus, deleteReservation,
    updateSettings, updateSEO, uploadMediaFile, deleteMediaFile, resetToDefaults
  } = useWebsiteData();

  // Navigation & Form states
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Forms states
  const [heroForm, setHeroForm] = useState({ ...heroData });
  const [aboutForm, setAboutForm] = useState({ ...aboutData });
  const [contactForm, setContactForm] = useState({ ...contactData });
  const [footerForm, setFooterForm] = useState(footerData || { logoText: "MEGA BYTES", description: "", copyright: "" });
  const [settingsForm, setSettingsForm] = useState(settings || { siteName: "Mega Bytes", currency: "KSh", taxRate: 16, enableReservations: true });
  const [seoForm, setSeoForm] = useState(seo || { metaTitle: "", metaDescription: "", metaKeywords: "" });
  const [navbarForm, setNavbarForm] = useState(navbarData || { logoText: "MEGA BYTES.", logoColor: "#C4430E", logoSize: "lg", logoType: "text", logoImage: "", sticky: true, transparent: false, ctaText: "Order Now", ctaLink: "#menu", navLinks: [] });

  // Modals / Item creation buffers
  const [showItemModal, setShowItemModal] = useState<any>(null); 
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; type: 'menu' | 'user' | 'reset-defaults'; name: string; action: () => void } | null>(null);

  // Sync state helpers on tab switch
  React.useEffect(() => {
    setHeroForm({ ...heroData });
    setAboutForm({ ...aboutData });
    setContactForm({ ...contactData });
    if (footerData) setFooterForm({ ...footerData });
    if (settings) setSettingsForm({ ...settings });
    if (seo) setSeoForm({ ...seo });
    if (navbarData) setNavbarForm({ ...navbarData });
  }, [activeTab, heroData, aboutData, contactData, footerData, settings, seo, navbarData]);

  // Lock background body scroll when editing modals are open
  React.useEffect(() => {
    const isModalOpen = !!showItemModal;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showItemModal]);

  const showBanner = (type: 'success' | 'error', msg: string) => {
    setBanner({ type, msg });
    setTimeout(() => setBanner(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');
    const success = await login(emailInput, passwordInput);
    setIsSubmitting(false);
    if (!success) {
      setLoginError('Invalid administrator credentials.');
    }
  };

  const saveSection = async (type: string, fn: () => Promise<boolean>) => {
    setIsSubmitting(true);
    const ok = await fn();
    setIsSubmitting(false);
    if (ok) {
      showBanner('success', `${type} updated successfully!`);
    } else {
      showBanner('error', `Failed to update ${type}.`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSubmitting(true);
    const media = await uploadMediaFile(file);
    setIsSubmitting(false);
    if (media) {
      showBanner('success', `Uploaded ${file.name} successfully.`);
    } else {
      showBanner('error', `Upload failed.`);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSubmitting(true);
    const media = await uploadMediaFile(file);
    setIsSubmitting(false);
    if (media && media.url) {
      setNavbarForm(prev => ({ ...prev, logoType: 'image', logoImage: media.url }));
      showBanner('success', `Uploaded logo image successfully.`);
    } else {
      showBanner('error', `Upload failed.`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#F5E3C7]">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#C4430E]/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-[#C4430E]" />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-[#100906] tracking-tight text-center">
              MEGA BYTES CMS
            </h2>
            <p className="text-sm font-sans text-gray-500 mt-1 text-center">
              Enter credentials to manage premium restaurant settings
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="p-4 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#100906]/80 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-sans text-sm text-[#100906] focus:outline-none focus:border-[#C4430E] transition-colors"
                  placeholder="admin@megabytes.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#100906]/80 mb-2">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-sans text-sm text-[#100906] focus:outline-none focus:border-[#C4430E] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              <span>Sign In Securely</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navigationItems: { id: AdminTab; label: string; icon: any; roles?: string[] }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart2 },
    { id: 'hero', label: 'Hero Banner', icon: Image },
    { id: 'about', label: 'About Copy & Stats', icon: Info },
    { id: 'menu', label: 'Menu Offerings', icon: Utensils },
    { id: 'contact', label: 'Contact Details', icon: MapPin },
    { id: 'users', label: 'Staff Accounts', icon: Users, roles: ['Super Admin'] },
    { id: 'settings', label: 'General Configuration', icon: Settings, roles: ['Super Admin', 'Admin'] },
    { id: 'seo', label: 'SEO Settings', icon: Shield, roles: ['Super Admin', 'Admin'] },
    { id: 'logs', label: 'Activity Logs', icon: Database, roles: ['Super Admin', 'Admin'] }
  ];

  React.useEffect(() => {
    const currentNav = navigationItems.find(item => item.id === activeTab);
    if (currentNav && currentNav.roles && !currentNav.roles.includes(currentUser?.role || '')) {
      setActiveTab('dashboard');
    }
  }, [currentUser, activeTab]);

  return (
    <div className="w-full min-h-[90vh] bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-[#100906] text-white flex flex-col justify-between p-4 shrink-0">
        <div>
          <div className="p-4 border-b border-white/10 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#C4430E] rounded-md flex items-center justify-center font-extrabold text-sm">
              MB
            </div>
            <div>
              <h2 className="font-display font-extrabold text-sm tracking-widest uppercase">
                MEGA BYTES
              </h2>
              <p className="text-[10px] text-gray-400 font-sans tracking-wide">
                Role: <span className="text-[#C4430E] font-bold">{currentUser?.role}</span>
              </p>
            </div>
          </div>

          <nav className="space-y-1 overflow-y-auto max-h-[70vh] pr-1">
            {navigationItems.map((item) => {
              if (item.roles && !item.roles.includes(currentUser?.role || '')) return null;
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors text-left ${
                    isActive 
                      ? 'bg-[#C4430E] text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Panel content area */}
      <main className="flex-1 p-6 md:p-10 relative overflow-x-hidden">
        {/* Banner notification */}
        <AnimatePresence>
          {banner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border flex items-center justify-between gap-4 font-sans text-xs font-semibold max-w-sm ${
                banner.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {banner.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
                <span>{banner.msg}</span>
              </div>
              <button 
                onClick={() => setBanner(null)}
                className={`p-1 rounded-md transition-colors shrink-0 ${
                  banner.type === 'success' 
                    ? 'hover:bg-emerald-100 text-emerald-600 hover:text-emerald-900' 
                    : 'hover:bg-red-100 text-red-600 hover:text-red-900'
                }`}
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">
              Restaurant CMS Panel
            </span>
            <h1 className="text-2xl font-display font-extrabold text-[#100906] tracking-tight uppercase mt-0.5">
              {activeTab.replace('-', ' ')} Manager
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.role === 'Super Admin' && (
              <button
                onClick={() => {
                  setConfirmDelete({
                    id: 'reset',
                    type: 'reset-defaults',
                    name: 'All modifications',
                    action: async () => {
                      const done = await resetToDefaults();
                      if (done) showBanner('success', 'Database restored to original seeds.');
                    }
                  });
                }}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-sans text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Database className="w-3.5 h-3.5 text-[#C4430E]" />
                Restore Seed Defaults
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          {/* Dashboard tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-sans">Menu Items</span>
                  <div className="text-3xl font-display font-extrabold text-[#100906] mt-1">{menuItems.length}</div>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider font-sans">Site Traffic Status</span>
                  <div className="text-3xl font-display font-extrabold text-[#100906] mt-1">Live & Active</div>
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm tracking-wider uppercase text-[#100906] mb-4">
                  Quick CMS Access Guides
                </h3>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600 font-sans space-y-2">
                  <p>• <strong>Hero Section</strong>: Manage titles, images, and button actions on the main landing slider.</p>
                  <p>• <strong>Menu & Categories</strong>: Create restaurant dishes, price points, small/medium/large options, availability and featured badges.</p>
                </div>
              </div>
            </div>
          )}

          {/* Hero tab */}
          {activeTab === 'hero' && (
            <form onSubmit={(e) => { e.preventDefault(); saveSection('Hero Section', () => updateHeroData(heroForm)); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Title Line 1</label>
                  <input type="text" value={heroForm.titleLine1} onChange={(e) => setHeroForm({...heroForm, titleLine1: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Title Line 2</label>
                  <input type="text" value={heroForm.titleLine2} onChange={(e) => setHeroForm({...heroForm, titleLine2: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Title Line 3 (Big Highlight)</label>
                  <input type="text" value={heroForm.titleLine3} onChange={(e) => setHeroForm({...heroForm, titleLine3: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Description Paragraph</label>
                  <textarea rows={3} value={heroForm.description} onChange={(e) => setHeroForm({...heroForm, description: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Hero Main/Pizza Image</label>
                  <input type="text" value={heroForm.pizzaImage} onChange={(e) => setHeroForm({...heroForm, pizzaImage: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono mb-2" placeholder="https://..." />
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsSubmitting(true);
                        const media = await uploadMediaFile(file);
                        setIsSubmitting(false);
                        if (media && media.url) {
                          setHeroForm(prev => ({ ...prev, pizzaImage: media.url }));
                          showBanner('success', 'Hero main image uploaded.');
                        } else {
                          showBanner('error', 'Upload failed.');
                        }
                      }} 
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-[#C4430E] hover:file:bg-amber-100" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Background Image</label>
                  <input type="text" value={heroForm.bgImage} onChange={(e) => setHeroForm({...heroForm, bgImage: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono mb-2" placeholder="https://..." />
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsSubmitting(true);
                        const media = await uploadMediaFile(file);
                        setIsSubmitting(false);
                        if (media && media.url) {
                          setHeroForm(prev => ({ ...prev, bgImage: media.url }));
                          showBanner('success', 'Hero background image uploaded.');
                        } else {
                          showBanner('error', 'Upload failed.');
                        }
                      }} 
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-[#C4430E] hover:file:bg-amber-100" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Button Callout Text</label>
                  <input type="text" value={heroForm.buttonText} onChange={(e) => setHeroForm({...heroForm, buttonText: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Button Link href Target</label>
                  <input type="text" value={heroForm.buttonLink} onChange={(e) => setHeroForm({...heroForm, buttonLink: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-lg shadow-sm flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Hero Section
                </button>
              </div>
            </form>
          )}

          {/* About Copy tab */}
          {activeTab === 'about' && (
            <form onSubmit={(e) => { e.preventDefault(); saveSection('About Copy', () => updateAboutData(aboutForm)); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Section Headline Title</label>
                  <input type="text" value={aboutForm.title} onChange={(e) => setAboutForm({...aboutForm, title: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Subtitle (e.g. Established Year)</label>
                  <input type="text" value={aboutForm.subtitle} onChange={(e) => setAboutForm({...aboutForm, subtitle: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">About Paragraph 1</label>
                  <textarea rows={3} value={aboutForm.paragraph1} onChange={(e) => setAboutForm({...aboutForm, paragraph1: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">About Paragraph 2</label>
                  <textarea rows={3} value={aboutForm.paragraph2} onChange={(e) => setAboutForm({...aboutForm, paragraph2: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Stat 1 Value</label>
                  <input type="text" value={aboutForm.stat1Value} onChange={(e) => setAboutForm({...aboutForm, stat1Value: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Stat 1 Description</label>
                  <input type="text" value={aboutForm.stat1Label} onChange={(e) => setAboutForm({...aboutForm, stat1Label: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Stat 2 Value</label>
                  <input type="text" value={aboutForm.stat2Value} onChange={(e) => setAboutForm({...aboutForm, stat2Value: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Stat 2 Description</label>
                  <input type="text" value={aboutForm.stat2Label} onChange={(e) => setAboutForm({...aboutForm, stat2Label: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Badge text</label>
                  <input type="text" value={aboutForm.badge} onChange={(e) => setAboutForm({...aboutForm, badge: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Featured Image</label>
                  <input type="text" value={aboutForm.image} onChange={(e) => setAboutForm({...aboutForm, image: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono mb-2" placeholder="https://..." />
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsSubmitting(true);
                        const media = await uploadMediaFile(file);
                        setIsSubmitting(false);
                        if (media && media.url) {
                          setAboutForm(prev => ({ ...prev, image: media.url }));
                          showBanner('success', 'Featured image uploaded.');
                        } else {
                          showBanner('error', 'Upload failed.');
                        }
                      }} 
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-[#C4430E] hover:file:bg-amber-100" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-lg shadow-sm flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save About Copy
                </button>
              </div>
            </form>
          )}

          {/* Contact tab */}
          {activeTab === 'contact' && (
            <form onSubmit={(e) => { e.preventDefault(); saveSection('Contact settings', () => updateContactData(contactForm)); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Physical Location Address</label>
                  <input type="text" value={contactForm.address} onChange={(e) => setContactForm({...contactForm, address: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Official Phone Number</label>
                  <input type="text" value={contactForm.phone} onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Business Email Address</label>
                  <input type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Official Website Domain</label>
                  <input type="text" value={contactForm.website} onChange={(e) => setContactForm({...contactForm, website: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Weekdays Hours (Mon-Fri)</label>
                  <input type="text" value={contactForm.hoursWeekdays} onChange={(e) => setContactForm({...contactForm, hoursWeekdays: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Weekends Hours (Sat-Sun)</label>
                  <input type="text" value={contactForm.hoursWeekends} onChange={(e) => setContactForm({...contactForm, hoursWeekends: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Google Maps Embed URL</label>
                  <textarea rows={2} value={contactForm.mapsUrl || ''} onChange={(e) => setContactForm({...contactForm, mapsUrl: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-xs" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-lg shadow-sm flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Contact copy
                </button>
              </div>
            </form>
          )}

          {/* Menu offerings tab */}
          {activeTab === 'menu' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-display font-bold text-[#100906] text-sm uppercase">Menu Items List ({menuItems.length})</h3>
                <button
                  onClick={() => setShowItemModal({})}
                  className="px-4 py-2 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Menu Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-[#100906]/60 font-bold uppercase">
                      <th className="py-3 px-4">Item details</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price range (KSh)</th>
                      <th className="py-3 px-4">Calories</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100" />
                            ) : null}
                            <div>
                              <div className="font-extrabold text-[#100906]">{item.name}</div>
                              <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-700 font-bold uppercase text-[9px] rounded-full">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#100906]">
                          {item.prices.Small} — {item.prices.Large}
                        </td>
                        <td className="py-3.5 px-4 font-mono">{item.calories || '—'} kcal</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setShowItemModal({
                                ...item,
                                priceSmall: item.prices?.Small || item.priceMin || '',
                                priceMedium: item.prices?.Medium || '',
                                priceLarge: item.prices?.Large || item.priceMax || '',
                                badge: item.badge || ''
                              })} 
                              className="p-1.5 text-gray-500 hover:text-[#C4430E] rounded-md hover:bg-gray-100"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => { 
                                setConfirmDelete({
                                  id: item.id,
                                  type: 'menu',
                                  name: item.name,
                                  action: async () => {
                                    const ok = await deleteMenuItem(item.id);
                                    if (ok) {
                                      showBanner('success', `Menu item "${item.name}" deleted successfully!`);
                                    } else {
                                      showBanner('error', `Failed to delete menu item "${item.name}".`);
                                    }
                                  }
                                });
                              }} 
                              className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                              title="Delete Item"
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
          )}



          {/* Staff Accounts Tab */}
          {activeTab === 'users' && currentUser?.role === 'Super Admin' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-display font-bold text-[#100906] text-sm uppercase">System Accounts</h3>
                <button
                  onClick={() => setShowItemModal('user')}
                  className="px-3 py-1.5 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-[10px] tracking-widest uppercase rounded-lg flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Register Staff Account
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-[#100906]/60 font-bold uppercase">
                      <th className="py-3 px-4">Employee Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Privilege Role</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {usersList.map((usr) => (
                      <tr key={usr.id}>
                        <td className="py-3.5 px-4 font-bold text-[#100906]">{usr.name}</td>
                        <td className="py-3.5 px-4 font-mono">{usr.email}</td>
                        <td className="py-3.5 px-4 font-semibold text-orange-600">{usr.role}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setConfirmDelete({
                                id: usr.id,
                                type: 'user',
                                name: usr.email,
                                action: async () => {
                                  const ok = await deleteUser(usr.id);
                                  if (ok) {
                                    showBanner('success', `User account for ${usr.email} deleted successfully!`);
                                  } else {
                                    showBanner('error', `Failed to delete user account for ${usr.email}.`);
                                  }
                                }
                              });
                            }}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activity Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-[#100906] text-sm uppercase pb-2 border-b border-gray-100">Administrator Activity Logs</h3>
              <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1 font-mono text-[11px] text-gray-500">
                {activityLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-gray-100/50">
                    <div>
                      <span className="text-orange-600 font-bold">[{log.email}]</span> {log.action}
                    </div>
                    <div className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'settings' && (
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              saveSection('System Settings', async () => {
                const s1 = await updateSettings(settingsForm);
                const s2 = await updateNavbarData(navbarForm);
                return s1 && s2;
              }); 
            }} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Restaurant / Site Name</label>
                  <input type="text" value={settingsForm.siteName} onChange={(e) => setSettingsForm({...settingsForm, siteName: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-xs font-display font-extrabold text-[#100906] uppercase tracking-wider mb-4">Website Logo & Accent Styling</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Logo Image URL</label>
                    <input 
                      type="text" 
                      value={navbarForm.logoImage || ''} 
                      onChange={(e) => setNavbarForm({...navbarForm, logoImage: e.target.value, logoType: 'image'})} 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" 
                      placeholder="https://..." 
                    />
                    <div className="mt-3">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Or Upload Custom Logo Image</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoUpload} 
                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-[#C4430E] hover:file:bg-amber-100" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Logo Text (Fallback / Alt)</label>
                      <input 
                        type="text" 
                        value={navbarForm.logoText} 
                        onChange={(e) => setNavbarForm({...navbarForm, logoText: e.target.value})} 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" 
                        placeholder="e.g. MEGA BYTES" 
                      />
                    </div>
                    {navbarForm.logoImage && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Preview:</span>
                        <img 
                          src={navbarForm.logoImage} 
                          alt="Logo Preview" 
                          className="max-h-12 object-contain bg-white p-1 rounded border border-gray-100" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Accent / Highlight Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={navbarForm.logoColor} onChange={(e) => setNavbarForm({...navbarForm, logoColor: e.target.value})} className="w-12 h-10 border border-gray-200 rounded-lg p-1 bg-white cursor-pointer" />
                      <input type="text" value={navbarForm.logoColor} onChange={(e) => setNavbarForm({...navbarForm, logoColor: e.target.value})} className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="e.g. #C4430E" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-lg shadow-sm flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save System Settings
                </button>
              </div>
            </form>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <form onSubmit={(e) => { e.preventDefault(); saveSection('SEO Settings', () => updateSEO(seoForm)); }} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Browser Meta Title</label>
                  <input type="text" value={seoForm.metaTitle} onChange={(e) => setSeoForm({...seoForm, metaTitle: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Meta Description Tag</label>
                  <textarea rows={3} value={seoForm.metaDescription} onChange={(e) => setSeoForm({...seoForm, metaDescription: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Search Keywords (comma-separated)</label>
                  <input type="text" value={seoForm.metaKeywords} onChange={(e) => setSeoForm({...seoForm, metaKeywords: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-[#C4430E] hover:bg-[#8D370B] text-white font-sans font-extrabold text-xs tracking-widest uppercase rounded-lg shadow-sm flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Search Settings
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Item Creator Modals */}
      {showItemModal && showItemModal !== 'user' && (
        <div className="fixed inset-0 z-50 bg-[#100906]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowItemModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display font-extrabold text-lg text-[#100906] tracking-tight uppercase mb-6">
              {showItemModal.id ? 'Edit Menu Item' : 'Create New Menu Item'}
            </h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                const data = {
                  name: showItemModal.name || '',
                  description: showItemModal.description || '',
                  category: showItemModal.category || 'Sizzlers',
                  image: showItemModal.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
                  calories: Number(showItemModal.calories) || 350,
                  badge: showItemModal.badge || '',
                  priceMin: Number(showItemModal.priceSmall) || 500,
                  priceMax: Number(showItemModal.priceLarge) || 1200,
                  prices: {
                    Small: Number(showItemModal.priceSmall) || 500,
                    Medium: Number(showItemModal.priceMedium) || 800,
                    Large: Number(showItemModal.priceLarge) || 1200
                  }
                };

                const ok = showItemModal.id 
                  ? await updateMenuItem(showItemModal.id, data) 
                  : await addMenuItem(data);

                setIsSubmitting(false);
                setShowItemModal(null);
                if (ok) {
                  showBanner('success', `Menu item successfully ${showItemModal.id ? 'updated' : 'created'}!`);
                } else {
                  showBanner('error', `Failed to ${showItemModal.id ? 'update' : 'create'} menu item.`);
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Item Name</label>
                  <input type="text" required value={showItemModal.name || ''} onChange={(e) => setShowItemModal({...showItemModal, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. Royal Swahili Lobster" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Description</label>
                  <textarea rows={2} required value={showItemModal.description || ''} onChange={(e) => setShowItemModal({...showItemModal, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Tender lobster simmered in rich coconut tamarind spices..." />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Menu Category</label>
                  <select value={showItemModal.category || 'Sizzlers'} onChange={(e) => setShowItemModal({...showItemModal, category: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                    {menuCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Calories (kcal)</label>
                  <input type="number" value={showItemModal.calories || 400} onChange={(e) => setShowItemModal({...showItemModal, calories: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Highlight Badge (Showcase on Home Page)</label>
                  <select 
                    value={showItemModal.badge || ''} 
                    onChange={(e) => setShowItemModal({...showItemModal, badge: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                  >
                    <option value="">No Badge (Standard Menu Item)</option>
                    <option value="Must Order">Must Order</option>
                    <option value="Popular">Popular</option>
                    <option value="Swahili Heritage">Swahili Heritage</option>
                    <option value="Kitale Favorite">Kitale Favorite</option>
                    <option value="Chef Special">Chef Special</option>
                    <option value="Best Seller">Best Seller</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Photo/Image</label>
                  <input type="text" value={showItemModal.image || ''} onChange={(e) => setShowItemModal({...showItemModal, image: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono mb-2" placeholder="https://images.unsplash.com/..." />
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsSubmitting(true);
                        const media = await uploadMediaFile(file);
                        setIsSubmitting(false);
                        if (media && media.url) {
                          setShowItemModal(prev => ({ ...prev, image: media.url }));
                          showBanner('success', 'Menu item image uploaded.');
                        } else {
                          showBanner('error', 'Upload failed.');
                        }
                      }} 
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-[#C4430E] hover:file:bg-amber-100" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Small Price (KSh)</label>
                  <input type="number" required value={showItemModal.priceSmall || ''} onChange={(e) => setShowItemModal({...showItemModal, priceSmall: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Medium Price (KSh)</label>
                  <input type="number" required value={showItemModal.priceMedium || ''} onChange={(e) => setShowItemModal({...showItemModal, priceMedium: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Large Price (KSh)</label>
                  <input type="number" required value={showItemModal.priceLarge || ''} onChange={(e) => setShowItemModal({...showItemModal, priceLarge: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowItemModal(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-[#C4430E] hover:bg-[#8D370B] text-white font-extrabold text-xs uppercase rounded-lg flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User creator modal */}
      {showItemModal === 'user' && (
        <div className="fixed inset-0 z-50 bg-[#100906]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowItemModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-display font-extrabold text-[#100906] text-sm uppercase mb-4">Register Administrator</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as any;
                const ok = await createUser({
                  name: form.elements.name.value,
                  email: form.elements.email.value,
                  password: form.elements.password.value,
                  role: form.elements.role.value
                });
                if (ok) {
                  setShowItemModal(null);
                  showBanner('success', 'Staff account created successfully!');
                } else {
                  showBanner('error', 'Failed to create user. It may already exist.');
                }
              }}
              className="space-y-4 font-sans text-xs"
            >
              <div>
                <label className="block font-bold text-gray-500 mb-1.5">Full Name</label>
                <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1.5">Email Address</label>
                <input type="email" name="email" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="john@megabytes.com" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1.5">Initial Password</label>
                <input type="password" name="password" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="••••••••" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1.5">Role Permission</label>
                <select name="role" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="Admin">Admin (Can edit everything except Users)</option>
                  <option value="Editor">Editor (Can edit copy/menu items only)</option>
                  <option value="Super Admin">Super Admin (Full access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowItemModal(null)} className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-[#C4430E] hover:bg-[#8D370B] text-white font-extrabold uppercase rounded-lg">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Sleek Custom Iframe-Safe Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[60] bg-[#100906]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-gray-100 relative"
            >
              <button
                onClick={() => setConfirmDelete(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all"
                aria-label="Close confirmation"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-[#100906] text-xs uppercase tracking-wider">
                    {confirmDelete.type === 'reset-defaults' ? 'Reset Database?' : 'Delete Confirmation'}
                  </h3>
                  <p className="font-sans text-xs text-gray-500 mt-2 leading-relaxed">
                    {confirmDelete.type === 'reset-defaults' 
                      ? 'Are you sure you want to reset all modifications and restore the original database seeds? This cannot be undone.'
                      : `Are you sure you want to remove "${confirmDelete.name}"? This action is permanent and cannot be undone.`}
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(null)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans font-bold text-xs uppercase rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await confirmDelete.action();
                      setConfirmDelete(null);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-sans font-extrabold text-xs uppercase rounded-lg transition-colors shadow-md shadow-red-600/10"
                  >
                    Yes, Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
