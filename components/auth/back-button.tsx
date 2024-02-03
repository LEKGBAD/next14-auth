"use client"

import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
    href:string;
    label:string;
}

const BackButton = ({
    label,
    href
}:BackButtonProps) => {
    return ( 
        <Button variant="link" size="sm" asChild className="font-normal w-full">
             <Link href={href}>{label}</Link>
        </Button>
     );
}
 
export default BackButton;