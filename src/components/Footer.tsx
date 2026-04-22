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
            className="group flex items-center gap-2 px-4 py-2 rounded-full glass-pill border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all duration-300 transform hover:scale-105"
            aria-label="View creator's profile"
          >
            <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
              Created by <span className="text-indigo-400 font-semibold">Arthur</span>
            </span>
            <ExternalLink 
              size={14} 
              className="text-slate-500 group-hover:text-indigo-400 transition-colors" 
            />
          </Link>
        ) : (
          <div className="px-4 py-2 rounded-full glass-pill border border-slate-800/50 text-slate-500 text-sm font-medium">
            Created by <span className="text-indigo-400">Arthur</span>
          </div>
        )}
        
        <p className="text-slate-600 text-xs tracking-wider uppercase font-medium">
          &copy; {currentYear} Quick Share • Internal Group Hub
        </p>
      </div>
    </footer>
  );
}
