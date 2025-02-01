import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("memes").collect();
  },
});
// export const searchTokens = query({
//   args: {
//     query: v.string(),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.query("memes").filter((meme: any) => meme.name.includes(args.query)).collect();
//   },
// });

// export const searchTokens2 = query({
//   args: {
//     query: v.string(),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.query("memes").collect();
//   },
// });

export const search = query({
  args: {
    query: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("memes").withSearchIndex("search_name", (q: any) =>  q.search("name", args.query)).collect();
    // return await ctx.db.query("memes")
    //   .withSearchIndex("search_name", (q: any) => q.search("name", args.query))
    //   .paginate(args.paginationOpts)
    // return await ctx.db.query("memes").filter((q: any) => q.includes(q.field("name", args.query))).collect();
  },
});