import { getAllProducts, getAllCategories } from "@/actions/catalog";
import CatalogClient from "@/components/catalog";
import { getObjectURL } from "@/lib/s3";

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ categories?: string; sort?: "asc" | "desc"; search?: string }>;
}) {
    const categories = await getAllCategories();
    const products = await getAllProducts({ include: { images: true, categories: true } });
    const params = await searchParams

    // Fetch presigned URLs for all images of each product
    const productsWithImageUrls = await Promise.all(
        products.map(async (product) => ({
            ...product,
            imageUrls: await Promise.all(
                product.images.map(async (image) => await getObjectURL(image.bucketKey) || "/placeholder.png")
            ),
        }))
    );

    const selectedCategories = params.categories
        ? params.categories.split(",").map((name) => name.trim()).filter((name) => name)
        : [];
    const sortOrder = params.sort || "asc";
    const searchQuery = params.search || "";

    return (
        <CatalogClient
            products={productsWithImageUrls}
            categories={categories}
            initialCategories={selectedCategories}
            initialSortOrder={sortOrder}
            initialSearchQuery={searchQuery}
        />
    );
}