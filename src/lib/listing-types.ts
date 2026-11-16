import type { ListingType } from "@/lib/types";

export function normalizeListingType(value: string | undefined): ListingType {
  if (value === "multiple" || value === "vehicle" || value === "home") return value;
  return "item";
}

export function defaultCategoryFor(type: ListingType): string {
  if (type === "vehicle") return "Vehicles";
  if (type === "home") return "Home Sales";
  return "";
}

export function titlePlaceholderFor(type: ListingType): string {
  if (type === "vehicle") return "What vehicle are you selling?";
  if (type === "home") return "Describe the property";
  return "What are you selling?";
}
