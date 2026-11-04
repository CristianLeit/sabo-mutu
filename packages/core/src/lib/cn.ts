import { clsx, type ClassValue } from 'clsx'

/**
 * Utility function to combine class names conditionally
 * Uses clsx for optimal performance and TypeScript support
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}