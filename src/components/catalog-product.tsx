// components/ProductCatalog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Expand, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Category, Product } from "@prisma/client";

type ExtendedProduct = Product & { imageUrls: string[]; categories: Category[] };

interface ProductCatalogProps {
    products: ExtendedProduct[];
    onProductClick: (product: ExtendedProduct) => void;
    hasActiveFilters: boolean;
    onClearAllFilters: () => void;
}

export function ProductCatalog({
    products,
    onProductClick,
    hasActiveFilters,
    onClearAllFilters,
}: ProductCatalogProps) {
    const router = useRouter();
    const { data } = useSession();

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

    const handleImagePreview = (imageUrl: string, allImages: string[]) => {
        const index = allImages.indexOf(imageUrl);
        setPreviewImages(allImages);
        setCurrentPreviewIndex(index);
        setPreviewImage(imageUrl);
    };

    const handlePreviewNext = () => {
        if (currentPreviewIndex < previewImages.length - 1) {
            const nextIndex = currentPreviewIndex + 1;
            setCurrentPreviewIndex(nextIndex);
            setPreviewImage(previewImages[nextIndex]);
        }
    };

    const handlePreviewPrevious = () => {
        if (currentPreviewIndex > 0) {
            const prevIndex = currentPreviewIndex - 1;
            setCurrentPreviewIndex(prevIndex);
            setPreviewImage(previewImages[prevIndex]);
        }
    };

    // Empty state
    if (products.length === 0) {
        return (
            <Card className="text-center py-16 shadow-md rounded-2xl">
                <CardContent>
                    <div className="text-7xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold mb-3">No products found</h3>
                    <p className="text-muted-foreground mb-6 text-lg max-w-md mx-auto leading-relaxed">
                        We couldn&apos;t find any products matching your criteria. Try
                        adjusting your search or filters.
                    </p>
                    {hasActiveFilters && (
                        <Button
                            onClick={onClearAllFilters}
                            className="rounded-full shadow-lg"
                            variant="default"
                        >
                            🔄 Clear all filters
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {products.map((product) => (
                    <Card
                        key={product.id}
                        className="group h-full overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl cursor-pointer"
                        onClick={() => onProductClick(product)}
                    >
                        {/* Product Images */}
                        <CardHeader className="p-0 relative">
                            {product.imageUrls.length > 0 ? (
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        {product.imageUrls.map((imageUrl, index) => (
                                            <CarouselItem key={index}>
                                                <div
                                                    className="relative aspect-[4/3] w-full overflow-hidden"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleImagePreview(imageUrl, product.imageUrls);
                                                    }}
                                                >
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
                                        ))}
                                    </CarouselContent>

                                    {/* Carousel Navigation - Only show if more than 1 image */}
                                    {product.imageUrls.length > 1 && (
                                        <>
                                            <CarouselPrevious
                                                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 border-0 hover:bg-black/70 text-white h-8 w-8"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <CarouselNext
                                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 border-0 hover:bg-black/70 text-white h-8 w-8"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </>
                                    )}

                                    {/* Image Indicators */}
                                    {product.imageUrls.length > 1 && (
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                            {product.imageUrls.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className="w-1.5 h-1.5 rounded-full bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </Carousel>
                            ) : (
                                // No images fallback
                                <div className="relative aspect-[4/3] w-full bg-muted flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">📦</div>
                                        <span className="text-muted-foreground text-sm font-medium">
                                            No image available
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardHeader>

                        {/* Product Info */}
                        <CardContent className="p-4 sm:p-5">
                            <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>

                            {/* Categories */}
                            {product.categories.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {product.categories.slice(0, 2).map((cat) => (
                                        <Badge
                                            key={cat.id}
                                            variant="secondary"
                                            className="text-xs px-2 py-0.5 rounded-full"
                                        >
                                            {cat.name}
                                        </Badge>
                                    ))}
                                    {product.categories.length > 2 && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs px-2 py-0.5 rounded-full"
                                        >
                                            +{product.categories.length - 2}
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Product Description Preview */}
                            {product.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {product.description}
                                </p>
                            )}
                        </CardContent>

                        {/* Admin Only Edit Button */}
                        {data?.user.isAdmin && (
                            <CardFooter className="p-4 border-t bg-muted/20">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 w-full rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/admin/catalog/product/${product.id}`);
                                    }}
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit Product
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>

            {/* Enhanced Image Preview Dialog */}
            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            Image Preview {previewImages.length > 1 && `(${currentPreviewIndex + 1} of ${previewImages.length})`}
                        </DialogTitle>
                    </DialogHeader>

                    {previewImage && (
                        <div className="relative">
                            <div className="relative w-full h-[70vh]">
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    fill
                                    className="object-contain rounded-lg"
                                />
                            </div>

                            {/* Navigation for preview dialog */}
                            {previewImages.length > 1 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-0 hover:bg-black/70 text-white"
                                        onClick={handlePreviewPrevious}
                                        disabled={currentPreviewIndex === 0}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-0 hover:bg-black/70 text-white"
                                        onClick={handlePreviewNext}
                                        disabled={currentPreviewIndex === previewImages.length - 1}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                    {/* Preview indicators */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {previewImages.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`w-2 h-2 rounded-full transition-colors ${index === currentPreviewIndex
                                                        ? 'bg-white'
                                                        : 'bg-white/50'
                                                    }`}
                                                onClick={() => {
                                                    setCurrentPreviewIndex(index);
                                                    setPreviewImage(previewImages[index]);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}