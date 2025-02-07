// src/lib/utils.ts
import {ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

/**
 * Merges Tailwind CSS classes and resolves conflicts between them
 * @param inputs - Array of class values to be merged
 * @returns Merged and cleaned class string
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}

/**
 * Delays execution for a specified amount of time
 * @param ms - Number of milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Formats a number as currency
 * @param amount - Number to format as currency
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
    amount: number,
    currency: string = "USD",
    locale: string = "en-US"
): string => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount)
}

/**
 * Checks if the current environment is development
 * @returns Boolean indicating if in development environment
 */
export const isDevelopment = (): boolean => {
    return process.env.NODE_ENV === "development"
}

/**
 * Truncates a string to a specified length
 * @param str - String to truncate
 * @param length - Maximum length (default: 50)
 * @param end - String to append at truncation point (default: '...')
 * @returns Truncated string
 */
export const truncateString = (
    str: string,
    length: number = 50,
    end: string = "..."
): string => {
    if (str.length <= length) return str
    return str.slice(0, length).trim() + end
}

/**
 * Generates a URL-friendly slug from a string
 * @param str - String to convert to slug
 * @returns URL-friendly slug string
 */
export const generateSlug = (str: string): string => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

/**
 * Debounces a function call
 * @param fn - Function to debounce
 * @param ms - Number of milliseconds to delay
 * @returns Debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
    fn: T,
    ms: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;

    return function (this: unknown, ...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

/**
 * Type guard to check if a value is not null or undefined
 * @param value - Value to check
 * @returns Boolean indicating if value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined
}

/**
 * Creates a range of numbers
 * @param start - Start of range
 * @param end - End of range
 * @returns Array of numbers in range
 */
export const range = (start: number, end: number): number[] => {
    return Array.from({length: end - start + 1}, (_, i) => start + i)
}