// app/catalog/CatalogClient.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { debounce } from "lodash";
import { Category, Product } from "@prisma/client";
import { ProductCatalog } from "@/components/catalog-product";
import { SearchFilterBar } from "./catalog-searchbar";
import { Button } from "./ui/button";

type ExtendedProduct = Product & { imageUrls: string[]; categories: Category[] };

interface CatalogClientProps {
    products: ExtendedProduct[];
    categories: Category[];
    initialCategories: string[];
    initialSortOrder: "asc" | "desc";
    initialSearchQuery: string;
    pagination: {
        page: number;
        total: number;
        totalPages: number;
        limit: number;
    };
}

export default function CatalogClient({
    products,
    categories,
    initialCategories,
    initialSortOrder,
    initialSearchQuery,
    pagination,
}: CatalogClientProps) {
    const router = useRouter();
    const pathName = usePathname()


    // "All" means no filter
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialCategories.length ? initialCategories : ["All"]
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
    const [searchInput, setSearchInput] = useState(initialSearchQuery);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery); // This will be used for URL building

    // Build URL using searchQuery instead of searchInput
    const buildURL = useCallback(
        (page: number, overrideSearch?: string) => {
            const params = new URLSearchParams();
            const activeCategories =
                selectedCategories.includes("All") || selectedCategories.length === 0
                    ? []
                    : selectedCategories;

            if (activeCategories.length) {
                params.set("categories", activeCategories.join(","));
            }
            if (sortOrder) params.set("sort", sortOrder);

            // Use override search if provided, otherwise use searchQuery
            const searchValue = overrideSearch !== undefined ? overrideSearch : searchQuery;
            if (searchValue) params.set("search", searchValue);

            if (page > 1) params.set("page", String(page));
            params.set("limit", String(pagination.limit));

            // 
            // alert()
            return `${pathName}/?${params.toString()}`;
        },
        [selectedCategories, sortOrder, searchQuery, pagination.limit, pathName]
    );

    const navigateToURL = useCallback(
        (page: number, overrideSearch?: string) => {
            router.push(buildURL(page, overrideSearch));
        },
        [router, buildURL]
    );

    // Debounced search - directly navigate with the search value
    /* eslint-disable react-hooks/exhaustive-deps */
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchQuery(value); // Update the search query state
            navigateToURL(1, value); // Pass the search value directly to avoid state timing issues
        }, 500),
        [navigateToURL]
    );

    const handleSearchInputChange = (value: string) => {
        setSearchInput(value); // Update input immediately for UI
        debouncedSearch(value); // Debounce the actual search
    };

    const handleSortChange = (value: "asc" | "desc") => {
        setSortOrder(value);
        navigateToURL(1);
    };

    const handleCategoryToggle = (categoryName: string) => {
        setSelectedCategories((prev) => {
            // If "All" is selected, only keep "All" and unselect everything else
            if (categoryName === "All") {
                return ["All"];
            }

            // If any specific category is selected while "All" is active, remove "All"
            let newCategories = prev.includes("All") ? [] : [...prev];

            // Toggle the selected category
            if (newCategories.includes(categoryName)) {
                newCategories = newCategories.filter((c) => c !== categoryName);
            } else {
                newCategories.push(categoryName);
            }

            // If no categories are selected, default back to "All"
            if (newCategories.length === 0) {
                newCategories = ["All"];
            }

            return newCategories;
        });
        navigateToURL(1);
    };

    const handleClearCategory = (categoryName: string) => {
        setSelectedCategories((prev) => {
            const updated = prev.filter((c) => c !== categoryName);
            return updated.length ? updated : ["All"];
        });
        navigateToURL(1);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearchQuery("");
        navigateToURL(1, ""); // Explicitly pass empty search
    };

    const clearAllFilters = () => {
        setSelectedCategories(["All"]);
        setSearchInput("");
        setSearchQuery("");
        setSortOrder("asc");
        navigateToURL(1, ""); // Explicitly pass empty search
    };

    // Sync search input when initial search query changes (e.g., from URL)
    useEffect(() => {
        setSearchInput(initialSearchQuery);
        setSearchQuery(initialSearchQuery);
    }, [initialSearchQuery]);

    const PaginationBar = () => {
        const goToPage = (newPage: number) => {
            if (newPage < 1 || newPage > pagination.totalPages) return;
            navigateToURL(newPage);
        };

        return (
            <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={pagination.page <= 1}
                    onClick={() => goToPage(pagination.page - 1)}
                    variant='outline'
                >
                    Prev
                </Button>
                <span className="text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => goToPage(pagination.page + 1)}
                    variant='outline'
                >
                    Next
                </Button>
            </div >
        );
    };

    return (
        <div className="container mx-auto py-4 px-2.5">
            {/* <div>
                <p>Search Input: {JSON.stringify(searchInput)}</p>
                <p>Search Query: {JSON.stringify(searchQuery)}</p>
                <p>Selected Categories: {JSON.stringify(selectedCategories)}</p>
            </div> */}
            {/* Search + Filters */}
            <SearchFilterBar
                searchInput={searchInput}
                onSearchInputChange={handleSearchInputChange}
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                searchQuery={searchQuery} // Use searchQuery for display in active filters
                onClearCategory={handleClearCategory}
                onClearSearch={handleClearSearch}
                onClearAllFilters={clearAllFilters}
            />

            {/* Products */}
            <ProductCatalog
                products={products}
                onProductClick={(product) => console.log("Clicked:", product)}
                hasActiveFilters={
                    !selectedCategories.includes("All") || !!searchQuery
                }
                onClearAllFilters={clearAllFilters}
            />

            <PaginationBar />
        </div>
    );
}