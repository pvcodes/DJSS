'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return <div className="text-center">
    <h1 >Dharmendra Singh Jitendra Singh Saraaf</h1>
    <Button onClick={() => router.push('/sms')}>Khata</Button>
  </div>

}
