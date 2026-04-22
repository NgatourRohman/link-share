'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ProfileDetailActions() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleBack = () => {
    // Check if there is a history to go back to, otherwise go to home
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link profil berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between w-full max-w-md mb-8">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors group"
      >
        <div className="p-2 rounded-full glass-pill group-hover:bg-[var(--pill-bg)]">
          <ArrowLeft size={18} />
        </div>
        <span className="text-sm font-medium">Kembali</span>
      </button>

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors group"
      >
        <span className="text-sm font-medium">{copied ? 'Tersalin' : 'Salin Link'}</span>
        <div className="p-2 rounded-full glass-pill group-hover:bg-[var(--accent)]/10 group-hover:text-[var(--accent)] transition-all">
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </div>
      </button>
    </div>
  );
}
