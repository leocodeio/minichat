import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a unique 8-10 character alphanumeric code for users.
 * @returns A random alphanumeric string of length 8-10.
 */
export function generateUniqueCode(): string {
  const length = Math.floor(Math.random() * 3) + 8; // 8-10 characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
