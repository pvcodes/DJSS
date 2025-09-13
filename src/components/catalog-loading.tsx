import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function CatalogLoading() {
    return (
        <div className="container mx-auto py-4 px-2.5">
            {/* Search + Filters Section */}
            <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-18" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-22" />
                </div>

                {/* Active Filters Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
                {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="space-y-3">
                        {/* Product Image */}
                        <Skeleton className="aspect-square w-full rounded-lg" />

                        {/* Product Title */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>

                        {/* Product Price */}
                        <Skeleton className="h-5 w-20" />

                        {/* Product Categories */}
                        <div className="flex gap-1">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-12 rounded-full" />
                        </div>

                        {/* Add to Cart Button */}
                        <Skeleton className="h-9 w-full" />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled
                    variant="outline"
                >
                    Prev
                </Button>
                <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8" />
                </div>
                <Button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled
                    variant="outline"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}