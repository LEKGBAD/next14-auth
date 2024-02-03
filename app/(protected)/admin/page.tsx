"use client"
import { admin } from "@/actions/admin";
import RoleGate from "@/components/auth/role-gate";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserInfo from "@/components/user-info";
import { useCurrentRole } from "@/hooks/use-current-role";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
    const user=useCurrentUser()

    const onApiRouteClick=async()=>{
        fetch("/api/admin").then((res)=>{
            if(res.ok) {toast.success("Allowed API Route")}
            else {toast.error("Forbidden API Route")}
        })
    }

    const onServerRouteClick= ()=>{
        admin().then((res)=>{
            if(res.success){
                toast.success(res?.success)
            }
            else{
                toast.error(res?.error)
            }
        })
    }
    return ( 
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Admin
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message="You are allowed to see this"/>
                </RoleGate>
                <div className="flex items-center justify-between rounded-lg p-3 border shadow-md">
                    <p className="text-sm font-medium">
                        Admin only API route
                    </p>
                    <Button onClick={onApiRouteClick}>
                        Click to test
                    </Button>
                    
                </div>
                <div className="flex items-center justify-between rounded-lg p-3 border shadow-md">
                    <p className="text-sm font-medium">
                        Admin only server action
                    </p>
                    <Button onClick={onServerRouteClick}>
                        Click to test
                    </Button>
                    
                </div>
            </CardContent>
        </Card>
     );
}
 
export default AdminPage;