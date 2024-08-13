import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

//Function by ShadCn that allow to merge couple of class names together
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
