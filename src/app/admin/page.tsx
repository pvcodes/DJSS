'use client'
import { TypographyH3 } from "@/components/typography";
import { Button } from "@/components/ui/button";
// import UpdatingSoon from "@/components/updating-soon";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter()
    return <>
        <div>
            <TypographyH3 className="text-center">Admin Dashboard</TypographyH3>
            <div>
                <Button variant='secondary' onClick={() => router.push('/admin/catalog')} >Catalog Settings</Button>
            </div>
        </div>
    </>
}
