// loading.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag, ImageIcon } from 'lucide-react';

export default function SingleProductLoading() {
    return (
        <div className="py-2 space-y-4">
            {/* Header and Categories Combined Card */}
            <Card>
                <CardContent className="pt-6 space-y-6">
                    {/* Title Section */}
                    <div className="space-y-4">
                        {/* Mobile: Title and Edit Button in same row */}
                        <div className="flex items-start justify-between gap-3">
                            <Skeleton className="h-7 flex-1" />
                            <Skeleton className="h-9 w-16 shrink-0" />
                        </div>

                        {/* Desktop: Category controls */}
                        <div className="hidden md:flex gap-2 items-center justify-end">
                            <Skeleton className="h-10 w-48" />
                            <Skeleton className="h-10 w-16" />
                        </div>

                        {/* Mobile: Category selector and add button */}
                        <div className="flex md:hidden gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-16 shrink-0" />
                        </div>
                    </div>

                    {/* Current Categories */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Categories</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-7 w-20 rounded-full" />
                            <Skeleton className="h-7 w-24 rounded-full" />
                            <Skeleton className="h-7 w-16 rounded-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Images Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            <Skeleton className="h-6 w-24" />
                        </CardTitle>
                        <Skeleton className="h-9 w-20" />
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Images Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="relative group">
                                <Skeleton className="aspect-square rounded-lg" />
                                {/* Delete button skeleton */}
                                <div className="absolute top-2 right-2">
                                    <Skeleton className="h-8 w-8 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}