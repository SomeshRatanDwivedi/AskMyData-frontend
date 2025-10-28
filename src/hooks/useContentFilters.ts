import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { SortCriteria } from "@/constants";

/**
 * Custom hook to manage content filters using URL search params
 * This ensures filters persist across page reloads without browser storage
 */
export const useContentFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get pricing filters from URL
  const pricingFilters = useMemo(() => {
    const filters = searchParams.get("pricing");
    if (!filters) return [];
    return filters.split(",") as string[];
  }, [searchParams]);

  // Get keyword from URL
  const keyword = useMemo(() => {
    return searchParams.get("keyword") || "";
  }, [searchParams]);

  // Get sort criteria from URL
  const sortBy = useMemo(() => {
    return (searchParams.get("sort") as string) || SortCriteria.ITEM_NAME;
  }, [searchParams]);

  // Get price range from URL
  const priceRange = useMemo(() => {
    const min = searchParams.get("priceMin");
    const max = searchParams.get("priceMax");
    return {
      min: min ? parseInt(min) : 0,
      max: max ? parseInt(max) : 999,
    };
  }, [searchParams]);

  /**
   * Toggle a pricing filter
   */
  const togglePricingFilter = useCallback(
    (option: string) => {
      const current = pricingFilters;
      const newFilters = current.includes(option)
        ? current.filter((f) => f !== option)
        : [...current, option];

      const params = new URLSearchParams(searchParams);
      if (newFilters.length > 0) {
        params.set("pricing", newFilters.join(","));
      } else {
        params.delete("pricing");
      }
      setSearchParams(params);
    },
    [pricingFilters, searchParams, setSearchParams]
  );

  /**
   * Set keyword search
   */
  const setKeyword = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("keyword", value);
      } else {
        params.delete("keyword");
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  /**
   * Set sort criteria
   */
  const setSortCriteria = useCallback(
    (criteria: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("sort", criteria);
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  /**
   * Set price range
   */
  const setPriceRange = useCallback(
    (min: number, max: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("priceMin", min.toString());
      params.set("priceMax", max.toString());
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    pricingFilters,
    keyword,
    sortBy,
    priceRange,
    togglePricingFilter,
    setKeyword,
    setSortCriteria,
    setPriceRange,
    resetFilters,
  };
};
