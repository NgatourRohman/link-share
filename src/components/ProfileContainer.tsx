import { supabase } from '@/lib/supabase';
import { ProfileList } from './ProfileList';

export async function ProfileContainer() {
  // Fetch latest 100 profiles, ordered by creation date (DESC)
  const { data: profiles, error } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching profiles:', error);
    return (
      <div className="text-center py-10 text-red-400">
        Gagal memuat data. Silakan hubungi admin atau coba lagi nanti.
      </div>
    );
  }

  return <ProfileList profiles={profiles || []} />;
}
