import { PricingOption, SortCriteria } from "@/constants";
import type { ContentItem } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PricingEnumMapping } from './../constants/index';
import { getAllProducts } from "@/api/products";

const ITEMS_PER_PAGE = 12;

/**
 * Fetch content data from API
 */
const fetchContentData = async (): Promise<ContentItem[]> => {
  try {
    const res = await getAllProducts();
    return res.data;
  } catch (err) {
    console.error("Error in getting content data", err);
    throw err;
  }
};

/**
 * Filter content items based on criteria
 */
const filterContent = (
  items: ContentItem[],
  pricingFilters: string[],
  keyword: string,
  priceRange: { min: number; max: number }
): ContentItem[] => {
  return items.filter((item) => {
    // Apply pricing filter
    const priceFilterEnum = pricingFilters.map(ele => PricingEnumMapping[ele]);
    if (pricingFilters.length > 0 && !priceFilterEnum.includes(+item.pricingOption)) {
      return false;
    }

    // Apply keyword search for title
    if (keyword) {
      const searchTerm = keyword.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(searchTerm);
      const matchCreator = item.creator.toLowerCase().includes(searchTerm);
      if (!matchesTitle && !matchCreator) {
        return false;
      }
    }

    // Apply price range filter (only for paid items)
    if (+item.pricingOption === PricingEnumMapping[PricingOption.PAID] && item.price !== undefined) {
      if (item.price < priceRange.min || item.price > priceRange.max) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort content items based on criteria
 */
const sortContent = (items: ContentItem[], sortBy: string): ContentItem[] => {
  const sorted = [...items];

  switch (sortBy) {
    case SortCriteria.ITEM_NAME:
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    case SortCriteria.HIGHER_PRICE:
      return sorted.sort((a, b) => {
        const priceA = a.price ?? -1;
        const priceB = b.price ?? -1;
        return priceB - priceA;
      });

    case SortCriteria.LOWER_PRICE:
      return sorted.sort((a, b) => {
        const priceA = a.price ?? Infinity;
        const priceB = b.price ?? Infinity;
        return priceA - priceB;
      });

    default:
      return sorted;
  }
};

interface UseContentDataParams {
  pricingFilters: string[];
  keyword: string;
  sortBy: string;
  priceRange: { min: number; max: number };
}

/**
 * Custom hook to fetch and filter content data with infinite scroll
 */
export const useContentData = ({
  pricingFilters,
  keyword,
  sortBy,
  priceRange,
}: UseContentDataParams) => {
  return useInfiniteQuery({
    queryKey: ["content", pricingFilters, keyword, sortBy, priceRange],
    queryFn: async ({ pageParam = 0 }) => {
      // Fetch all data from API
      const allData = await fetchContentData();

      // Apply filters and sorting
      const filtered = filterContent(allData, pricingFilters, keyword, priceRange);
      const sorted = sortContent(filtered, sortBy);

      // Paginate results
      const start = pageParam * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const paginatedData = sorted.slice(start, end);

      return {
        items: paginatedData,
        nextPage: end < sorted.length ? pageParam + 1 : undefined,
        totalItems: sorted.length,
      };
    },
    // Allow nextPage to be optional in the last page so types match the possible `undefined` value
    getNextPageParam: (lastPage: { nextPage?: number }) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
