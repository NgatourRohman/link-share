'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { ProfileCard } from './ProfileCard';
import { motion, AnimatePresence } from 'framer-motion';

interface Profile {
  id: string;
  name: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  created_at: string;
}

interface ProfileListProps {
  profiles: Profile[];
}

export function ProfileList({ profiles }: ProfileListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  const filteredProfiles = useMemo(() => {
    if (!debouncedSearch) return profiles;
    
    return profiles.filter((p) => {
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
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="text-indigo-400" size={24} />
            Members Directory
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
            {profiles.length}
          </span>
        </h2>
        
        <div className="relative w-full md:w-80">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name or social links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800"
        >
          <div className="text-slate-500 mb-2">No profiles found.</div>
          <div className="text-slate-600 text-sm">Coba cari dengan kata kunci lain atau jadilah yang pertama berbagi!</div>
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
    </div>
  );
}
