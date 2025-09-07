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
import { createCategory } from "@/actions/catalog";
import { useState } from "react";
import { toast } from "sonner"
import { Category } from "@prisma/client";

export default function AddCategory({ categories }: { categories: Category[] }) {
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (categories.some((category) => category.name.toLowerCase() === name.trim().toLowerCase())) {
            toast.error("Category name already exists");
            return;
        }
        if (name.trim().length < 2) {
            toast.error("Category name must be at least 2 characters");
            return;
        }
        try {
            await createCategory({ name: name.trim() });
            toast.success("Category added successfully");
            setName("");
        } catch (error) {
            console.log('Category', error)
            toast.error("Error adding category");
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>Enter category details</CardDescription>
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
                                placeholder="Category name"
                                required
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" onClick={handleSubmit}>
                    Add Category
                </Button>
            </CardFooter>
        </Card>
    );
}