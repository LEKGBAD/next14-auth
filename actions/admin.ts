
"use server"

import { currentRRole } from "@/lib/auth"
import { UserRole } from "@prisma/client"

export const admin=async ()=>{
    const role=await currentRRole()

    if(role===UserRole.ADMIN) return {success:"Allowed Server route"}

    return {error:"Forbidden server route"}
}