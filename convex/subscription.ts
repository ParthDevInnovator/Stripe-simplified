import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserSubscriptions=query({
    args:{userId:v.id("users")},
    handler:async(ctx,args)=>{
        const subscription=await ctx.db.query("subscriptions").filter(q=>q.eq(q.field("userId"),args.userId)).first();
        if(!subscription) return null;
        return subscription;
    }
})