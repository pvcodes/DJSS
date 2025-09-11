import { getAllProducts, getAllCategories } from "@/actions/catalog";
import CatalogClient from "@/components/catalog";
import { getObjectURL } from "@/lib/s3";

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: {
        categories?: string;
        sort?: "asc" | "desc";
        search?: string;
        page?: string;
        limit?: string;
    };
}) {
    const categories = await getAllCategories();
    categories.push({ id: -1, name: 'All', createdAt: new Date(), updatedAt: new Date() })

    // Extract query params
    const selectedCategories = searchParams.categories
        ? searchParams.categories
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name)
        : [];
    const sortOrder = (searchParams.sort as "asc" | "desc") || "asc";
    const searchQuery = searchParams.search || "";
    const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit, 10) : 2;

    // Fetch filtered + paginated products
    const { products, total, totalPages } = await getAllProducts({
        include: { images: true, categories: true },
        page,
        limit,
        categories: selectedCategories,
        search: searchQuery,
        sortOrder,
    });

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

    console.log(products[0])

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
