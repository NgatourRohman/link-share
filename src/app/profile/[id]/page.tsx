import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ProfileCard } from '@/components/ProfileCard';
import { ProfileDetailActions } from '@/components/ProfileDetailActions';
import { AlertCircle } from 'lucide-react';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

// Dynamic Metadata
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  
  const { data: profile } = await supabase
    .from('links')
    .select('name')
    .eq('id', id)
    .single();

  if (!profile) return { title: 'Profile Not Found' };

  const name = profile.name || 'Anon';
  return {
    title: `${name} | Quick Share Profile`,
    description: `Lihat profil media sosial ${name} di Quick Share.`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  const { data: profile } = await supabase
    .from('links')
    .select('*')
    .eq('id', id)
    .single();

  if (!profile) {
    notFound();
  }

  return (
    <main className="min-h-screen py-10 md:py-20 relative overflow-hidden flex flex-col items-center">
      {/* Background gradients */}
      <div className="fixed top-0 left-0 w-full h-full -z-20 bg-[var(--bg)]" />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[120px] rounded-full -z-10" />


      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center max-w-2xl text-center">
        <div className="w-full mb-8">
          <ProfileDetailActions />
        </div>

        {profile.is_flagged && (
          <div className="w-full mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center gap-3 justify-center text-sm font-medium animate-pulse">
            <AlertCircle size={20} />
            <span>Profil ini sedang dalam peninjauan moderasi karena laporan spam.</span>
          </div>
        )}

        <div className="w-full transform scale-110 md:scale-125 mt-10">
          <ProfileCard {...profile} showLink={false} />
        </div>
      </div>
    </main>
  );
}
