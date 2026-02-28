"use client"

import { useUser } from "@clerk/nextjs"
import { Id } from "../../convex/_generated/dataModel"
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PurchaseButton=({courseId}:{courseId:Id<"courses">})=>{
    const {user}=useUser();
    const userData = useQuery(api.users.getUserByClerkId,user ?{clerkId:user?.id}:"skip")
    const [IsLoading,setIsLoading]=useState(false);
    const createCheckoutSession = useAction(api.stripe.createCheckoutSession)
    const userAcess=useQuery(api.users.getUserAccess,userData?{
        userId:userData?._id,
        courseId
    }:"skip") || {hasAccess:false};

    const handlePurchase= async()=>{
         if(!user) return toast.error("Please login to purchase",{id:"login-error"});
         setIsLoading(true);
         try {
            const {checkoutUrl}=await createCheckoutSession({courseId})
            if(checkoutUrl){
                window.location.href=checkoutUrl
            }else{
                throw new Error("failed to create checkout session")
            }
            
         } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred";
            if(errorMessage.includes("Rate limit exceeded")){
                toast.error("You've tried too many times.Please try again later")
            }else{
                toast.error(errorMessage || "Something went wrong . Please try again later"); 
            }
            
         }finally{
            setIsLoading(false)
         }
    }
    if(!userAcess.hasAccess){
        return <Button variant={"outline"} onClick={handlePurchase} disabled={IsLoading}>
            Enroll Now
        </Button>
    }
    if(userAcess.hasAccess){
        return <Button variant={"outline"}>Enrolled</Button>
    }
    if(IsLoading){
        return <Button>
            <Loader2Icon className="mr-2 size-4 animate-spin"/>
            Processing...
        </Button>
    }
}
export default PurchaseButton