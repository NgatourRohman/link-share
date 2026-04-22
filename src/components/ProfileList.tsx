'use client';

import { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProfileCard } from './ProfileCard';
import { Pagination } from './Pagination';
import { motion, AnimatePresence } from 'framer-motion';

interface Profile {
  id: string;
  name: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  created_at: string;
  is_flagged?: boolean;
}

interface ProfileListProps {
  profiles: Profile[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  initialSearch?: string;
}

export function ProfileList({ 
  profiles, 
  totalCount, 
  currentPage, 
  totalPages,
  initialSearch = '' 
}: ProfileListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Sync search query to URL with 500ms debounce
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentQ = searchParams.get('q') || '';
    
    // Only update if search changed
    if (debouncedSearch !== currentQ) {
      if (debouncedSearch) {
        params.set('q', debouncedSearch);
      } else {
        params.delete('q');
      }
      
      // Always reset to page 1 when search term changes
      params.set('page', '1');
      
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-[var(--fg)] flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="text-indigo-400" size={24} />
            Members Directory
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[var(--pill-bg)] border border-[var(--pill-border)] text-indigo-400 text-sm font-medium">
            {totalCount}
          </span>
        </h2>
        
        <div className="relative w-full md:w-80">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] z-10 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search name or social links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl py-2 pl-10 pr-4 text-[var(--fg)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      {profiles.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 rounded-3xl border-2 border-dashed border-[var(--card-border)] bg-[var(--card-bg)]/30 backdrop-blur-sm"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-indigo-500/10 text-indigo-400 mb-6">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-[var(--fg)] mb-2">Tidak ada profil ditemukan</h3>
          <p className="text-[var(--muted-foreground)] max-w-sm mx-auto">
            Kami tidak menemukan hasil untuk "{searchTerm}". Coba gunakan kata kunci lain atau bersihkan pencarian Anda.
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              Bersihkan Pencarian
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {profiles.map((p) => (
              <ProfileCard key={p.id} {...p} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Navigation Footer */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
