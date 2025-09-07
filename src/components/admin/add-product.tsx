'use client';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createProduct } from "@/actions/catalog";
import { useState } from "react";
import { toast } from "sonner";
import { Category } from "@prisma/client";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Check, X } from "lucide-react";

export default function AddProduct({ categories }: { categories: Category[] }) {
    const [name, setName] = useState("");
    // const [price, setPrice] = useState("");
    // const [description, setDescription] = useState("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [images, setImages] = useState<File[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const validFiles = files.filter((file) => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 5MB`)
                return false;
            }
            if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
                toast.error(`${file.name} must be JPEG, PNG, or WebP`)
                return false;
            }
            return true;
        });
        setImages(validFiles);
    };

    const handleCategoryToggle = (categoryId: number) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Product name is required")
            return;
        }
        // if (!price || parseFloat(price) <= 0) {
        //     toast.error('Price must be a positive number')
        //     return;
        // }
        try {
            await createProduct({
                name: name.trim(),
                categoryIds: selectedCategoryIds,
                images,
            });
            toast.success('Product added successfully')
            setName("");
            // setPrice("");
            // setDescription("");
            setSelectedCategoryIds([]);
            setImages([]);
        } catch (error) {
            console.log('Product', error)
            toast.error("Error adding product")
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Enter product details and upload images</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Product name"
                                required
                            />
                        </div>
                        {/* <div className="grid gap-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div> */}
                        {/* <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Product description"
                            />
                        </div> */}
                        <div className="grid gap-2">
                            <Label>Categories</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select categories">
                                        {selectedCategoryIds.length > 0
                                            ? selectedCategoryIds
                                                .map((id) => categories.find((c) => c.id === id)?.name)
                                                .filter(Boolean)
                                                .join(", ")
                                            : "Select categories"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {categories.map((category) => (
                                                    <CommandItem
                                                        key={category.id}
                                                        onSelect={() => handleCategoryToggle(category.id)}
                                                        className="flex justify-between items-center"
                                                    >
                                                        {category.name}
                                                        {selectedCategoryIds.includes(category.id) && (
                                                            <Check className="h-4 w-4" />
                                                        )}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </SelectContent>
                            </Select>
                            {selectedCategoryIds.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedCategoryIds.map((id) => {
                                        const category = categories.find((c) => c.id === id);
                                        return (
                                            category && (
                                                <div
                                                    key={id}
                                                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                                                >
                                                    {category.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCategoryToggle(id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="images">Images</Label>
                            <Input
                                id="images"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                multiple
                                onChange={handleImageChange}
                                className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:hover:bg-primary/90"
                            />
                            {images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {images.map((image, index) => (
                                        <p key={index} className="text-sm text-muted-foreground">
                                            {image.name}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" onClick={handleSubmit}>
                    Add Product
                </Button>
            </CardFooter>
        </Card>
    );
}