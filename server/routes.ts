import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes, isAuthenticated, authStorage } from "./replit_integrations/auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Profile Routes
  app.get(api.profiles.me.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const profile = await storage.getProfile(userId);
    res.json(profile || null);
  });

  app.post(api.profiles.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const username = req.user.username; // Note: Replit auth might not give username directly in claims, use input
      
      const existing = await storage.getProfile(userId);
      if (existing) {
        return res.status(400).json({ message: "Profile already exists" });
      }

      const input = api.profiles.create.input.parse(req.body);
      
      // Check username uniqueness
      const usernameTaken = await storage.getProfileByUsername(input.username);
      if (usernameTaken) {
        return res.status(400).json({ message: "Username already taken", field: "username" });
      }

      const profile = await storage.createProfile({ ...input, userId });
      res.status(201).json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.profiles.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.profiles.update.input.parse(req.body);
      
      if (input.username) {
        const existing = await storage.getProfileByUsername(input.username);
        if (existing && existing.userId !== userId) {
           return res.status(400).json({ message: "Username already taken", field: "username" });
        }
      }

      const profile = await storage.updateProfile(userId, input);
      res.json(profile);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.profiles.getByUsername.path, async (req, res) => {
    const { username } = req.params;
    const profile = await storage.getProfileByUsername(username);
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const links = await storage.getLinks(profile.id);
    const visibleLinks = links.filter(l => l.isVisible);
    
    res.json({ profile, links: visibleLinks });
  });

  // Link Routes
  app.get(api.links.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const profile = await storage.getProfile(userId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    
    const links = await storage.getLinks(profile.id);
    res.json(links);
  });

  app.post(api.links.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getProfile(userId);
      if (!profile) return res.status(404).json({ message: "Profile not found" });

      const input = api.links.create.input.parse(req.body);
      const link = await storage.createLink({
        ...input,
        profileId: profile.id,
        order: 0, // Storage handles order logic
      });
      res.status(201).json(link);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.links.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const linkId = parseInt(req.params.id);
      
      const profile = await storage.getProfile(userId);
      if (!profile) return res.status(404).json({ message: "Profile not found" });

      const link = await storage.getLink(linkId);
      if (!link || link.profileId !== profile.id) {
        return res.status(404).json({ message: "Link not found" });
      }

      const input = api.links.update.input.parse(req.body);
      const updated = await storage.updateLink(linkId, input);
      res.json(updated);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.links.delete.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const linkId = parseInt(req.params.id);

    const profile = await storage.getProfile(userId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const link = await storage.getLink(linkId);
    if (!link || link.profileId !== profile.id) {
      return res.status(404).json({ message: "Link not found" });
    }

    await storage.deleteLink(linkId);
    res.status(204).send();
  });

  app.post(api.links.reorder.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const profile = await storage.getProfile(userId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const { ids } = api.links.reorder.input.parse(req.body);
    const links = await storage.reorderLinks(profile.id, ids);
    res.json(links);
  });

  // Seed demo data
  const demoProfile = await storage.getProfileByUsername("demo");
  if (!demoProfile) {
    const userId = "demo-user-id";
    // Create demo profile if not exists (upsertUser needed first?) 
    // We need a user in 'users' table because of FK.
    // We can't easily insert into 'users' because it's managed by AuthStorage which expects full auth record?
    // Actually authStorage.upsertUser takes Partial/InsertUser.
    
    // Let's try to insert a fake user first
    try {
        await authStorage.upsertUser({
            id: userId,
            email: "demo@example.com",
            firstName: "Demo",
            lastName: "User",
            profileImageUrl: "https://placehold.co/400"
        } as any); // Type cast if needed, or import from auth types
        
        const profile = await storage.createProfile({
            userId: userId,
            username: "demo",
            bio: "Welcome to Bio Linker! This is a demo profile.",
            theme: "custom",
            backgroundColor: "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
            textColor: "#ffffff",
            buttonColor: "rgba(255, 255, 255, 0.2)",
            buttonTextColor: "#ffffff",
            font: "Inter"
        });
        
        await storage.createLink({ profileId: profile.id, title: "My Portfolio", url: "https://replit.com", icon: "Globe", order: 0, isVisible: true });
        await storage.createLink({ profileId: profile.id, title: "Twitter", url: "https://twitter.com", icon: "Twitter", order: 1, isVisible: true });
        await storage.createLink({ profileId: profile.id, title: "Instagram", url: "https://instagram.com", icon: "Instagram", order: 2, isVisible: true });
        
        console.log("Seeded demo profile: /demo");
    } catch (e) {
        console.error("Failed to seed demo data:", e);
    }
  }

  return httpServer;
}
