import { getAllCategories, getProduct } from "@/actions/catalog";
import SingleProductClient from "@/components/admin/product";
import { buttonVariants } from "@/components/ui/button";
import { getObjectURL } from "@/lib/s3";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default async function SingleProduct({ params }: { params: Promise<{ id: string }> }) {
    //   const user = await getAuthenticatedUser();
    const { id } = await params;
    const product = await getProduct(parseInt(id))
    if (!product) {
        return <>
            Kuch nahi hai
        </>
    }
    const allCategories = await getAllCategories()
    const productWithImageUrls = {
        ...product,
        images: await Promise.all(
            product!.images.map(async (image) => ({
                ...image,
                url: (await getObjectURL(image.bucketKey)) || "/placeholder.png"
            }))
        )
    };
    return <div className="bg-gray-50 pb-6 pt-2 pl-2">
        {/* {JSON.stringify(productWithImageUrls)} */}
        <Link href="/admin/catalog" className={buttonVariants({ variant: 'default' })}><MoveLeft /> Go Back</Link>
        <SingleProductClient initialProduct={productWithImageUrls} allCategories={allCategories} />
    </div>
}
