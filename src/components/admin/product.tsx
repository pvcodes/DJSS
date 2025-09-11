'use client'

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Plus, Edit, Save, X, Upload, Tag, Image as ImageIcon } from 'lucide-react';
import { Category, Product, ProductImage } from '@prisma/client';
import Image from 'next/image';
import { addImagesToProduct, deleteProductImage, updateProduct } from '@/actions/catalog';
import { toast } from 'sonner';
import { generateUniqueBucketKey } from '@/lib/utils';
import { TypographyP } from '../typography';

interface ProductWithImage extends Product {
    images: Array<ProductImage & { url: string }>;
}

interface SingleProductClientProps {
    initialProduct: ProductWithImage & { categories: Category[] };
    allCategories: Category[];
}

export default function SingleProductClient({ initialProduct, allCategories }: SingleProductClientProps) {
    const [product, setProduct] = useState(initialProduct);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(product.name);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTitleSave = async () => {
        if (!editedTitle.trim()) {
            toast.error('Title cannot be empty');
            return;
        }

        setProduct(prev => ({ ...prev, name: editedTitle.trim() }));
        setIsEditingTitle(false);

        try {
            await updateProduct(product.id, { name: editedTitle.trim() });
            toast.success('Title updated');
        } catch {
            toast.error('Failed to update title');
            setProduct(prev => ({ ...prev, name: product.name })); // Revert on error
        }
    };

    const handleTitleCancel = () => {
        setEditedTitle(product.name);
        setIsEditingTitle(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        } else if (e.key === 'Escape') {
            handleTitleCancel();
        }
    };

    const handleAddCategory = async () => {
        if (!selectedCategory) return;

        const categoryToAdd = allCategories.find(cat => cat.id === parseInt(selectedCategory));
        if (!categoryToAdd || product.categories.find(cat => cat.id === categoryToAdd.id)) {
            return;
        }

        const optimisticUpdate = {
            ...product,
            categories: [...product.categories, categoryToAdd]
        };
        setProduct(optimisticUpdate);
        setSelectedCategory('');

        try {
            await updateProduct(product.id, { categoryIdsToConnect: [categoryToAdd.id] });
            toast.success('Category added');
        } catch {
            toast.error('Failed to add category');
            setProduct(product); // Revert on error
        }
    };

    const handleRemoveCategory = async (categoryId: number) => {
        const categoryToRemove = product.categories.find(cat => cat.id === categoryId);
        if (!categoryToRemove) return;

        const optimisticUpdate = {
            ...product,
            categories: product.categories.filter(cat => cat.id !== categoryId)
        };
        setProduct(optimisticUpdate);

        try {
            await updateProduct(product.id, { categoryIdsToRemove: [categoryId] });
            toast.success('Category removed');
        } catch {
            toast.error('Failed to remove category');
            setProduct(product); // Revert on error
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        if (!event.target.files?.length) {
            toast.error('Please select images');
            return;
        }

        setIsUploading(true);

        try {
            const files = Array.from(event.target.files);
            const images: Array<{ file: File, bucketKey: string }> = [];
            const existingBucketKeys = product.images.map(image => image.bucketKey);

            for (const file of files) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    toast.error(`${file.name} is too large (max 5MB)`);
                    continue;
                }

                const bucketKey = generateUniqueBucketKey(product.name, existingBucketKeys);
                images.push({ file, bucketKey });
                existingBucketKeys.push(bucketKey);
            }

            if (images.length === 0) return;

            await addImagesToProduct(product.id, product.name, images);
            toast.success(`${images.length} image${images.length > 1 ? 's' : ''} uploaded`);
            window.location.reload();
        } catch (error) {
            toast.error('Upload failed. Please try again.');
            console.error(error);
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    const handleDeleteImage = async (imageId: number, bucketKey: string) => {
        const imageToDelete = product.images.find(img => img.bucketKey === bucketKey);
        if (!imageToDelete) return;

        const optimisticUpdate = {
            ...product,
            images: product.images.filter(img => img.bucketKey !== bucketKey)
        };
        setProduct(optimisticUpdate);

        try {
            await deleteProductImage(imageId, bucketKey);
            toast.success('Image deleted');
        } catch {
            toast.error('Failed to delete image');
            setProduct(product); // Revert on error
        }
    };

    const availableCategories = allCategories.filter(
        cat => !product.categories.find(productCat => productCat.id === cat.id)
    );

    return (
        <div className="py-2 space-y-4">
            {/* Header and Categories Combined Card */}
            <Card>
                <CardContent className="pt-6 space-y-6">
                    {/* Title Section */}
                    <div>
                        {isEditingTitle ? (
                            <div className="space-y-3">
                                <Input
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Product name"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleTitleSave} size="sm" className="flex-1">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save
                                    </Button>
                                    <Button onClick={handleTitleCancel} variant="outline" size="sm" className="flex-1">
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Mobile: Title and Edit Button in same row */}
                                <div className="flex items-start justify-between gap-3">
                                    <TypographyP className='font-bold text-xl flex-1'>{product.name}</TypographyP>
                                    <Button
                                        onClick={() => setIsEditingTitle(true)}
                                        variant="outline"
                                        size="sm"
                                        className="shrink-0"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Desktop: Horizontal layout for category controls */}
                                {availableCategories.length > 0 && (
                                    <div className="hidden md:flex gap-2 items-center justify-end">
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Add category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableCategories.map(category => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            onClick={handleAddCategory}
                                            disabled={!selectedCategory}
                                            size="sm"
                                            className="whitespace-nowrap"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add
                                        </Button>
                                    </div>
                                )}

                                {/* Mobile: Category selector and add button in same row */}
                                {availableCategories.length > 0 && (
                                    <div className="flex md:hidden gap-2">
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Add category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableCategories.map(category => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            onClick={handleAddCategory}
                                            disabled={!selectedCategory}
                                            size="sm"
                                            className="shrink-0"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Current Categories */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Categories</span>
                        </div>

                        {product.categories.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {product.categories.map(category => (
                                    <Badge key={category.id} variant="secondary" className="text-sm py-1 px-3">
                                        {category.name}
                                        <Button
                                            onClick={() => handleRemoveCategory(category.id)}
                                            variant="ghost"
                                            size="sm"
                                            className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No categories assigned</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Images Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Images ({product.images.length})
                        </CardTitle>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            size="sm"
                            disabled={isUploading}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {isUploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {product.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {product.images.map(image => (
                                <div key={image.id} className="relative group">
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={image.url}
                                            alt={`${product.name} image`}
                                            width={200}
                                            height={200}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                size="sm"
                                                variant="destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="max-w-sm mx-4">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                                <AlertDialogCancel className="w-full sm:w-auto">
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteImage(image.id, image.bucketKey)}
                                                    className="w-full sm:w-auto"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No images yet</p>
                            <p className="text-sm">Upload images to showcase your product</p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-4"
                                disabled={isUploading}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {isUploading ? 'Uploading...' : 'Upload Images'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}