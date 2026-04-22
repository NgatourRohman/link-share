'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 pb-8">
      {/* Previous Button */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl glass border border-[var(--card-border)] transition-all duration-300 hover:bg-indigo-500/10 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50",
          currentPage <= 1 ? "opacity-30 pointer-events-none cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <ChevronLeft size={18} />
        <span className="hidden sm:inline">Sebelumnya</span>
      </Link>

      {/* Page Indicator */}
      <div className="px-5 py-2 rounded-xl glass-pill border border-[var(--pill-border)] bg-[var(--pill-bg)]">
        <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
          Halaman {currentPage} <span className="text-[var(--muted)] font-normal text-xs mx-1">dari</span> {totalPages}
        </p>
      </div>

      {/* Next Button */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl glass border border-[var(--card-border)] transition-all duration-300 hover:bg-indigo-500/10 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50",
          currentPage >= totalPages ? "opacity-30 pointer-events-none cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <span className="hidden sm:inline">Berikutnya</span>
        <ChevronRight size={18} />
      </Link>
    </div>
  );
}
