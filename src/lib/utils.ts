import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and tailwind-merge
 * 
 * This utility function merges class names and resolves Tailwind CSS conflicts
 * by using tailwind-merge to handle conflicting classes.
 * 
 * @param inputs - Class values to be merged
 * @returns A string of merged class names
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
