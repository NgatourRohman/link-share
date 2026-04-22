'use client';

import { Instagram, Linkedin, Github, ExternalLink, AlertTriangle } from 'lucide-react';
import { extractUsername, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { reportProfile } from '@/app/actions';
import { toast } from 'sonner';
import { useState } from 'react';

interface ProfileCardProps {
  id: string;
  name: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  showLink?: boolean;
}

export function ProfileCard({ id, name, instagram_url, linkedin_url, github_url, showLink = true }: ProfileCardProps) {
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const displayName = name || 'Anon';

  const handleReport = async () => {
    setIsReporting(true);
    try {
      const result = await reportProfile(id);
      if (result.success) {
        toast.success(result.message);
        setShowReportConfirm(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Gagal melaporkan profil.');
    } finally {
      setIsReporting(false);
    }
  };

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
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="text-lg font-semibold text-[var(--fg)] line-clamp-2 break-words leading-snug overflow-hidden" title={displayName}>
              {displayName}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {/* Report Button */}
            <div className="relative">
              <button 
                onClick={() => setShowReportConfirm(!showReportConfirm)}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  showReportConfirm ? "bg-red-500/10 text-red-500" : "bg-[var(--card-border)] text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-500/5"
                )}
                title="Laporkan profil ini"
              >
                <AlertTriangle size={15} />
              </button>

              <AnimatePresence>
                {showReportConfirm && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    className="absolute bottom-full right-0 mb-2 p-3 rounded-2xl glass border border-red-500/20 shadow-xl z-30 min-w-[180px]"
                  >
                    <p className="text-[10px] text-[var(--muted)] mb-2 font-medium leading-tight">
                      Laporkan profil ini jika berisi spam atau link tidak valid?
                    </p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleReport}
                        disabled={isReporting}
                        className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold transition-colors disabled:opacity-50"
                      >
                        {isReporting ? '...' : 'Ya, Lapor'}
                      </button>
                      <button 
                        onClick={() => setShowReportConfirm(false)}
                        className="flex-1 py-1.5 rounded-lg bg-[var(--card-border)] text-[var(--fg)] text-[10px] font-medium transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
