import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const memes =  await ctx.db.query("memes").collect();

    return Promise.all(
      memes.map(async (meme) => ({
        ...meme,
        ...(meme.icon.includes("png") || meme.icon.includes("jpg")
          ? {  icon: meme.icon}
          : {
            icon:  await ctx.storage.getUrl(meme.icon),
          }),
      })),
    );
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
    const memes  =  await ctx.db.query("memes").withSearchIndex("search_name", (q: any) =>  q.search("name", args.query)).collect();

    return Promise.all(
      memes.map(async (meme) => ({
        ...meme,
        ...(meme.icon.includes("png") || meme.icon.includes("jpg")
          ? {  icon:  await ctx.storage.getUrl(meme.icon)}
          : {
            icon:  await ctx.storage.getUrl(meme.icon),
          }),
      })),
    );
    // return await ctx.db.query("memes")
    //   .withSearchIndex("search_name", (q: any) => q.search("name", args.query))
    //   .paginate(args.paginationOpts)
    // return await ctx.db.query("memes").filter((q: any) => q.includes(q.field("name", args.query))).collect();
  },
});

export const getMeme = query({
  args: {
    addr: v.string(),
  },
  handler: async (ctx, args) => {
    const meme = await ctx.db
      .query("memes")
      .withIndex("by_addr", (q) => q.eq("addr", args.addr))
      .first();
    if (!meme) {
      // throw new Error(`Meme with address ${args.addr} not found`);
      return null;
    }
    if (meme.icon.includes("png") || meme.icon.includes("jpg")){
      meme.icon = meme.icon;
    }else {
      meme.icon = (await ctx.storage.getUrl(meme.icon)) ?? ""
    }
    return meme;
  },
});


export const createMeme = mutation({
  args: {
    meme: v.object({
      name: v.string(),
      addr: v.string(),
      market_cap: v.string(),
      icon: v.string(),
      url: v.string(),
      description: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("memes",{
      ...args.meme,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },
});


