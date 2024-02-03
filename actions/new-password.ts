"use server"

import { getPasswordResetTokeByToken } from "@/data/password-reset-token"
import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"
import { NewPasswordSchema} from "@/schemas"
import * as z from "zod"
import bcrypt from "bcryptjs"

export const newPassword=async (values:z.infer<typeof NewPasswordSchema>,token?:string|null)=>{
    if(!token) return {error:"Missing token!"}

    const validatedFields=NewPasswordSchema.safeParse(values)
    if(!validatedFields.success) return {error:"Invalied input"}

    const {password}=validatedFields.data

    const passwordResetToken=await getPasswordResetTokeByToken(token);
    if(!passwordResetToken) return {error:"Invalid Token!"}

    const hasExpired=new Date(passwordResetToken.expires) < new Date();
    if(hasExpired) return {error:"Token has expired"}

    const existingUser=await getUserByEmail(passwordResetToken.email)

    if(!existingUser) return {error:"Email does not exist"}

    const hashedPassword=await bcrypt.hash(password,10)
    
    await db.user.update({
        where:{
            id:existingUser.id
        },
        data:{
            password:hashedPassword
        }
    })

    await db.passwordResetToken.delete({
        where:{
            id:passwordResetToken.id
        }
    })

    return {success:"Password updated!"}
}