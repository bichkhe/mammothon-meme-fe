import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: { storageId: v.id("_storage"), image: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("meme_images", {
      storage_id: args.storageId,
      image: args.image,
      created_at: new Date().toISOString(),
    });
  },
});

export const queryByStorageId = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx: any, args) => {
    const image = await ctx.db
      .query("meme_images")
      .filter((meme: any) => meme.storage_id === args.storageId)
      .collect();
    return image;
  },
});
