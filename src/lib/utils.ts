import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function replaceSpaceAndLower(str: string): string {
  return str.replace(/\s+/g, "-").toLowerCase();
}
export const generateUniqueBucketKey = (
  productName: string,
  existingBucketKeys: string[]
): string => {
  let index = existingBucketKeys.length; // Start index from the length of existing images
  let bucketKey: string;

  do {
    bucketKey = `products/${replaceSpaceAndLower(productName)}-${index}`;
    index++;
  } while (existingBucketKeys.includes(bucketKey)); // Increment index until a unique bucketKey is found

  return bucketKey;
};
