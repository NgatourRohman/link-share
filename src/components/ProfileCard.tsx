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
}

export function ProfileCard({ id, name, instagram_url, linkedin_url, github_url }: ProfileCardProps) {
  const displayName = name || 'Anon';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group relative p-6 rounded-2xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-md hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all duration-300 shadow-lg shadow-black/20"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white truncate max-w-[80%]">
            {displayName}
          </h3>
          <Link 
            href={`/profile/${id}`}
            className="p-2 rounded-full bg-slate-800/50 text-slate-400 group-hover:text-white group-hover:bg-indigo-500/20 transition-all cursor-pointer"
            title="View shareable profile"
          >
            <ExternalLink size={16} />
          </Link>
        </div>

        <div className="space-y-3">
          {instagram_url && (
            <a 
              href={instagram_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-slate-300 hover:text-pink-400 transition-colors"
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
              className="flex items-center gap-3 text-sm text-slate-300 hover:text-blue-400 transition-colors"
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
              className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <Github size={18} className="text-slate-200" />
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
