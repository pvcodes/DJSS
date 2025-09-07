'use client';
import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, X, Search, Filter, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    // CarouselNext,
    // CarouselPrevious,
} from "@/components/ui/carousel";

// Mock types since we don't have Prisma here
type Product = {
    id: string;
    name: string;
    price: number;
};

type Category = {
    id: string;
    name: string;
};

type ExtendedProduct = Product & { imageUrls: string[]; categories: Category[] };

interface CatalogClientProps {
    products: ExtendedProduct[];
    categories: Category[];
    initialCategories: string[];
    initialSortOrder: "asc" | "desc";
    initialSearchQuery: string;
}

// Mock TypographyH3 component
const TypographyH3 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h3 className={`text-2xl font-bold ${className || ''}`}>{children}</h3>
);

export default function CatalogClient({
    products = [],
    categories = [],
    initialCategories = [],
    initialSortOrder = "asc",
    initialSearchQuery = "",
}: CatalogClientProps) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [searchInput, setSearchInput] = useState(initialSearchQuery);

    // Fullscreen modal state
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenProduct, setFullscreenProduct] = useState<ExtendedProduct | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Debounce search query updates
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    // Update URL when filters change (debounced)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (typeof window === 'undefined') return;

            const url = new URL(window.location.href);

            if (selectedCategories.length > 0) {
                url.searchParams.set("categories", selectedCategories.join(","));
            } else {
                url.searchParams.delete("categories");
            }

            if (searchQuery) {
                url.searchParams.set("search", searchQuery);
            } else {
                url.searchParams.delete("search");
            }

            url.searchParams.set("sort", sortOrder);

            window.history.replaceState({}, "", url);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [selectedCategories, searchQuery, sortOrder]);

    // Handle escape key to close fullscreen
    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                closeFullscreen();
            }
        };

        if (isFullscreen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFullscreen]);

    const handleCategoryToggle = useCallback((categoryName: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter((name) => name !== categoryName)
                : [...prev, categoryName]
        );
    }, []);

    const handleSortChange = useCallback((value: "asc" | "desc") => {
        setSortOrder(value);
    }, []);

    const handleSearchInputChange = useCallback((value: string) => {
        setSearchInput(value);
    }, []);

    const clearCategory = useCallback((categoryName: string) => {
        setSelectedCategories(prev => prev.filter(name => name !== categoryName));
    }, []);

    const clearAllFilters = useCallback(() => {
        setSelectedCategories([]);
        setSearchInput("");
        setSearchQuery("");
        setSortOrder("asc");
    }, []);

    const openFullscreen = useCallback((product: ExtendedProduct) => {
        setFullscreenProduct(product);
        setCurrentImageIndex(0);
        setIsFullscreen(true);
    }, []);

    const closeFullscreen = useCallback(() => {
        setIsFullscreen(false);
        setFullscreenProduct(null);
        setCurrentImageIndex(0);
    }, []);

    const navigateImage = useCallback((direction: 'prev' | 'next') => {
        if (!fullscreenProduct || fullscreenProduct.imageUrls.length <= 1) return;

        setCurrentImageIndex(prev => {
            if (direction === 'prev') {
                return prev === 0 ? fullscreenProduct.imageUrls.length - 1 : prev - 1;
            } else {
                return prev === fullscreenProduct.imageUrls.length - 1 ? 0 : prev + 1;
            }
        });
    }, [fullscreenProduct]);

    const filteredProducts = useMemo(() => {
        return products
            .filter((product) =>
                selectedCategories.length === 0
                    ? true
                    : product.categories.some((cat) => selectedCategories.includes(cat.name))
            )
            .filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.categories.some(cat =>
                    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
            .sort((a, b) =>
                sortOrder === "asc" ? a.price - b.price : b.price - a.price
            );
    }, [products, selectedCategories, searchQuery, sortOrder]);

    const hasActiveFilters = selectedCategories.length > 0 || searchQuery.length > 0;

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                        <CardHeader className="pb-6 px-4 sm:px-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <TypographyH3>
                                        Product Catalog
                                    </TypographyH3>
                                    <CardDescription className="text-base mt-2">
                                        Discover {filteredProducts.length} amazing products
                                    </CardDescription>
                                </div>
                                <div className="hidden sm:block">
                                    <Badge variant="secondary" className="text-sm px-3 py-1">
                                        {products.length} Total Items
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="px-4 sm:px-6">
                            {/* Mobile-First Filters Section */}
                            <div className="space-y-4 mb-8">
                                {/* Search Bar */}
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    <Input
                                        id="search"
                                        value={searchInput}
                                        onChange={(e) => handleSearchInputChange(e.target.value)}
                                        placeholder="Search products..."
                                        className="pl-12 pr-4 py-3 text-base border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 transition-colors shadow-sm"
                                        aria-label="Search products"
                                    />
                                </div>

                                {/* Filter Controls */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Select>
                                        <SelectTrigger className="h-12 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                                            <div className="flex items-center">
                                                <Filter className="h-4 w-4 mr-2 text-slate-600" />
                                                <SelectValue placeholder="All Categories" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-2">
                                            <Command>
                                                <CommandList>
                                                    <CommandGroup>
                                                        {categories.map((category) => (
                                                            <CommandItem
                                                                key={category.id}
                                                                onSelect={() => handleCategoryToggle(category.name)}
                                                                className="flex justify-between items-center cursor-pointer py-3 px-4 rounded-lg"
                                                            >
                                                                <span className="font-medium">{category.name}</span>
                                                                {selectedCategories.includes(category.name) && (
                                                                    <Check className="h-4 w-4 text-green-600" />
                                                                )}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </SelectContent>
                                    </Select>

                                    <Select value={sortOrder} onValueChange={handleSortChange}>
                                        <SelectTrigger className="h-12 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm sm:w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-2">
                                            <SelectItem value="asc" className="py-3 px-4 rounded-lg">💰 Price: Low to High</SelectItem>
                                            <SelectItem value="desc" className="py-3 px-4 rounded-lg">💎 Price: High to Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Active Filters - Mobile Optimized */}
                                {hasActiveFilters && (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <div className="flex flex-wrap gap-2 flex-1">
                                                {selectedCategories.map((category) => (
                                                    <Badge key={category} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-0 rounded-full px-3 py-1">
                                                        {category}
                                                        <X
                                                            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600"
                                                            onClick={() => clearCategory(category)}
                                                            aria-label={`Remove ${category} filter`}
                                                        />
                                                    </Badge>
                                                ))}
                                                {searchQuery && (
                                                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border-0 rounded-full px-3 py-1">
                                                        {searchQuery}
                                                        <X
                                                            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-600"
                                                            onClick={() => {
                                                                setSearchInput("");
                                                                setSearchQuery("");
                                                            }}
                                                            aria-label="Clear search"
                                                        />
                                                    </Badge>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearAllFilters}
                                                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full px-3 py-1 mt-2 sm:mt-0"
                                            >
                                                Clear all
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Products Grid - Mobile Optimized */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {filteredProducts.map((product) => (
                                    <Card
                                        key={product.id}
                                        className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:-translate-y-2 rounded-2xl cursor-pointer"
                                        onClick={() => openFullscreen(product)}
                                    >
                                        <CardContent className="p-0">
                                            {/* Image Section */}
                                            <div className="relative">
                                                <Carousel className="w-full">
                                                    <CarouselContent>
                                                        {product.imageUrls.length > 0 ? (
                                                            product.imageUrls.map((imageUrl, index) => (
                                                                <CarouselItem key={index}>
                                                                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                                        <Image
                                                                            src={imageUrl}
                                                                            alt={`${product.name} - Image ${index + 1}`}
                                                                            fill
                                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                                        />
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                                        {/* Expand Icon */}
                                                                        <div className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                                            <Expand className="h-4 w-4 text-white" />
                                                                        </div>
                                                                    </div>
                                                                </CarouselItem>
                                                            ))
                                                        ) : (
                                                            <CarouselItem>
                                                                <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                                                    <div className="text-center">
                                                                        <div className="text-4xl mb-2">📦</div>
                                                                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                                                            No image available
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </CarouselItem>
                                                        )}
                                                    </CarouselContent>
                                                </Carousel>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-4 sm:p-5">
                                                <div className="mb-3">
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {product.name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {product.categories.slice(0, 2).map((cat) => (
                                                            <Badge
                                                                key={cat.id}
                                                                variant="secondary"
                                                                className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-0 rounded-full font-medium"
                                                            >
                                                                {cat.name}
                                                            </Badge>
                                                        ))}
                                                        {product.categories.length > 2 && (
                                                            <Badge className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 border-0 rounded-full">
                                                                +{product.categories.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Enhanced Empty State */}
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="text-8xl mb-6">🔍</div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                                        No products found
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg max-w-md mx-auto leading-relaxed">
                                        We couldn&apos;t find any products matching your criteria. Try adjusting your search or filters.
                                    </p>
                                    {hasActiveFilters && (
                                        <Button
                                            onClick={clearAllFilters}
                                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-full px-6 py-3 font-semibold shadow-lg"
                                        >
                                            🔄 Clear all filters
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && fullscreenProduct && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
                    {/* Close Button */}
                    <Button
                        onClick={closeFullscreen}
                        className="absolute top-4 right-4 z-[60] p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors group cursor-pointer"
                        aria-label="Close fullscreen view"
                    >
                        <X className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                    </Button>

                    {/* Product Info */}
                    <div className="absolute top-4 left-4 z-60 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white max-w-md">
                        <h2 className="text-xl font-bold mb-2">{fullscreenProduct.name}</h2>
                        <div className="flex flex-wrap gap-1">
                            {fullscreenProduct.categories.map((cat) => (
                                <Badge
                                    key={cat.id}
                                    className="bg-white/20 text-white border-0 text-xs"
                                >
                                    {cat.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Image Navigation */}
                    <div className="relative w-full h-full flex items-center justify-center px-16">
                        {fullscreenProduct.imageUrls.length > 0 ? (
                            <>
                                <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                                    <Image
                                        src={fullscreenProduct.imageUrls[currentImageIndex]}
                                        alt={`${fullscreenProduct.name} - Image ${currentImageIndex + 1}`}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                        priority
                                    />
                                </div>

                                {/* Navigation Arrows */}
                                {fullscreenProduct.imageUrls.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => navigateImage('prev')}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors group"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                                        </button>

                                        <button
                                            onClick={() => navigateImage('next')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors group"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                                        </button>
                                    </>
                                )}

                                {/* Image Counter */}
                                {fullscreenProduct.imageUrls.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                                        {currentImageIndex + 1} / {fullscreenProduct.imageUrls.length}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-white">
                                <div className="text-8xl mb-4">📦</div>
                                <p className="text-xl">No images available</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}