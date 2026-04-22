import { Suspense } from 'react';
import { ShareForm } from '@/components/ShareForm';
import { ProfileContainer } from '@/components/ProfileContainer';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen py-10 md:py-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed top-0 left-0 w-full h-full -z-20 bg-slate-950" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-indigo-300 text-sm font-medium mb-2 animate-pulse">
            <Sparkles size={14} />
            <span>Faster Sharing, Zero Friction</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Quick Share Socials
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Cara tercepat untuk berbagi link Instagram, LinkedIn, dan GitHub kamu ke grup. 
            Tanpa login, tanpa ribet, sat-set langsung tampil!
          </p>
        </header>

        {/* Form Section */}
        <div className="mb-24">
          <ShareForm />
        </div>

        {/* Directory Section */}
        <div className="pt-10 border-t border-slate-800/50">
          <Suspense fallback={
            <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-slate-500 animate-pulse">Memuat direktori anggota...</p>
            </div>
          }>
            <ProfileContainer />
          </Suspense>
        </div>

        {/* End of Content */}
      </div>
    </main>
  );
}
