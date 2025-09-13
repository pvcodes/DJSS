// "use client";

import React from "react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
// import { TypographyH2 } from "@/components/typography";
import { HomepageContact } from "@/components/contact";

const products = [
  {
    id: 1,
    title: "DJSS",
    price: "₹49,999",
    "img": "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200&auto=format&fit=crop",
    tag: "Best Seller",
  },
  {
    id: 2,
    title: "Diamond Studs",
    price: "₹29,499",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
    tag: "New",
  },
  {
    id: 3,
    title: "Polki Set",
    price: "₹89,999",
    img: "https://images.unsplash.com/photo-1607082344292-6f4a7b4b4f4b?q=80&w=1200&auto=format&fit=crop",
    tag: "Exclusive",
  },
];

export default async function DJSSHomepage() {
  return (
    <div className="md:px-6 py-4 p-2">
      {/* Hero Section */}
      <Card className="rounded-none border-0 shadow-none">
        <CardContent className="grid md:grid-cols-2 gap-8 items-center p-0">
          <div>
            <Badge className="mb-4">New Collection 2025</Badge>
            <CardTitle className="text-4xl md:text-5xl leading-tight">
              Timeless elegance. Modern silhouettes.
            </CardTitle>
            <p className="mt-4 text-lg text-slate-600">
              Discover handcrafted jewellery inspired by tradition and designed for today. Ethically sourced. Meticulously made.
            </p>
            <div className="mt-6 flex gap-3">
              <Link className={buttonVariants({
                variant: 'default', size: 'lg'
              })}
                href='/catalog'
              >Shop Collection</Link>
              <Button variant="outline" size="lg">Book a Consultation</Button>
            </div>
          </div>

          <Card className="overflow-hidden shadow-lg">
            <Image
              src={products[0].img}
              alt={products[0].title}
              width={900}
              height={700}
              className="w-full h-[420px] object-cover"
            />
          </Card>
        </CardContent>
      </Card>
      <Separator className="md:my-12 my-10" />

      {/* Services Section */}
      <Card id="services" className="rounded-none border-0 shadow-none">
        <CardHeader className="px-0">
          <CardTitle>Why choose DJSS?</CardTitle>
          <p className="text-slate-600">A blend of craft, trust and lasting value.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 px-0 pb-0">
          <Card className="p-6">
            <CardTitle>Certified Quality</CardTitle>
            <p className="text-slate-600 mt-2 text-sm">Hallmarked gold & certified diamonds you can trust.</p>
          </Card>
          <Card className="p-6">
            <CardTitle>Lifetime Service</CardTitle>
            <p className="text-slate-600 mt-2 text-sm">Free maintenance, cleaning & resizing.</p>
          </Card>
          <Card className="p-6">
            <CardTitle>Heritage Craft</CardTitle>
            <p className="text-slate-600 mt-2 text-sm">Designs inspired by tradition, perfected for today.</p>
          </Card>
        </CardContent>
      </Card>

      {/* <Separator className="md:my-12 my-10" /> */}
      <Separator className="my-5"/>

      <HomepageContact />

      {/* Contact Section */}
      {/* <div className="px-6 py-12">
      </div> */}
    </div>
  );
}