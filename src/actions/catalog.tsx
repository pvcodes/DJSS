'use server'
import db from '@/db'
import { putObjectInS3 } from '@/lib/s3';
import { replaceSpaceAndLower } from '@/lib/utils';

// Product CRUD
// TODO: Later when need to show price
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
export async function getProduct(id: number) {
    return db.product.findUnique({
        where: { id },
        include: { categories: true },
    });
}

export async function updateProduct(id: number, data: { name?: string; price?: number; categoryIds?: number[] }) {
    return db.product.update({
        where: { id },
        data: {
            name: data.name,
            price: data.price,
            categories: data.categoryIds ? { set: data.categoryIds.map(id => ({ id })) } : undefined,
        },
    });
}

export async function deleteProduct(id: number) {
    return db.product.delete({ where: { id } });
}

export async function getAllProducts(options: { include?: { images?: boolean; categories?: boolean } } = {}) {
    return db.product.findMany({
        include: {
            images: options.include?.images ?? false,
            categories: options.include?.categories ?? false,
        },
    });
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