"use client"

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import LoginForm from "./login-form";
import { useEffect, useState } from "react";

interface LoginButtonProps {
    children:React.ReactNode;
    mode?:"modal"|"redirect";
    asChild?:boolean;

}

const LoginButton = ({
    children,
    mode="redirect",
    asChild
}:LoginButtonProps) => {
    const [isLoaded,setIsloaded]=useState(false)
    // useEffect(()=>{
    //     setIsloaded(true)
    // },[])
    const router=useRouter();

    const onClick=()=>{
        router.push("/auth/login")
    }
    // if(!isLoaded) return null
    if (mode==="modal"){
        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0 w-auto bg-transparent border-none">
                    <LoginForm />
                </DialogContent>
            </Dialog>
        )
    }
    return ( 
        <span onClick={onClick}>{children}</span>
     );
}
 
export default LoginButton;