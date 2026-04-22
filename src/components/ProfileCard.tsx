'use client';

import { Instagram, Linkedin, Github, ExternalLink } from 'lucide-react';
import { extractUsername } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProfileCardProps {
  id: string;
  name: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  showLink?: boolean;
}

export function ProfileCard({ id, name, instagram_url, linkedin_url, github_url, showLink = true }: ProfileCardProps) {
  const displayName = name || 'Anon';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="group relative p-6 rounded-3xl glass hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-[var(--fg)] truncate max-w-[80%]">
            {displayName}
          </h3>
          {showLink && (
            <Link 
              href={`/profile/${id}`}
              className="p-2 rounded-full bg-[var(--card-border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card-border)] transition-all cursor-pointer"
              title="View shareable profile"
            >
              <ExternalLink size={16} />
            </Link>
          )}
        </div>

        <div className="space-y-3">
          {instagram_url && (
            <a 
              href={instagram_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-[var(--muted)] hover:text-pink-500 transition-colors"
            >
              <Instagram size={18} className="text-pink-500" />
              <span className="truncate">{extractUsername(instagram_url, 'instagram')}</span>
            </a>
          )}

          {linkedin_url && (
            <a 
              href={linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-[var(--muted)] hover:text-blue-500 transition-colors"
            >
              <Linkedin size={18} className="text-blue-500" />
              <span className="truncate">{extractUsername(linkedin_url, 'linkedin')}</span>
            </a>
          )}

          {github_url && (
            <a 
              href={github_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
            >
              <Github size={18} className="text-[var(--fg)] opacity-80" />
              <span className="truncate">{extractUsername(github_url, 'github')}</span>
            </a>
          )}
        </div>
      </div>

      {/* Hover background effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
    </motion.div>
  );
}
