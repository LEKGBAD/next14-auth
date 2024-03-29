"use server"

import { signIn } from "@/auth"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth"
import * as z from "zod"


export const login=async (values:z.infer<typeof LoginSchema>,callbackurl?:string)=>{
    const validatedFields=LoginSchema.safeParse(values)
    if(!validatedFields.success){
        return {error:"Invalid credentials"}
    }
    const {email,password,code}=validatedFields.data

    const existingUser=await getUserByEmail(email);
    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error:"Invalid credentials"}
    }
    if(!existingUser.emailVerified){
        const verificationToken=await generateVerificationToken(existingUser.email)
        await sendVerificationEmail(verificationToken.email,verificationToken.token)
        return  {success:"Confirmation Email sent!"}
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email){
        if(code){
            const twoFactorToken=await getTwoFactorTokenByEmail(existingUser.email);
            if(!twoFactorToken) return {error:"Invalid code"}
            if(twoFactorToken.token !== code) return {error:"Invalid Code"}

            const hasExpired=new Date(twoFactorToken.expires) < new Date();
            if(hasExpired) return {error:"Code expired"}

            await db.twoFactorToken.delete({
                where:{
                    id:twoFactorToken.id
                }
            })
            const existingTwoFactorConfirmation=await getTwoFactorConfirmationByUserId(existingUser.id)
            if(existingTwoFactorConfirmation){
                console.log({old:existingTwoFactorConfirmation.id})
                await db.twoFactorConfirmation.delete({
                    where:{
                        userId:existingUser.id
                    }
                })
            }
            
            const newTwoFactorConfirmation=await db.twoFactorConfirmation.create({
                data:{
                  userId:existingUser.id
                }
              })
              console.log({new:newTwoFactorConfirmation.id})
        }
        else{
            const twoFactorToken=await generateTwoFactorToken(existingUser.email);

            await sendTwoFactorTokenEmail(twoFactorToken.email,twoFactorToken.token);
            return({twoFactor:true})

        }
        
    }
    try{
        await signIn("credentials",{
            email,
            password,
            redirectTo:callbackurl || DEFAULT_LOGIN_REDIRECT
        })
    }catch(err){
        if(err instanceof AuthError){
            switch(err.type){
                case "CredentialsSignin":
                    return {error:"Invalid credentials"}
                default:
                    return {error:"Something went wrong"}
            }
        }
        throw err
    }
}