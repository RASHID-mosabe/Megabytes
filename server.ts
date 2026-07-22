import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";

const PORT = 3000;
const JWT_SECRET = "megabytes-premium-secret-key-13579";
const DB_PATH = path.join(process.cwd(), "src", "db.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  },
});
const upload = multer({ storage });

// Database Interface
interface DB {
  users: any[];
  heroData: any;
  navbarData: any;
  aboutData: any;
  chooseFeatures: any[];
  menuCategories: any[];
  menuItems: any[];
  instagramPosts: any[];
  contactData: any;
  footerData: any;
  reservations: any[];
  events: any[];
  testimonials: any[];
  settings: any;
  seo: any;
  media: any[];
  activityLogs: any[];
}

// Default Seed Data
const DEFAULT_DB: DB = {
  users: [
    {
      id: "u1",
      email: "admin@megabytes.com",
      passwordHash: bcrypt.hashSync("admin123", 10),
      role: "Super Admin",
      name: "Super Admin",
    },
    {
      id: "u2",
      email: "editor@megabytes.com",
      passwordHash: bcrypt.hashSync("editor123", 10),
      role: "Editor",
      name: "Editor John",
    },
  ],
  heroData: {
    bgImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1400",
    pizzaImage: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=1000&auto=format&fit=crop&q=80",
    titleLine1: "PREMIUM",
    titleLine2: "CULINARY",
    titleLine3: "EXPERIENCE",
    description: "Indulge in artisanal Swahili, Indian, and Chinese dishes crafted with fresh local ingredients, exotic spices, and world-class culinary expertise in Kitale.",
    ratingValue: "4.9 Rating",
    ratingReviews: "2.4k+ Reviews",
    buttonText: "EXPLORE MENU",
    buttonLink: "#menu",
    overlayOpacity: 40,
    alignment: "left",
    isPublished: true,
  },
  navbarData: {
    logoText: "MEGA BYTES.",
    logoColor: "#C4430E",
    logoSize: "lg",
    logoType: "text",
    logoImage: "",
    sticky: true,
    transparent: false,
    ctaText: "Order Now",
    ctaLink: "#menu",
    navLinks: [
      { name: "Home", id: "home", href: "#home" },
      { name: "Menu", id: "menu", href: "#menu" },
      { name: "About Us", id: "about", href: "#features" },
      { name: "Contact", id: "contact", href: "#footer" },
    ],
  },
  aboutData: {
    title: "OUR CULINARY JOURNEY",
    subtitle: "ESTABLISHED 2018",
    paragraph1: "At Mega Bytes Restaurant, we believe that food is a celebration of heritage, family, and passion. Nestled in the heart of Kitale, our restaurant offers a culinary gateway connecting three distinct culinary worlds: traditional Swahili specialties, sizzled Chinese delicacies, and deeply aromatic Indian spices.",
    paragraph2: "Our master chefs hand-select fresh local produce and combine them with authentic imported spices to deliver rich flavor profiles that have won the hearts of the Trans-Nzoia community. Whether you are enjoying a peaceful family lunch, celebrating with friends, or ordering delivery to your home, we are dedicated to providing impeccable quality and attentive hospitality.",
    stat1Value: "50+",
    stat1Label: "Gourmet Dishes",
    stat2Value: "8+",
    stat2Label: "Master Chefs",
    stat3Value: "15k+",
    stat3Label: "Happy Diners",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600",
    badge: "Dine in Serenity",
    cardTitle: "THE PREMIUM KITALE STANDARD",
    cardDescription: "Cozy wood accents, modern layout, and ambient warm lighting.",
  },
  chooseFeatures: [
    {
      id: "feat-1",
      title: "Serene Atmosphere",
      description: "Catering to different dining preferences with beautifully designed indoor & outdoor garden seating options in Kitale.",
      iconName: "Sprout",
    },
    {
      id: "feat-2",
      title: "Authentic Fusion Culinary",
      description: "An exceptional diverse menu featuring fresh Swahili staples, classic North Indian curries, and Indo-Chinese favorites.",
      iconName: "Sparkles",
    },
    {
      id: "feat-3",
      title: "Attentive & Serene Service",
      description: "Renowned among locals and visitors alike for warm hospitality, cozy table setups, and exceptionally friendly staff.",
      iconName: "Truck",
    },
  ],
  menuCategories: [
    { id: "cat-1", name: "Sizzlers", displayOrder: 1, isVisible: true },
    { id: "cat-2", name: "Swahili", displayOrder: 2, isVisible: true },
    { id: "cat-3", name: "Indian", displayOrder: 3, isVisible: true },
    { id: "cat-4", name: "Chinese", displayOrder: 4, isVisible: true },
    { id: "cat-5", name: "Sides", displayOrder: 5, isVisible: true },
  ],
  menuItems: [
    {
      id: "sz1",
      name: "Mega Chicken Sizzler",
      description: "Our standout signature dish: succulent grilled chicken breast marinated in exotic spices, served sizzling hot with roasted veggies, seasoned chips, and our house-secret sizzler glaze.",
      priceMin: 1200,
      priceMax: 1800,
      prices: { Small: 1200, Medium: 1500, Large: 1800 },
      image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80",
      category: "Sizzlers",
      ingredients: ["Spiced Grilled Chicken", "Sizzling Onions & Peppers", "House Glaze", "Crispy Potato Wedges", "Fresh Herbs"],
      tags: ["Best Seller", "Signature", "Sizzling"],
      badge: "Must Order",
      calories: 780,
    },
    {
      id: "sz2",
      name: "Garden Vegetable Sizzler",
      description: "A steaming sizzler plate packed with grilled paneer, crispy garden broccoli, bell peppers, carrots, and mushrooms tossed in chef’s signature aromatic glaze.",
      priceMin: 950,
      priceMax: 1450,
      prices: { Small: 950, Medium: 1200, Large: 1450 },
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
      category: "Sizzlers",
      ingredients: ["Grilled Paneer", "Fresh Broccoli", "Assorted Bell Peppers", "Exotic Mushrooms", "Garlic Glaze"],
      tags: ["Vegetarian", "Healthy", "Steaming"],
      badge: "Popular",
      calories: 540,
    },
    {
      id: "sw1",
      name: "Swahili Beef Pilau",
      description: "Fragrant, slow-simmered basmati rice infused with traditional Swahili spices, served with tender beef cubes and a side of fresh Kachumbari salad.",
      priceMin: 650,
      priceMax: 950,
      prices: { Small: 650, Medium: 800, Large: 950 },
      image: "https://images.unsplash.com/photo-1567153051010-b9894e77242c?w=800&auto=format&fit=crop&q=80",
      category: "Swahili",
      ingredients: ["Aromatic Pilau Rice", "Marinated Beef", "Cardamom & Cloves", "Kachumbari (Tomato & Onion)", "Chili twist"],
      tags: ["Locals Choice", "Authentic"],
      badge: "Swahili Heritage",
      calories: 650,
    },
    {
      id: "sw2",
      name: "Samaki wa Kupaka",
      description: "Local fresh lake fish char-grilled to absolute perfection and coated with a rich, creamy Swahili coconut-tamarind sauce.",
      priceMin: 850,
      priceMax: 1250,
      prices: { Small: 850, Medium: 1050, Large: 1250 },
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
      category: "Swahili",
      ingredients: ["Grilled Tilapia Fish", "Creamy Coconut Milk", "Tamarind Paste", "Ginger-Garlic Crush", "Fresh Lime"],
      tags: ["Seafood", "Rich Curry"],
      badge: "Chef Special",
      calories: 590,
    },
    {
      id: "in1",
      name: "Creamy Palak Paneer",
      description: "Often cited as Kitale’s favorite vegetarian delight. Silky, spiced spinach curry studded with cubes of fresh pan-seared cottage cheese.",
      priceMin: 750,
      priceMax: 1150,
      prices: { Small: 750, Medium: 950, Large: 1150 },
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
      category: "Indian",
      ingredients: ["Fresh Spinach Puree", "Paneer (Cottage Cheese)", "Garam Masala", "Fresh Cream", "Ginger & Garlic"],
      tags: ["Vegetarian", "Highly Rated"],
      badge: "Kitale Favorite",
      calories: 460,
    },
    {
      id: "in2",
      name: "Mouthwatering Butter Chicken",
      description: "Juicy tandoori chicken chunks cooked in a rich, velvety tomato butter gravy, infused with fenugreek leaves and cream.",
      priceMin: 850,
      priceMax: 1300,
      prices: { Small: 850, Medium: 1100, Large: 1300 },
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
      category: "Indian",
      ingredients: ["Tandoori Spiced Chicken", "Velvety Tomato Gravy", "Pure Butter & Cream", "Kasuri Methi", "Almond Paste"],
      tags: ["Rich", "Mild Spicy"],
      badge: "Best Seller",
      calories: 680,
    },
    {
      id: "ch1",
      name: "Fiery Chili Chicken",
      description: "A go-to for Indo-Chinese cravings. Crispy chicken chunks tossed in a dark, sweet, spicy, and tangy soy-chili reduction with spring onions.",
      priceMin: 800,
      priceMax: 1200,
      prices: { Small: 800, Medium: 1000, Large: 1200 },
      image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80",
      category: "Chinese",
      ingredients: ["Wok-Fried Chicken Chunks", "Tangy Soy-Chili Glaze", "Green Peppers", "Garlic & Ginger", "Fresh Scallions"],
      tags: ["Indo-Chinese", "Spicy", "Tangy"],
      badge: "Popular",
      calories: 510,
    },
    {
      id: "sd1",
      name: "Mouth-Watering Garlic Chips",
      description: "Our legendary side dish. Golden, crispy hand-cut chips tossed in a savory garlic herb butter infusion, sprinkled with fresh cilantro.",
      priceMin: 350,
      priceMax: 550,
      prices: { Small: 350, Medium: 450, Large: 550 },
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80",
      category: "Sides",
      ingredients: ["Hand-Cut Potatoes", "Roasted Garlic Butter", "Fresh Parsley & Cilantro", "Sea Salt Flakes"],
      tags: ["Legendary Side", "Garlicky", "Crispy"],
      badge: "Mouth-Watering",
      calories: 390,
    },
    {
      id: "sd2",
      name: "Butter & Garlic Naan Trio",
      description: "The ultimate bread pairing for your curries. Fresh tandoor-baked flatbreads brushed generously with salted butter and crushed garlic.",
      priceMin: 200,
      priceMax: 350,
      prices: { Small: 200, Medium: 280, Large: 350 },
      image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&auto=format&fit=crop&q=80",
      category: "Sides",
      ingredients: ["Tandoor Flatbread", "Melted Ghee Butter", "Fresh Minced Garlic", "Coriander Leaves"],
      tags: ["Bread Pairing", "Fluffy"],
      calories: 290,
    },
  ],
  instagramPosts: [
    {
      id: "ig-1",
      imageUrl: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop&q=80",
      likes: 1245,
      comments: 48,
      caption: "Sizzling hot, smoky goodness! Our legendary Chicken Sizzler has Kitale talking. 🍗🔥 #sizzler #foodie #kitale #megabytes",
      url: "https://instagram.com",
    },
    {
      id: "ig-2",
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80",
      likes: 984,
      comments: 32,
      caption: "Creamy, rich Palak Paneer paired with hot garlic naan bread is the perfect serene dinner plan. 🥬🍛 #indian #paneer #megabytes",
      url: "https://instagram.com",
    },
    {
      id: "ig-3",
      imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80",
      likes: 1530,
      comments: 76,
      caption: "Golden, crispy hand-cut chips tossed in garlic-herb butter. Simply mouth-watering! 🧄🍟 #garlicchips #kitale #swahili",
      url: "https://instagram.com",
    },
    {
      id: "ig-4",
      imageUrl: "https://images.unsplash.com/photo-1567153051010-b9894e77242c?w=500&auto=format&fit=crop&q=80",
      likes: 2110,
      comments: 112,
      caption: "Aromatic, spice-infused Swahili Pilau cooked with love. Experience authentic hospitality today. 🌾🍛 #pilau #swahili #kenya",
      url: "https://instagram.com",
    },
  ],
  contactData: {
    address: "2925 Mak Asembo Street, Kitale, Kenya",
    phone: "+254 714 069599",
    email: "hello@megabyteskitale.com",
    website: "www.megabyteskitale.com",
    hoursWeekdays: "8:00 AM — 10:00 PM",
    hoursWeekends: "9:00 AM — 11:00 PM",
    whatsapp: "+254 714 069599",
    mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1764619717544!2d35.0048633!3d1.011666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMDAnNDIuMCJOIDM1wrAwMCcxNy41IkU!5e0!3m2!1sen!2ske!4v1620000000000",
  },
  footerData: {
    logoText: "MEGA BYTES",
    description: "Bringing the premium culinary fusion of Swahili heritage, spiced Indian delicacies, and sizzled Chinese standard into Trans-Nzoia county.",
    copyright: "© 2026 Mega Bytes Restaurant. All Rights Reserved.",
  },
  reservations: [],
  events: [
    {
      id: "ev1",
      title: "Swahili Cultural Night",
      date: "Every Friday, 7:00 PM",
      description: "Enjoy authentic Swahili Biryani and live traditional Taarab music in our beautiful garden.",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
      price: "1500",
    },
    {
      id: "ev2",
      title: "Indian Sizzling Buffet",
      date: "Saturdays 12:00 PM - 4:00 PM",
      description: "An unlimited culinary feast featuring butter chicken, paneer, and our legendary sizzlers.",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
      price: "2000",
    },
  ],
  testimonials: [
    {
      id: "test1",
      name: "Abdi Ibrahim",
      role: "Local Diner",
      comment: "The Swahili Beef Pilau is incredibly authentic, just like what you get at the coast. Warm staff and a stunning serene seating area!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: "test2",
      name: "Sophia Patel",
      role: "Visitor from Nairobi",
      comment: "Unbelievable fusion concept. The Mega Chicken Sizzler is the absolute best sizzler in Western Kenya. Impeccable presentation and flavor.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    },
  ],
  settings: {
    siteName: "Mega Bytes Restaurant",
    currency: "KSh",
    taxRate: 16,
    enableReservations: true,
  },
  seo: {
    metaTitle: "Mega Bytes - Premium Restaurant in Kitale",
    metaDescription: "The best Swahili, Indian, and Chinese fusion kitchen in Trans-Nzoia. Experience our sizzling specialities today.",
    metaKeywords: "Restaurant, Kitale, Swahili food, Indian curry, Chinese sizzlers, food delivery",
  },
  media: [],
  activityLogs: [],
};

// Database helper functions
function readDB(): DB {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, returning default", err);
    return DEFAULT_DB;
  }
}

