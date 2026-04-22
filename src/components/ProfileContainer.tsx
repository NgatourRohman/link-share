import { supabase } from '@/lib/supabase';
import { ProfileList } from './ProfileList';

const PAGE_SIZE = 40;

export async function ProfileContainer({ page: rawPage }: { page?: string }) {
  // 1. Calculate Total Count first for accurate clamping
  const { count: totalEntries, error: countError } = await supabase
    .from('links')
    .select('*', { count: 'exact', head: true })
    .eq('is_flagged', false);

  if (countError) {
    console.error('Error fetching count:', countError);
    return <div className="text-center py-10 text-red-400 font-medium">Gagal memuat statistik.</div>;
  }

  const totalCount = totalEntries || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // 2. Sanitize and Clamp Page
  const pageValue = parseInt(rawPage || '1', 10);
  const currentPage = isNaN(pageValue) ? 1 : Math.min(Math.max(1, pageValue), totalPages);

  // 3. Handle Empty State early (don't run range if no data)
  if (totalCount === 0) {
    return <ProfileList profiles={[]} totalCount={0} currentPage={1} totalPages={1} />;
  }

  // 4. Fetch Paginated Data with Stable Ordering
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: profiles, error: fetchError } = await supabase
    .from('links')
    .select('*')
    .eq('is_flagged', false)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (fetchError) {
    console.error('Error fetching profiles:', fetchError);
    return (
      <div className="text-center py-10 text-red-400 font-medium bg-red-500/5 rounded-3xl border border-red-500/10">
        Terjadi kesalahan saat mengambil directory. Silakan coba lagi.
      </div>
    );
  }

  return (
    <ProfileList 
      profiles={profiles || []} 
      totalCount={totalCount} 
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
