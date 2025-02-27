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

export const getTransaction = mutation({
  args: {
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db.query("transactions").withIndex("by_memecoin").filter((q) =>q.eq(q.field("coin_address"),args.address)).collect();
    return transactions;
  },
});
export const saveTransaction = mutation({
  args: {
    address:v.string(),
    commitment:v.string(),
    block_height:v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("transactions",{
      coin_address:args.address,
      commitment:args.commitment,
      block_height:args.block_height,
    });
  },
});
export const updateContract = mutation({
  args: {
    address:v.string(),
    ethAmount:v.string(),
    price:v.string(),
    token_buy: v.number()
  },
  handler: async (ctx, args) => {
    const meme = await ctx.db.query("memes").withIndex("by_addr").filter((q) =>q.eq(q.field("addr"),args.address)).first();
    if (!meme) {
      throw new Error(`Meme with address ${args.address} not found`);
    }
    const new_all_time_price = args.price ? parseFloat(args.price) : 0;
    const last_all_time_price = meme.all_time_price ? parseFloat(meme.all_time_price) : 0;
    meme.current_minted_token =  meme.current_minted_token? meme.current_minted_token + args.token_buy : args.token_buy; 
    const new_all_time_vol = parseFloat(args.ethAmount) + parseFloat(meme.all_time_vol ?? "0");
    if (new_all_time_price > last_all_time_price){
      await ctx.db.patch(meme._id, {
        all_time_vol:new_all_time_vol.toString(),
        price:args.price,
        all_time_price:args.price,
        updated_at:new Date().toISOString(),
        current_minted_token:meme.current_minted_token,
        volume: new_all_time_vol.toString(),
      });
    }
    else{
      await ctx.db.patch(meme._id, {
        all_time_vol:new_all_time_price.toString(),
        price:args.price,
        updated_at:new Date().toISOString(),
        current_minted_token:meme.current_minted_token,
        volume: new_all_time_vol.toString(),
      });
    }
  }});