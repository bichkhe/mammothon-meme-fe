import { profile } from "console";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { url } from "inspector";
const schema = defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
    profileId: v.id("profiles"),
  }).index("byExternalId", ["externalId"]),
  profiles: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    bio: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("byEmail", ["email"]),
  memes: defineTable({
    name: v.string(),
    url: v.string(),
    addr: v.string(),
    icon: v.string(),
    market_cap: v.string(),
    price: v.optional(v.string()),
    volume: v.optional(v.string()),
    all_time_vol: v.optional(v.string()),
    change24h: v.optional(v.string()),
    last_swap_at: v.optional(v.string()),
    description: v.optional(v.string()),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_name", ["name"])
    .searchIndex("search_name", {
      searchField: "name",
    })
    .index("by_addr", ["addr"])
    .searchIndex("search_addr", {
      searchField: "addr",
    }),
  meme_images: defineTable({
    storage_id: v.id("_storage"),
    image: v.string(),
    created_at: v.string(),
  }).index("by_url", ["image"]),
  transactions: defineTable({
    coin_address: v.string(),
    commitment:v.string(),
    block_height:v.number(),
  }).index("by_memecoin", ["coin_address"]),
});
export default schema;
