import {profile} from "console";
import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";
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
    price: v.string(),
    volume: v.string(),
    all_time_vol: v.string(),
    change24h: v.string(),
    last_swap_at: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_name", ["name"]).searchIndex("search_name", {
    searchField: "name",
  }),

});
export default schema;
