"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, X, ArrowUp, ArrowDown, Search, Filter } from "lucide-react";
import { Category } from "@prisma/client";
import { debounce } from "lodash";
import { Badge } from "./ui/badge";

interface SearchFilterBarProps {
    searchInput: string;
    onSearchInputChange: (value: string) => void;
    categories: Category[];
    selectedCategories: string[];
    onCategoryToggle: (categoryName: string) => void;
    sortOrder: "asc" | "desc";
    onSortChange: (value: "asc" | "desc") => void;
    searchQuery: string;
    onClearCategory: (categoryName: string) => void;
    onClearSearch: () => void;
    onClearAllFilters: () => void;
}

export function SearchFilterBar({
    searchInput,
    onSearchInputChange,
    categories,
    selectedCategories,
    onCategoryToggle,
    sortOrder,
    onSortChange,
    searchQuery,
    onClearCategory,
    onClearSearch,
    onClearAllFilters,
}: SearchFilterBarProps) {
    const hasActiveFilters = selectedCategories.length > 0 || searchQuery.length > 0;
    const [inputValue, setInputValue] = useState(searchInput);

    /* eslint-disable react-hooks/exhaustive-deps */
    const debouncedSearch = useCallback(
        debounce((value: string) => onSearchInputChange(value), 300),
        [onSearchInputChange]
    );

    useEffect(() => setInputValue(searchInput), [searchInput]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedSearch(value);
    };

    return (
        <div className='my-2'>
            {/* Search and Filter Controls - Horizontal Layout */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                        id="search"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Search products..."
                        className="pl-12 pr-4"
                    />
                </div>

                {/* Category Filter */}
                <div className="w-full md:w-64">
                    <Select onValueChange={onCategoryToggle}>
                        <SelectTrigger>
                            <div className="flex items-center">
                                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="All Categories" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name} role='option'>
                                    <div className="flex items-center justify-between">
                                        <span>{category.name}</span>
                                        {selectedCategories.includes(category.name) && (
                                            <Check className="h-4 w-4 text-green-600 ml-2" />
                                        )}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort Filter */}
                <div className="w-full md:w-56">
                    <Select value={sortOrder} onValueChange={onSortChange}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">
                                <div className="flex items-center gap-2">
                                    <ArrowUp className="h-4 w-4 text-emerald-500" />
                                    Low to High
                                </div>
                            </SelectItem>
                            <SelectItem value="desc">
                                <div className="flex items-center gap-2">
                                    <ArrowDown className="h-4 w-4 text-rose-500" />
                                    High to Low
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap gap-2 items-center">
                        {selectedCategories.map((category) => (

                            <Badge
                                key={category}
                                className="p-1 cursor-pointer"
                                onClick={() => onClearCategory(category)}
                            >
                                {category}
                                <span className="pl-2"><X className="h-4 w-4" /></span>
                            </Badge>
                        ))}
                        {searchQuery && (
                            <Badge
                                key={searchQuery}
                                className="p-1 cursor-pointer"
                                onClick={onClearSearch}
                                variant='outline'
                            >
                                `&lsquo;`{searchQuery}`&lsquo;`
                                <span className="pl-2"><X className="h-4 w-4" /></span>
                            </Badge>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearAllFilters}
                        disabled={selectedCategories.includes('All')}
                    >
                        <X className="h-4 w-4" />
                        Clear All
                    </Button>
                </div>
            )}

            <Separator className="my-1.5 mb-3" />
        </div>
    );
}