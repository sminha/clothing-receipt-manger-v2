import { useMemo } from 'react';
import { PurchaseRecord } from '../redux/slices/purchaseSlice.ts';

type FilterOptions = {
  selectedType: 'all' | 'purchase' | 'register';
  selectedRange: '오늘' | '일주일' | '1개월' | '3개월';
  customDateRange?: { start: Date | null; end: Date | null };
  keyword: string;
  target: 'vendor' | 'product';
  onlyUnshipped: boolean;
};

const getStartDateByRange = (range: FilterOptions['selectedRange']): Date => {
  const now = new Date();
  const date = new Date(now);
  switch (range) {
    case '오늘': return new Date(date.setHours(0, 0, 0, 0));
    case '일주일': return new Date(date.setDate(now.getDate() - 6));
    case '1개월': return new Date(date.setMonth(now.getMonth() - 1));
    case '3개월': return new Date(date.setMonth(now.getMonth() - 3));
    default: return new Date(0);
  }
};

export const useFilteredPurchaseList = (
  list: PurchaseRecord[],
  options: FilterOptions
) => {
  const {
    selectedType,
    selectedRange,
    customDateRange,
    keyword,
    target,
    onlyUnshipped,
  } = options;

  const filteredList = useMemo(() => {
    const startDate = customDateRange?.start ?? getStartDateByRange(selectedRange);
    const endDate = customDateRange?.end ? new Date(new Date(customDateRange.end).setHours(23, 59, 59, 999)) : new Date();

    return list
      .map(purchase => {
        const targetDate = selectedType === 'purchase'
          ? new Date(purchase.date)
          : new Date(purchase.createdAt);

        const inDateRange = selectedType === 'all'
          ? true
          : targetDate >= startDate && targetDate <= endDate;
        if (!inDateRange) return null;

        const filteredItems = purchase.items.filter(item => {
          const matchesKeyword = keyword.trim() === '' || (
            target === 'vendor'
              ? purchase.vendor.toLowerCase().includes(keyword.trim().toLowerCase())
              : item.name.toLowerCase().includes(keyword.trim().toLowerCase())
          );

          const hasUnshipped = onlyUnshipped
            ? Number(item.missingQuantity) > 0
            : true;

          return matchesKeyword && hasUnshipped;
        });

        if (filteredItems.length === 0) return null;

        return { ...purchase, items: filteredItems };
      })
      .filter((purchase): purchase is PurchaseRecord => purchase !== null);
  }, [list, selectedType, selectedRange, customDateRange, keyword, target, onlyUnshipped]);

  return filteredList;
};