function writeDB(data: DB) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// Log admin activities
function logActivity(userId: string, email: string, action: string) {
  const db = readDB();
  db.activityLogs.unshift({
    id: `log-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    userId,
    email,
    action,
    timestamp: new Date().toISOString(),
  });
  // Keep last 100 logs
  if (db.activityLogs.length > 100) {
    db.activityLogs = db.activityLogs.slice(0, 100);
  }
  writeDB(db);
}

// REST API Server Implementation
async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));

  // Serve uploaded images statically
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Initialize DB file
  readDB();

  // Authentication Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token missing" });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = user;
      next();
    });
  };

  // Roles Authorization Middleware
  const authorizeRoles = (...roles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Unauthorized access: privilege level insufficient" });
      }
      next();
    };
  };

  // API - Auth Routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    logActivity(user.id, user.email, "User logged in successfully");

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    res.json({ user: req.user });
  });

  // API - Users (Super Admin Only)
  app.get("/api/users", authenticateToken, authorizeRoles("Super Admin"), (req, res) => {
    const db = readDB();
    const safeUsers = db.users.map(({ passwordHash, ...rest }) => rest);
    res.json(safeUsers);
  });

  app.post("/api/users", authenticateToken, authorizeRoles("Super Admin"), (req: any, res) => {
    const { email, password, role, name } = req.body;
    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const db = readDB();
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = {
      id: `u-${Date.now()}`,
      email: email.toLowerCase(),
      passwordHash: bcrypt.hashSync(password, 10),
      role,
      name,
    };

    db.users.push(newUser);
    writeDB(db);

    logActivity(req.user.id, req.user.email, `Created new user: ${email} (${role})`);

    const { passwordHash, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  });

  app.delete("/api/users/:id", authenticateToken, authorizeRoles("Super Admin"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const targetUser = db.users[index];
    if (targetUser.role === "Super Admin" && db.users.filter((u) => u.role === "Super Admin").length <= 1) {
      return res.status(400).json({ error: "Cannot delete the last Super Admin" });
    }

    db.users.splice(index, 1);
    writeDB(db);

    logActivity(req.user.id, req.user.email, `Deleted user: ${targetUser.email}`);

    res.json({ success: true });
  });

  // API - Hero Management
  app.get("/api/hero", (req, res) => {
    const db = readDB();
    res.json(db.heroData);
  });

  app.put("/api/hero", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const db = readDB();
    db.heroData = { ...db.heroData, ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, "Updated Hero Section Content");
    res.json(db.heroData);
  });

  // API - Navbar Management
  app.get("/api/navbar", (req, res) => {
    const db = readDB();
    res.json(db.navbarData);
  });

  app.put("/api/navbar", authenticateToken, authorizeRoles("Super Admin", "Admin"), (req: any, res) => {
    const db = readDB();
    db.navbarData = { ...db.navbarData, ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, "Updated Navigation settings & Navbar layout");
    res.json(db.navbarData);
  });

  // API - About Section
  app.get("/api/about", (req, res) => {
    const db = readDB();
    res.json(db.aboutData);
  });

  app.put("/api/about", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const db = readDB();
    db.aboutData = { ...db.aboutData, ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, "Updated About Section stats and copy");
    res.json(db.aboutData);
  });

  // API - Features
  app.get("/api/features", (req, res) => {
    const db = readDB();
    res.json(db.chooseFeatures);
  });

  app.post("/api/features", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const db = readDB();
    const newFeature = {
      id: `feat-${Date.now()}`,
      ...req.body,
    };
    db.chooseFeatures.push(newFeature);
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Created Feature Card: ${newFeature.title}`);
    res.status(201).json(newFeature);
  });

  app.put("/api/features/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.chooseFeatures.findIndex((f) => f.id === id);
    if (index === -1) return res.status(404).json({ error: "Feature card not found" });

    db.chooseFeatures[index] = { ...db.chooseFeatures[index], ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Updated Feature Card: ${db.chooseFeatures[index].title}`);
    res.json(db.chooseFeatures[index]);
  });

  app.delete("/api/features/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.chooseFeatures.findIndex((f) => f.id === id);
    if (index === -1) return res.status(404).json({ error: "Feature card not found" });

    const deleted = db.chooseFeatures.splice(index, 1);
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Deleted Feature Card: ${deleted[0].title}`);
    res.json({ success: true });
  });

  // API - Menu Categories
  app.get("/api/menu/categories", (req, res) => {
    const db = readDB();
    res.json(db.menuCategories);
  });

  app.post("/api/menu/categories", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const db = readDB();
    const newCategory = {
      id: `cat-${Date.now()}`,
      displayOrder: db.menuCategories.length + 1,
      isVisible: true,
      ...req.body,
    };
    db.menuCategories.push(newCategory);
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Added Menu Category: ${newCategory.name}`);
    res.status(201).json(newCategory);
  });

  app.put("/api/menu/categories/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.menuCategories.findIndex((c) => c.id === id);
    if (index === -1) return res.status(404).json({ error: "Category not found" });

    db.menuCategories[index] = { ...db.menuCategories[index], ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Updated Menu Category: ${db.menuCategories[index].name}`);
    res.json(db.menuCategories[index]);
  });

  app.delete("/api/menu/categories/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.menuCategories.findIndex((c) => c.id === id);
    if (index === -1) return res.status(404).json({ error: "Category not found" });

    const deleted = db.menuCategories.splice(index, 1);
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Deleted Menu Category: ${deleted[0].name}`);
    res.json({ success: true });
  });

  // API - Menu Items
  app.get("/api/menu/items", (req, res) => {
    const db = readDB();
    res.json(db.menuItems);
  });

  app.post("/api/menu/items", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const db = readDB();
    const newItem = {
      id: `menu-${Date.now()}`,
      ...req.body,
    };
    db.menuItems.push(newItem);
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Created Menu Item: ${newItem.name}`);
    res.status(201).json(newItem);
  });

  app.put("/api/menu/items/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.menuItems.findIndex((i) => i.id === id);
    if (index === -1) return res.status(404).json({ error: "Menu item not found" });

    db.menuItems[index] = { ...db.menuItems[index], ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Updated Menu Item: ${db.menuItems[index].name}`);
    res.json(db.menuItems[index]);
  });

  app.delete("/api/menu/items/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.menuItems.findIndex((i) => i.id === id);
    if (index === -1) return res.status(404).json({ error: "Menu item not found" });

    const deleted = db.menuItems.splice(index, 1);
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Deleted Menu Item: ${deleted[0].name}`);
    res.json({ success: true });
  });

  // API - Instagram Section
  app.get("/api/instagram", (req, res) => {
    const db = readDB();
    res.json(db.instagramPosts);
  });

  app.post("/api/instagram", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const db = readDB();
    const newPost = {
      id: `ig-${Date.now()}`,
      likes: 0,
      comments: 0,
      ...req.body,
    };
    db.instagramPosts.push(newPost);
    writeDB(db);
    logActivity(req.user.id, req.user.email, "Added new Instagram post link");
    res.status(201).json(newPost);
  });

  app.put("/api/instagram/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.instagramPosts.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Instagram post not found" });

    db.instagramPosts[index] = { ...db.instagramPosts[index], ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, "Updated Instagram post details");
    res.json(db.instagramPosts[index]);
  });

  app.delete("/api/instagram/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.instagramPosts.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Instagram post not found" });

    db.instagramPosts.splice(index, 1);
    writeDB(db);
    logActivity(req.user.id, req.user.email, "Removed Instagram post integration link");
    res.json({ success: true });
  });

  // API - Contact copy
  app.get("/api/contact", (req, res) => {
    const db = readDB();
    res.json(db.contactData);
  });

  app.put("/api/contact", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const db = readDB();
    db.contactData = { ...db.contactData, ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, "Updated restaurant contact details and hours");
    res.json(db.contactData);
  });

  // API - Footer
  app.get("/api/footer", (req, res) => {
    const db = readDB();
    res.json(db.footerData);
  });

  app.put("/api/footer", authenticateToken, authorizeRoles("Super Admin", "Admin"), (req: any, res) => {
    const db = readDB();
    db.footerData = { ...db.footerData, ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, "Updated Footer area content");
    res.json(db.footerData);
  });

  // API - Reservations
  app.get("/api/reservations", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req, res) => {
    const db = readDB();
    res.json(db.reservations);
  });

  app.post("/api/reservations", (req, res) => {
    const db = readDB();
    const newReservation = {
      id: `res-${Date.now()}`,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    db.reservations.push(newReservation);
    writeDB(db);
    res.status(201).json(newReservation);
  });

  app.put("/api/reservations/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.reservations.findIndex((r) => r.id === id);
    if (index === -1) return res.status(404).json({ error: "Reservation not found" });

    db.reservations[index] = { ...db.reservations[index], ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Updated reservation state for guest: ${db.reservations[index].name}`);
    res.json(db.reservations[index]);
  });

  app.delete("/api/reservations/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.reservations.findIndex((r) => r.id === id);
    if (index === -1) return res.status(404).json({ error: "Reservation not found" });

    const deleted = db.reservations.splice(index, 1);
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Removed Table Reservation ID: ${id}`);
    res.json({ success: true });
  });

  // API - Events
  app.get("/api/events", (req, res) => {
    const db = readDB();
    res.json(db.events);
  });

  app.post("/api/events", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const db = readDB();
    const newEvent = {
      id: `ev-${Date.now()}`,
      ...req.body,
    };
    db.events.push(newEvent);
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Added Event: ${newEvent.title}`);
    res.status(201).json(newEvent);
  });

  app.put("/api/events/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.events.findIndex((e) => e.id === id);
    if (index === -1) return res.status(404).json({ error: "Event not found" });

    db.events[index] = { ...db.events[index], ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Updated Event details for: ${db.events[index].title}`);
    res.json(db.events[index]);
  });

  app.delete("/api/events/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.events.findIndex((e) => e.id === id);
    if (index === -1) return res.status(404).json({ error: "Event not found" });

    const deleted = db.events.splice(index, 1);
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Deleted Event: ${deleted[0].title}`);
    res.json({ success: true });
  });

  // API - Testimonials
  app.get("/api/testimonials", (req, res) => {
    const db = readDB();
    res.json(db.testimonials);
  });

  app.post("/api/testimonials", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const db = readDB();
    const newTestimonial = {
      id: `test-${Date.now()}`,
      ...req.body,
    };
    db.testimonials.push(newTestimonial);
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Created Testimonial from: ${newTestimonial.name}`);
    res.status(201).json(newTestimonial);
  });

  app.put("/api/testimonials/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return res.status(404).json({ error: "Testimonial not found" });

    db.testimonials[index] = { ...db.testimonials[index], ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Updated Testimonial for: ${db.testimonials[index].name}`);
    res.json(db.testimonials[index]);
  });

  app.delete("/api/testimonials/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return res.status(404).json({ error: "Testimonial not found" });

    const deleted = db.testimonials.splice(index, 1);
    writeDB(db);
    logActivity(req.user.id, req.user.email, `Deleted Testimonial from: ${deleted[0].name}`);
    res.json({ success: true });
  });

  // API - Settings
  app.get("/api/settings", (req, res) => {
    const db = readDB();
    res.json(db.settings);
  });

  app.put("/api/settings", authenticateToken, authorizeRoles("Super Admin", "Admin"), (req: any, res) => {
    const db = readDB();
    db.settings = { ...db.settings, ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, "Updated system / site settings");
    res.json(db.settings);
  });

  // API - SEO
  app.get("/api/seo", (req, res) => {
    const db = readDB();
    res.json(db.seo);
  });

  app.put("/api/seo", authenticateToken, authorizeRoles("Super Admin", "Admin"), (req: any, res) => {
    const db = readDB();
    db.seo = { ...db.seo, ...req.body };
    writeDB(db);
    logActivity(req.user.id, req.user.email, "Updated metadata and SEO search settings");
    res.json(db.seo);
  });

  // API - Media Library File list
  app.get("/api/media", (req, res) => {
    const files = fs.readdirSync(UPLOADS_DIR);
    const mediaList = files.map((file) => {
      const filePath = path.join(UPLOADS_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        id: file,
        filename: file,
        url: `/uploads/${file}`,
        size: (stats.size / 1024).toFixed(1) + " KB",
        createdAt: stats.birthtime.toISOString(),
      };
    });
    res.json(mediaList);
  });

  // API - Upload Media File
  app.post("/api/media/upload", authenticateToken, upload.single("file"), (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    logActivity(req.user.id, req.user.email, `Uploaded image: ${req.file.filename}`);
    res.status(201).json({
      id: req.file.filename,
      filename: req.file.filename,
      url: fileUrl,
      size: (req.file.size / 1024).toFixed(1) + " KB",
    });
  });

  // API - Delete Media File
  app.delete("/api/media/:filename", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), (req: any, res) => {
    const { filename } = req.params;
    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logActivity(req.user.id, req.user.email, `Deleted image: ${safeFilename}`);
      return res.json({ success: true });
    }
    res.status(404).json({ error: "File not found" });
  });

  // API - Activity Logs
  app.get("/api/logs", authenticateToken, authorizeRoles("Super Admin", "Admin"), (req, res) => {
    const db = readDB();
    res.json(db.activityLogs);
  });

  // API - Reset to defaults
  app.post("/api/reset-defaults", authenticateToken, authorizeRoles("Super Admin"), (req: any, res) => {
    writeDB(DEFAULT_DB);
    logActivity(req.user.id, req.user.email, "Reset database settings to default values");
    res.json({ success: true, message: "Restored all settings to seed values successfully" });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
