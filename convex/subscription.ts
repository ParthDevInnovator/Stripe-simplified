import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserSubscriptions=query({
    args:{userId:v.id("users")},
    handler:async(ctx,args)=>{
        const subscription=await ctx.db.query("subscription").filter(q=>q.eq(q.field("userId"),args.userId)).first();
        if(!subscription) return null;
        return subscription;
    }
})
export const upsertSubscription = mutation({
    args:{
        userId:v.id("users"),
        stripeSubscriptionId:v.string(),
        status:v.string(),
        planType:v.union(v.literal("month"),v.literal("years")),
        currentPeriodStart:v.number(),
        currentPeriodEnd:v.number(),
        cancelAtPeriodEnd:v.boolean(),
    },
    handler:async(ctx,args)=>{
        const existingSubscription = await ctx.db.query("subscription")
        .withIndex("by_stripeSubscriptionId",q=>q.eq("stripeSubscriptionId",args.stripeSubscriptionId))
        .unique();
        if(existingSubscription){
            await ctx.db.patch(existingSubscription._id,args);
        }else{
            const subscriptionId = await ctx.db.insert("subscription",args);
            await ctx.db.patch(args.userId, {currentSubscriptionId:subscriptionId});
        }
        return {success:true}
    }
})