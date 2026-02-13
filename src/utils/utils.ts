import { twMerge } from './../../node_modules/tailwind-merge/src/lib/tw-merge';
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
