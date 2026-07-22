import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { DEFAULT_DB } from "./defaultData";
import { readDB, writeDB } from "./store";
import { UPLOADS_DIR, useBlob, uploadMiddleware, listMediaFiles, saveUploadedFile, deleteMediaFile } from "./media";

// In production, set a real JWT_SECRET env var (Vercel Project Settings -> Environment Variables).
// Falls back to a default so local dev works out of the box.
const JWT_SECRET = process.env.JWT_SECRET || "megabytes-premium-secret-key-13579";

// Log admin activities
async function logActivity(userId: string, email: string, action: string) {
  const db = await readDB();
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
  await writeDB(db);
}

// REST API Server Implementation
export function createApp() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));

  // Serve locally-uploaded images statically (only relevant for local dev;
  // on Vercel, uploads live in Blob storage and are served from their own URLs)
  if (!useBlob) {
    app.use("/uploads", express.static(UPLOADS_DIR));
  }

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
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = await readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    await logActivity(user.id, user.email, "User logged in successfully");

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    });
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    res.json({ user: req.user });
  });

  // API - Users (Super Admin Only)
  app.get("/api/users", authenticateToken, authorizeRoles("Super Admin"), async (req, res) => {
    const db = await readDB();
    const safeUsers = db.users.map(({ passwordHash, ...rest }) => rest);
    res.json(safeUsers);
  });

  app.post("/api/users", authenticateToken, authorizeRoles("Super Admin"), async (req: any, res) => {
    const { email, password, role, name } = req.body;
    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const db = await readDB();
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
    await writeDB(db);

    await logActivity(req.user.id, req.user.email, `Created new user: ${email} (${role})`);

    const { passwordHash, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  });

  app.delete("/api/users/:id", authenticateToken, authorizeRoles("Super Admin"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const targetUser = db.users[index];
    if (targetUser.role === "Super Admin" && db.users.filter((u) => u.role === "Super Admin").length <= 1) {
      return res.status(400).json({ error: "Cannot delete the last Super Admin" });
    }

    db.users.splice(index, 1);
    await writeDB(db);

    await logActivity(req.user.id, req.user.email, `Deleted user: ${targetUser.email}`);

    res.json({ success: true });
  });

  // API - Hero Management
  app.get("/api/hero", async (req, res) => {
    const db = await readDB();
    res.json(db.heroData);
  });

  app.put("/api/hero", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const db = await readDB();
    db.heroData = { ...db.heroData, ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, "Updated Hero Section Content");
    res.json(db.heroData);
  });

  // API - Navbar Management
  app.get("/api/navbar", async (req, res) => {
    const db = await readDB();
    res.json(db.navbarData);
  });

  app.put("/api/navbar", authenticateToken, authorizeRoles("Super Admin", "Admin"), async (req: any, res) => {
    const db = await readDB();
    db.navbarData = { ...db.navbarData, ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, "Updated Navigation settings & Navbar layout");
    res.json(db.navbarData);
  });

  // API - About Section
  app.get("/api/about", async (req, res) => {
    const db = await readDB();
    res.json(db.aboutData);
  });

  app.put("/api/about", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const db = await readDB();
    db.aboutData = { ...db.aboutData, ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, "Updated About Section stats and copy");
    res.json(db.aboutData);
  });

  // API - Features
  app.get("/api/features", async (req, res) => {
    const db = await readDB();
    res.json(db.chooseFeatures);
  });

  app.post("/api/features", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const db = await readDB();
    const newFeature = {
      id: `feat-${Date.now()}`,
      ...req.body,
    };
    db.chooseFeatures.push(newFeature);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Created Feature Card: ${newFeature.title}`);
    res.status(201).json(newFeature);
  });

  app.put("/api/features/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.chooseFeatures.findIndex((f) => f.id === id);
    if (index === -1) return res.status(404).json({ error: "Feature card not found" });

    db.chooseFeatures[index] = { ...db.chooseFeatures[index], ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Updated Feature Card: ${db.chooseFeatures[index].title}`);
    res.json(db.chooseFeatures[index]);
  });

  app.delete("/api/features/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.chooseFeatures.findIndex((f) => f.id === id);
    if (index === -1) return res.status(404).json({ error: "Feature card not found" });

    const deleted = db.chooseFeatures.splice(index, 1);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Deleted Feature Card: ${deleted[0].title}`);
    res.json({ success: true });
  });

  // API - Menu Categories
  app.get("/api/menu/categories", async (req, res) => {
    const db = await readDB();
    res.json(db.menuCategories);
  });

  app.post("/api/menu/categories", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const db = await readDB();
    const newCategory = {
      id: `cat-${Date.now()}`,
      displayOrder: db.menuCategories.length + 1,
      isVisible: true,
      ...req.body,
    };
    db.menuCategories.push(newCategory);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Added Menu Category: ${newCategory.name}`);
    res.status(201).json(newCategory);
  });

  app.put("/api/menu/categories/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.menuCategories.findIndex((c) => c.id === id);
    if (index === -1) return res.status(404).json({ error: "Category not found" });

    db.menuCategories[index] = { ...db.menuCategories[index], ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Updated Menu Category: ${db.menuCategories[index].name}`);
    res.json(db.menuCategories[index]);
  });

  app.delete("/api/menu/categories/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.menuCategories.findIndex((c) => c.id === id);
    if (index === -1) return res.status(404).json({ error: "Category not found" });

    const deleted = db.menuCategories.splice(index, 1);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Deleted Menu Category: ${deleted[0].name}`);
    res.json({ success: true });
  });

  // API - Menu Items
  app.get("/api/menu/items", async (req, res) => {
    const db = await readDB();
    res.json(db.menuItems);
  });

  app.post("/api/menu/items", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const db = await readDB();
    const newItem = {
      id: `menu-${Date.now()}`,
      ...req.body,
    };
    db.menuItems.push(newItem);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Created Menu Item: ${newItem.name}`);
    res.status(201).json(newItem);
  });

  app.put("/api/menu/items/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.menuItems.findIndex((i) => i.id === id);
    if (index === -1) return res.status(404).json({ error: "Menu item not found" });

    db.menuItems[index] = { ...db.menuItems[index], ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Updated Menu Item: ${db.menuItems[index].name}`);
    res.json(db.menuItems[index]);
  });

  app.delete("/api/menu/items/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.menuItems.findIndex((i) => i.id === id);
    if (index === -1) return res.status(404).json({ error: "Menu item not found" });

    const deleted = db.menuItems.splice(index, 1);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Deleted Menu Item: ${deleted[0].name}`);
    res.json({ success: true });
  });

  // API - Instagram Section
  app.get("/api/instagram", async (req, res) => {
    const db = await readDB();
    res.json(db.instagramPosts);
  });

  app.post("/api/instagram", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const db = await readDB();
    const newPost = {
      id: `ig-${Date.now()}`,
      likes: 0,
      comments: 0,
      ...req.body,
    };
    db.instagramPosts.push(newPost);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, "Added new Instagram post link");
    res.status(201).json(newPost);
  });

  app.put("/api/instagram/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.instagramPosts.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Instagram post not found" });

    db.instagramPosts[index] = { ...db.instagramPosts[index], ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, "Updated Instagram post details");
    res.json(db.instagramPosts[index]);
  });

  app.delete("/api/instagram/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.instagramPosts.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Instagram post not found" });

    db.instagramPosts.splice(index, 1);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, "Removed Instagram post integration link");
    res.json({ success: true });
  });

  // API - Contact copy
  app.get("/api/contact", async (req, res) => {
    const db = await readDB();
    res.json(db.contactData);
  });

  app.put("/api/contact", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const db = await readDB();
    db.contactData = { ...db.contactData, ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, "Updated restaurant contact details and hours");
    res.json(db.contactData);
  });

  // API - Footer
  app.get("/api/footer", async (req, res) => {
    const db = await readDB();
    res.json(db.footerData);
  });

  app.put("/api/footer", authenticateToken, authorizeRoles("Super Admin", "Admin"), async (req: any, res) => {
    const db = await readDB();
    db.footerData = { ...db.footerData, ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, "Updated Footer area content");
    res.json(db.footerData);
  });

  // API - Reservations
  app.get("/api/reservations", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req, res) => {
    const db = await readDB();
    res.json(db.reservations);
  });

  app.post("/api/reservations", async (req, res) => {
    const db = await readDB();
    const newReservation = {
      id: `res-${Date.now()}`,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    db.reservations.push(newReservation);
    await writeDB(db);
    res.status(201).json(newReservation);
  });

  app.put("/api/reservations/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.reservations.findIndex((r) => r.id === id);
    if (index === -1) return res.status(404).json({ error: "Reservation not found" });

    db.reservations[index] = { ...db.reservations[index], ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Updated reservation state for guest: ${db.reservations[index].name}`);
    res.json(db.reservations[index]);
  });

  app.delete("/api/reservations/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.reservations.findIndex((r) => r.id === id);
    if (index === -1) return res.status(404).json({ error: "Reservation not found" });

    const deleted = db.reservations.splice(index, 1);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Removed Table Reservation ID: ${id}`);
    res.json({ success: true });
  });

  // API - Events
  app.get("/api/events", async (req, res) => {
    const db = await readDB();
    res.json(db.events);
  });

  app.post("/api/events", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const db = await readDB();
    const newEvent = {
      id: `ev-${Date.now()}`,
      ...req.body,
    };
    db.events.push(newEvent);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Added Event: ${newEvent.title}`);
    res.status(201).json(newEvent);
  });

  app.put("/api/events/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.events.findIndex((e) => e.id === id);
    if (index === -1) return res.status(404).json({ error: "Event not found" });

    db.events[index] = { ...db.events[index], ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Updated Event details for: ${db.events[index].title}`);
    res.json(db.events[index]);
  });

  app.delete("/api/events/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.events.findIndex((e) => e.id === id);
    if (index === -1) return res.status(404).json({ error: "Event not found" });

    const deleted = db.events.splice(index, 1);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Deleted Event: ${deleted[0].title}`);
    res.json({ success: true });
  });

  // API - Testimonials
  app.get("/api/testimonials", async (req, res) => {
    const db = await readDB();
    res.json(db.testimonials);
  });

  app.post("/api/testimonials", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const db = await readDB();
    const newTestimonial = {
      id: `test-${Date.now()}`,
      ...req.body,
    };
    db.testimonials.push(newTestimonial);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Created Testimonial from: ${newTestimonial.name}`);
    res.status(201).json(newTestimonial);
  });

  app.put("/api/testimonials/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return res.status(404).json({ error: "Testimonial not found" });

    db.testimonials[index] = { ...db.testimonials[index], ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Updated Testimonial for: ${db.testimonials[index].name}`);
    res.json(db.testimonials[index]);
  });

  app.delete("/api/testimonials/:id", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { id } = req.params;
    const db = await readDB();
    const index = db.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return res.status(404).json({ error: "Testimonial not found" });

    const deleted = db.testimonials.splice(index, 1);
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, `Deleted Testimonial from: ${deleted[0].name}`);
    res.json({ success: true });
  });

  // API - Settings
  app.get("/api/settings", async (req, res) => {
    const db = await readDB();
    res.json(db.settings);
  });

  app.put("/api/settings", authenticateToken, authorizeRoles("Super Admin", "Admin"), async (req: any, res) => {
    const db = await readDB();
    db.settings = { ...db.settings, ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, "Updated system / site settings");
    res.json(db.settings);
  });

  // API - SEO
  app.get("/api/seo", async (req, res) => {
    const db = await readDB();
    res.json(db.seo);
  });

  app.put("/api/seo", authenticateToken, authorizeRoles("Super Admin", "Admin"), async (req: any, res) => {
    const db = await readDB();
    db.seo = { ...db.seo, ...req.body };
    await writeDB(db);
    await logActivity(req.user.id, req.user.email, "Updated metadata and SEO search settings");
    res.json(db.seo);
  });

  // API - Media Library File list
  app.get("/api/media", async (req, res) => {
    const mediaList = await listMediaFiles();
    res.json(mediaList);
  });

  // API - Upload Media File
  app.post("/api/media/upload", authenticateToken, uploadMiddleware.single("file"), async (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded" });
    }
    const saved = await saveUploadedFile(req.file);
    await logActivity(req.user.id, req.user.email, `Uploaded image: ${saved.filename}`);
    res.status(201).json(saved);
  });

  // API - Delete Media File
  app.delete("/api/media/:filename", authenticateToken, authorizeRoles("Super Admin", "Admin", "Editor"), async (req: any, res) => {
    const { filename } = req.params;
    const deleted = await deleteMediaFile(filename);

    if (deleted) {
      await logActivity(req.user.id, req.user.email, `Deleted image: ${filename}`);
      return res.json({ success: true });
    }
    res.status(404).json({ error: "File not found" });
  });

  // API - Activity Logs
  app.get("/api/logs", authenticateToken, authorizeRoles("Super Admin", "Admin"), async (req, res) => {
    const db = await readDB();
    res.json(db.activityLogs);
  });

  // API - Reset to defaults
  app.post("/api/reset-defaults", authenticateToken, authorizeRoles("Super Admin"), async (req: any, res) => {
    await writeDB(DEFAULT_DB);
    await logActivity(req.user.id, req.user.email, "Reset database settings to default values");
    res.json({ success: true, message: "Restored all settings to seed values successfully" });
  });


  return app;
}
