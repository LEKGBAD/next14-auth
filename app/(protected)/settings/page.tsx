"use client"

import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm} from "react-hook-form"
import { SettingsSchema } from "@/schemas";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";



const SettingsPage =() => {
    const user=useCurrentUser();
    const {update}=useSession()
    const [isPending,startransition]=useTransition()
    const [error,setError]=useState<string|undefined>()
    const [success,setSuccess]=useState<string|undefined>()
    const form=useForm<z.infer<typeof SettingsSchema>>({
        resolver:zodResolver(SettingsSchema),
        defaultValues:{
            name:user?.name||undefined,
            email:user?.email||undefined,
            password:undefined,
            newPassword:undefined,
            role:user?.role||undefined,
            isTwoFactorEnabled:user?.isTwoFactorEnabled||undefined
        }
    })
    const onSubmit=(values:z.infer<typeof SettingsSchema>)=>{
        startransition(()=>
        settings(values).then((res)=>{
            if(res?.success){
                update()
                setSuccess(res.success)
                toast.success(res?.success)
            }
            if(res?.error){
                setError(res.error)
                toast.error(res?.error)
            }
        } ).catch(()=>{
            setError("Something went wrong")
        })
        )

    }
    
    return ( 
        <Card className="w-[600px] ">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form  {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input 
                                    {...field}
                                    placeholder="John Doe"
                                    disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        {user?.isOAuth ===false && 
                        <>
                        <FormField 
                        control={form.control}
                        name="email"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input 
                                    {...field}
                                    placeholder="JohnDoe@example.com"
                                    type="email"
                                    disabled={isPending}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                        />

                        <FormField 
                        control={form.control}
                        name="password"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input 
                                    {...field}
                                    placeholder="******"
                                    disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="newPassword"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>New password</FormLabel>
                                <FormControl>
                                    <Input 
                                    {...field}
                                    placeholder="******"
                                    type="password"
                                    disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        </>}
                        <FormField 
                        control={form.control}
                        name="role"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                    <Select
                                     disabled={isPending}
                                     onValueChange={field.onChange}
                                     defaultValue={field.value}
                                     >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={UserRole.ADMIN}>
                                                Admin
                                            </SelectItem>
                                            <SelectItem value={UserRole.USER}>
                                                User
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                            </FormItem>
                        )}
                        />
                        {user?.isOAuth ===false &&
                        <FormField 
                        control={form.control}
                        name="isTwoFactorEnabled"
                        render={({field})=>(
                            <FormItem className="flex justify-between items-center rounded-lg border
                            p-3 shadow-sm">
                                <div className="space-y-0.5">
                                <FormLabel>Two Factor Authentication</FormLabel>
                                <FormDescription>Enable Two Factor Authentication for your account</FormDescription>
                                </div>
                                
                                <FormControl>
                                    <Switch 
                                    disabled={isPending}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        }
                        </div>
                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                        <Button disabled={isPending} type="submit">
                            Save
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
     );
}
 
export default SettingsPage;