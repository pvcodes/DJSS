import { getAllProducts, getAllCategories } from "@/actions/catalog";
import CatalogClient from "@/components/catalog";
import { getObjectURL } from "@/lib/s3";

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: Promise<{
        categories?: string;
        sort?: "asc" | "desc";
        search?: string;
        page?: string;
        limit?: string;
    }>;
}) {
    const params = await searchParams

    const categories = await getAllCategories();
    categories.push({ id: -1, name: 'All', createdAt: new Date(), updatedAt: new Date() })

    // Extract query params
    const selectedCategories = params.categories
        ? params.categories
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name)
        : [];
    const sortOrder = (params.sort as "asc" | "desc") || "asc";
    const searchQuery = params.search || "";
    const page = params.page ? parseInt(params.page, 10) : 1;
    const limit = params.limit ? parseInt(params.limit, 10) : 20;


    // Fetch filtered + paginated products
    const { products, total, totalPages } = await getAllProducts({
        include: { images: true, categories: true },
        page,
        limit,
        categories: selectedCategories,
        search: searchQuery,
        sortOrder,
    });

    // console.log(products)
    products.map(product => {
        console.log(product.categories)
    })

    // Attach presigned image URLs
    const productsWithImageUrls = await Promise.all(
        products.map(async (product) => ({
            ...product,
            imageUrls: await Promise.all(
                product.images.map(
                    async (image) =>
                        (await getObjectURL(image.bucketKey)) || "/placeholder.png"
                )
            ),
        }))
    );

    return (
        <CatalogClient
            products={productsWithImageUrls}
            categories={categories}
            initialCategories={selectedCategories}
            initialSortOrder={sortOrder}
            initialSearchQuery={searchQuery}
            pagination={{ page, total, totalPages, limit }}
        />
    );
}
