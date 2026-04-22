import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  const creatorId = process.env.NEXT_PUBLIC_CREATOR_PROFILE_ID;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-10 px-4 mt-auto">
      <div className="flex flex-col items-center gap-4">
        {creatorId ? (
          <Link
            href={`/profile/${creatorId}`}
            className="group flex items-center gap-2 px-4 py-2 rounded-full glass-pill border border-[var(--pill-border)] hover:border-[var(--accent)]/30 hover:bg-[var(--pill-bg)] transition-all duration-300 transform hover:scale-105"
            aria-label="View creator's profile"
          >
            <span className="text-sm font-medium text-[var(--muted)] group-hover:text-[var(--fg)] transition-colors">
              Created by <span className="text-[var(--accent)] font-semibold">Arthur</span>
            </span>
            <ExternalLink 
              size={14} 
              className="text-[var(--muted-foreground)] group-hover:text-[var(--accent)] transition-colors" 
            />
          </Link>
        ) : (
          <div className="px-4 py-2 rounded-full glass-pill border border-[var(--pill-border)] text-[var(--muted)] text-sm font-medium">
            Created by <span className="text-[var(--accent)]">Arthur</span>
          </div>
        )}
        
        <p className="text-[var(--muted-foreground)] text-xs tracking-wider uppercase font-medium">
          &copy; {currentYear} Quick Share • Internal Group Hub
        </p>
      </div>
    </footer>
  );
}
