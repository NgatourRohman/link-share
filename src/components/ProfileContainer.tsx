import { supabase } from '@/lib/supabase';
import { ProfileList } from './ProfileList';

export async function ProfileContainer() {
  // Fetch latest 100 profiles for display
  const { data: profiles, error: fetchError } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  // Fetch TOTAL count of non-flagged profiles for the badge
  const { count: totalCount, error: countError } = await supabase
    .from('links')
    .select('*', { count: 'exact', head: true })
    .eq('is_flagged', false);

  const error = fetchError || countError;

  if (error) {
    console.error('Error fetching profiles:', error);
    return (
      <div className="text-center py-10 text-red-400">
        Gagal memuat data. Silakan hubungi admin atau coba lagi nanti.
      </div>
    );
  }

  return <ProfileList profiles={profiles || []} totalCount={totalCount || 0} />;
}
