import { supabase } from '@/lib/supabase';
import { ProfileList } from './ProfileList';

const PAGE_SIZE = 40;

/** Sanitizes query to prevent string injection in Supabase .or() */
function sanitizeSearchQuery(query: string) {
  return query.replace(/[%()',]/g, '').trim();
}

export async function ProfileContainer({ page: rawPage, q: rawQ }: { page?: string, q?: string }) {
  const sanitizedQ = rawQ ? sanitizeSearchQuery(rawQ) : '';

  // 1. Build Base Filter Logic (Used for both Count and Fetch to ensure consistency)
  const buildBaseFilter = (queryBuilder: any) => {
    let filtered = queryBuilder.eq('is_flagged', false);
    if (sanitizedQ) {
      // Postgres ILIKE with %OR% syntax for multiple columns
      // We use .or() to search across multiple fields
      filtered = filtered.or(`name.ilike.%${sanitizedQ}%,instagram_url.ilike.%${sanitizedQ}%,linkedin_url.ilike.%${sanitizedQ}%,github_url.ilike.%${sanitizedQ}%`);
    }
    return filtered;
  };

  // 2. Fetch TOTAL count with search filters
  let countQuery = supabase.from('links').select('*', { count: 'exact', head: true });
  countQuery = buildBaseFilter(countQuery);
  const { count: totalEntries, error: countError } = await countQuery;

  if (countError) {
    console.error('Error fetching count:', countError);
    return <div className="text-center py-10 text-red-400 font-medium">Gagal memuat statistik.</div>;
  }

  const totalCount = totalEntries || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // 3. Sanitize and Clamp Page
  const pageValue = parseInt(rawPage || '1', 10);
  const currentPage = isNaN(pageValue) ? 1 : Math.min(Math.max(1, pageValue), totalPages);

  // 4. Handle Empty State early
  if (totalCount === 0) {
    return <ProfileList profiles={[]} totalCount={0} currentPage={1} totalPages={1} initialSearch={sanitizedQ} />;
  }

  // 5. Fetch Paginated Data with IDENTICAL filters
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let dataQuery = supabase.from('links').select('*');
  dataQuery = buildBaseFilter(dataQuery);
  const { data: profiles, error: fetchError } = await dataQuery
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
      initialSearch={sanitizedQ}
    />
  );
}
