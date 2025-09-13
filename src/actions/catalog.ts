'use server'
import db from '@/db'
import { deleteObjectsInS3, putObjectInS3 } from '@/lib/s3';
import { replaceSpaceAndLower } from '@/lib/utils';
import { Prisma } from '@prisma/client';

// Product CRUD
// TODO: Later when need to show price
export async function getProduct(id: number) {
    return db.product.findUnique({
        where: { id },
        include: { categories: true, images: true },
    });
}

export async function createProduct(data: { name: string; price?: number; categoryIds: number[]; images: File[] }) {
    return db.$transaction(async (tx) => {
        // Create product in database
        const product = await tx.product.create({
            data: {
                name: data.name,
                price: data.price ?? -1,
                categories: { connect: data.categoryIds.map(id => ({ id })) },
            },
        });

        // Save images to S3 and create ProductImage records
        try {
            for (const [index, image] of data.images.entries()) {
                const bucketKey = `products/${replaceSpaceAndLower(data.name)}-${index}`;
                await putObjectInS3(bucketKey, image);
                await tx.productImage.create({
                    data: {
                        bucketKey,
                        productId: product.id,
                    },
                });
            }
            return product;
        } catch (error) {
            console.log('S3', error)
            throw new Error("Failed to save files in S3");
        }
    }, { timeout: 10000 });
}

export async function addImagesToProduct(productId: number, productName: string, images: { file: File, bucketKey: string }[]) {
    return db.$transaction(async (tx) => {
        try {

            // Delete product from database
            for (const [, image] of images.entries()) {
                // const bucketKey = `products/${replaceSpaceAndLower(productName)}-${index}`;
                await putObjectInS3(image.bucketKey, image.file);
                await tx.productImage.create({
                    data: {
                        bucketKey: image.bucketKey,
                        productId,
                    },
                });
            }
            // Delete images from S3 if bucket keys are provided
        } catch (error) {
            console.error('S3 deletion error:', error);
            throw new Error('Failed to delete files in S3');
        }
    }, { timeout: 10000 });
}

export async function updateProduct(
    id: number,
    data: { name?: string; price?: number; categoryIdsToConnect?: number[]; categoryIdsToRemove?: number[] }
) {
    return db.product.update({
        where: { id },
        data: {
            name: data.name,
            price: data.price,
            categories: {
                ...(data.categoryIdsToConnect && {
                    connect: data.categoryIdsToConnect.map(id => ({ id })),
                }),
                ...(data.categoryIdsToRemove && {
                    disconnect: data.categoryIdsToRemove.map(id => ({ id })),
                }),
            },
        },
    });
}

export async function deleteProduct(id: number, imagesBucketKeys?: string[]) {
    return db.$transaction(async (tx) => {
        // Delete product from database
        const product = await tx.product.delete({
            where: { id }
        });

        // Delete images from S3 if bucket keys are provided
        try {
            if (imagesBucketKeys && imagesBucketKeys.length > 0) {
                await deleteObjectsInS3(imagesBucketKeys);
            }
            return product;
        } catch (error) {
            console.error('S3 deletion error:', error);
            throw new Error('Failed to delete files in S3');
        }
    }, { timeout: 10000 });
}

export async function deleteProductImage(imageId: number, imageBucketKey: string) {
    return db.$transaction(async (tx) => {
        // Delete product from database
        const productImage = await tx.productImage.delete({
            where: { id: imageId }
        });

        // Delete images from S3 if bucket keys are provided
        try {
            await deleteObjectsInS3([imageBucketKey]);
            return productImage;
        } catch (error) {
            console.error('S3 deletion error:', error);
            throw new Error('Failed to delete files in S3');
        }
    }, { timeout: 10000 });


}



export async function getAllProducts(options: {
    include?: { images?: boolean; categories?: boolean };
    page?: number; // which page (default: 1)
    limit?: number; // items per page (default: 10)
    categories?: string[];
    search?: string;
    sortOrder?: "asc" | "desc";
} = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {};

    // Category filter - if categories contains 'all', don't apply category filter
    if (options.categories && options.categories.length > 0) {
        const hasAll = options.categories.includes('all');

        if (!hasAll) {
            where.categories = {
                some: {
                    name: { in: options.categories },
                },
            };
        }
        // If 'all' is present, we don't add any category filter (search all products)
    }

    // Search filter
    if (options.search && options.search.trim() !== "") {
        where.name = {
            contains: options.search.trim(),
            mode: "insensitive",
        };
    }

    // Sorting (defaults to createdAt desc if none provided)
    const orderBy: Prisma.ProductOrderByWithRelationInput = options.sortOrder
        ? { price: options.sortOrder }
        : { createdAt: "desc" };

    const [products, total] = await Promise.all([
        db.product.findMany({
            skip,
            take: limit,
            where,
            include: {
                images: options.include?.images ?? false,
                categories: options.include?.categories ?? false,
            },
            orderBy,
        }),
        db.product.count({ where }),
    ]);

    return {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
    };
}



// Category CRUD
export async function createCategory(data: { name: string }) {
    return db.category.create({ data: { name: data.name.toLowerCase() } });
}

export async function getCategory(id: number) {
    return db.category.findUnique({
        where: { id },
        include: { products: true },
    });
}

export async function updateCategory(id: number, data: { name?: string }) {
    return db.category.update({ where: { id }, data });
}

export async function deleteCategory(id: number) {
    return db.category.delete({ where: { id } });
}

export async function getAllCategories() {
    return db.category.findMany();
    // return db.category.findMany({ include: { products: true } });
}