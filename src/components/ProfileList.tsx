'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import { useDebounce } from 'use-debounce';
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
}

export function ProfileList({ profiles, totalCount, currentPage, totalPages }: ProfileListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  const filteredProfiles = useMemo(() => {
    // 1. First filter out flagged profiles (moderation)
    const activeProfiles = profiles.filter(p => !p.is_flagged);
    
    if (!debouncedSearch) return activeProfiles;
    
    // 2. Then apply search filter
    return activeProfiles.filter((p) => {
      const search = debouncedSearch.toLowerCase();
      const name = p.name?.toLowerCase() || '';
      const instagram = p.instagram_url?.toLowerCase() || '';
      const linkedin = p.linkedin_url?.toLowerCase() || '';
      const github = p.github_url?.toLowerCase() || '';
      
      return (
        name.includes(search) || 
        instagram.includes(search) || 
        linkedin.includes(search) || 
        github.includes(search)
      );
    });
  }, [debouncedSearch, profiles]);

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
            placeholder="Search by name or social links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl py-2 pl-10 pr-4 text-[var(--fg)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-[var(--pill-bg)] rounded-3xl border border-dashed border-[var(--pill-border)]"
        >
          <div className="text-[var(--muted)] mb-2">No profiles found.</div>
          <div className="text-[var(--muted-foreground)] text-sm">Coba cari dengan kata kunci lain atau jadilah yang pertama berbagi!</div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProfiles.map((p) => (
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
