import { getAllCategories, getAllProducts } from "@/actions/catalog";
import AddCategory from "@/components/admin/add-category";
import AddProduct from "@/components/admin/add-product";
import CatalogClient from "@/components/catalog";
import { getObjectURL } from "@/lib/s3";

export default async function AdminCatalogMainPage({
    searchParams,
}: {
    searchParams: Promise<{
        categories?: string;
        sort?: "asc" | "desc";
        search?: string;
        page?: string;
        limit?: string;
    }>
}) {
    const categories = await getAllCategories();
    const params = await searchParams

    // Extract filters
    const selectedCategories = params.categories
        ? params.categories
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name)
        : [];
    const sortOrder = (params.sort as "asc" | "desc") || "asc";
    const searchQuery = params.search || "";
    const page = params.page ? parseInt(params.page, 10) : 1;
    const limit = params.limit ? parseInt(params.limit, 10) : 12;

    // Fetch products with filters, search, and pagination
    const { products, total, totalPages } = await getAllProducts({
        include: { categories: true, images: true },
        page,
        limit,
        // Later: add filtering/sorting params inside getAllProducts
    });

    // Attach signed image URLs
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
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                <AddCategory categories={categories} />
                <AddProduct categories={categories} />
            </div>

            <CatalogClient
                products={productsWithImageUrls}
                categories={categories}
                initialCategories={selectedCategories}
                initialSortOrder={sortOrder}
                initialSearchQuery={searchQuery}
                pagination={{ page, total, totalPages, limit }}
            />
        </div>
    );
}