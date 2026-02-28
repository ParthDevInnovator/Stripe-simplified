"use client"

import { useUser } from "@clerk/nextjs"

const Propage = () => {
    const{user,isLoaded:isUserLoaded}=useUser();
  return (
    <div>
      Propage
    </div>
  )
}

export default Propage
