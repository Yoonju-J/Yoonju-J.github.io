import { db } from "./db";
import { eq, asc, inArray } from "drizzle-orm";
import {
  profiles, links,
  type Profile, type InsertProfile, type UpdateProfileRequest,
  type Link, type InsertLink, type UpdateLinkRequest
} from "@shared/schema";

export interface IStorage {
  // Profiles
  getProfile(userId: string): Promise<Profile | undefined>;
  getProfileByUsername(username: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: UpdateProfileRequest): Promise<Profile>;

  // Links
  getLinks(profileId: number): Promise<Link[]>;
  getLink(id: number): Promise<Link | undefined>;
  createLink(link: InsertLink): Promise<Link>;
  updateLink(id: number, updates: UpdateLinkRequest): Promise<Link>;
  deleteLink(id: number): Promise<void>;
  reorderLinks(profileId: number, orderedIds: number[]): Promise<Link[]>;
}

export class DatabaseStorage implements IStorage {
  // Profiles
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async getProfileByUsername(username: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.username, username));
    return profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(userId: string, updates: UpdateProfileRequest): Promise<Profile> {
    const [updated] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.userId, userId))
      .returning();
    return updated;
  }

  // Links
  async getLinks(profileId: number): Promise<Link[]> {
    return await db
      .select()
      .from(links)
      .where(eq(links.profileId, profileId))
      .orderBy(asc(links.order));
  }

  async getLink(id: number): Promise<Link | undefined> {
    const [link] = await db.select().from(links).where(eq(links.id, id));
    return link;
  }

  async createLink(link: InsertLink): Promise<Link> {
    // Get max order
    const currentLinks = await this.getLinks(link.profileId);
    const order = currentLinks.length;
    
    const [newLink] = await db
      .insert(links)
      .values({ ...link, order })
      .returning();
    return newLink;
  }

  async updateLink(id: number, updates: UpdateLinkRequest): Promise<Link> {
    const [updated] = await db
      .update(links)
      .set(updates)
      .where(eq(links.id, id))
      .returning();
    return updated;
  }

  async deleteLink(id: number): Promise<void> {
    await db.delete(links).where(eq(links.id, id));
  }

  async reorderLinks(profileId: number, orderedIds: number[]): Promise<Link[]> {
    // Update order for each link
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx
          .update(links)
          .set({ order: i })
          .where(eq(links.id, orderedIds[i]));
      }
    });
    return this.getLinks(profileId);
  }
}

export const storage = new DatabaseStorage();
