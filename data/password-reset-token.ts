import { db } from "@/lib/db"


export const getPasswordResetTokeByToken=async (token:string)=>{
    try{
        const passwordResetToken=await db.passwordResetToken.findUnique({
            where:{
                token
            }
        })
        return passwordResetToken

    }catch(err){
        return null
    }
    
}

export const getPasswordResetTokeByEmail=async (email:string)=>{
    try{
        const passwordResetToken=await db.passwordResetToken.findFirst({
            where:{
                email
            }
        })
        return passwordResetToken

    }catch(err){
        return null
    }
    
}