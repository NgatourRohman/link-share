'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { validateSocialLink, normalizeSocialLink, validateName, getFingerprint } from '@/lib/utils';
import { headers, cookies } from 'next/headers';

export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function shareProfile(formData: FormData): Promise<ActionResponse> {
  try {
    // 1. Stealth Honeypot Check
    const honeypot = formData.get('confirm_email') as string;
    if (honeypot) {
      console.warn('[SECURITY_ABUSE] Honeypot triggered.');
      return { success: false, message: 'Bot detected.' };
    }

    // 2. Identify User (Heuristic)
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || '127.0.0.1';
    const ua = headerList.get('user-agent') || 'unknown';
    const fingerprint = await getFingerprint(ip, ua);

    // 3. Sliding Window Rate Limit (3 requests per 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    // Cleanup old rate limit records (TTL)
    await supabase.from('rate_limits').delete().lt('created_at', fiveMinutesAgo);

    const { count } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('identifier_hash', fingerprint)
      .gt('created_at', fiveMinutesAgo);

    if (count !== null && count >= 3) {
      console.warn(`[SECURITY_ABUSE] Rate limit exceeded for ${fingerprint}`);
      return { success: false, message: 'Terlalu banyak pengiriman. Silakan tunggu 5 menit.' };
    }

    // 4. Security Cookie Check (Submission Window)
    const cookieStore = await cookies();
    const lastSubmission = cookieStore.get('last_sub')?.value;
    if (lastSubmission && Date.now() - parseInt(lastSubmission) < 30000) {
      return { success: false, message: 'Harap tunggu 30 detik antar pengiriman.' };
    }

    // 5. Data Collection & Validation
    const nameRaw = (formData.get('name') as string)?.trim();
    const instagramRaw = (formData.get('instagram') as string)?.trim();
    const linkedinRaw = (formData.get('linkedin') as string)?.trim();
    const githubRaw = (formData.get('github') as string)?.trim();

    // Name Validation
    const nameVal = validateName(nameRaw);
    if (!nameVal.isValid) return { success: false, message: nameVal.error || 'Nama tidak valid.' };
    const name = nameVal.sanitizedValue || 'Anon';

    if (!instagramRaw && !linkedinRaw && !githubRaw) {
      return { success: false, message: 'Minimal salah satu link media sosial harus diisi.' };
    }

    // Social Validation
    if (instagramRaw) {
      const v = validateSocialLink(instagramRaw, 'instagram');
      if (!v.isValid) return { success: false, message: `Instagram: ${v.error}` };
    }
    if (linkedinRaw) {
      const v = validateSocialLink(linkedinRaw, 'linkedin');
      if (!v.isValid) return { success: false, message: `LinkedIn: ${v.error}` };
    }
    if (githubRaw) {
      const v = validateSocialLink(githubRaw, 'github');
      if (!v.isValid) return { success: false, message: `GitHub: ${v.error}` };
    }

    // 6. Normalization
    const instagram_url = instagramRaw ? normalizeSocialLink(instagramRaw, 'instagram') : null;
    const linkedin_url = linkedinRaw ? normalizeSocialLink(linkedinRaw, 'linkedin') : null;
    const github_url = githubRaw ? normalizeSocialLink(githubRaw, 'github') : null;

    // Duplicate check
    const duplicateChecks = [];
    if (instagram_url) duplicateChecks.push(`instagram_url.eq.${instagram_url}`);
    if (linkedin_url) duplicateChecks.push(`linkedin_url.eq.${linkedin_url}`);
    if (github_url) duplicateChecks.push(`github_url.eq.${github_url}`);

    if (duplicateChecks.length > 0) {
      const { data: existing } = await supabase
        .from('links')
        .select('id')
        .or(duplicateChecks.join(','))
        .limit(1);

      if (existing && existing.length > 0) {
        return { success: false, message: 'Salah satu link ini sudah pernah dibagikan sebelumnya.' };
      }
    }

    // 7. Insert Records
    // Register rate limit
    await supabase.from('rate_limits').insert([{ identifier_hash: fingerprint }]);

    // Insert Profile
    const { error } = await supabase.from('links').insert([
      { name, instagram_url, linkedin_url, github_url },
    ]);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: 'Gagal menyimpan data.' };
    }

    // Update Security Cookie
    cookieStore.set('last_sub', Date.now().toString(), { 
      maxAge: 300, 
      httpOnly: true, 
      secure: true, 
      sameSite: 'strict' 
    });

    revalidatePath('/');
    return { success: true, message: 'Berhasil ditambahkan!' };
  } catch (error) {
    console.error('Action Error:', error);
    return { success: false, message: 'Terjadi kesalahan sistem.' };
  }
}

export async function reportProfile(linkId: string): Promise<ActionResponse> {
  try {
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for') || '127.0.0.1';
    const ua = headerList.get('user-agent') || 'unknown';
    const fingerprint = await getFingerprint(ip, ua);

    // Atomic Insert into Reports (DB handles deduplication via UNIQUE constraint)
    const { error } = await supabase.from('reports').insert([
      { link_id: linkId, identifier_hash: fingerprint }
    ]);

    if (error) {
      if (error.code === '23505') { // Postgres Unique Violation
        return { success: false, message: 'Anda sudah melaporkan profil ini sebelumnya.' };
      }
      console.error('[SECURITY_ABUSE] Report failed:', error);
      return { success: false, message: 'Gagal mengirim laporan. Silakan coba lagi.' };
    }

    revalidatePath('/');
    return { success: true, message: 'Terima kasih, laporan Anda telah diterima dan akan ditinjau.' };
  } catch (error) {
    return { success: false, message: 'Terjadi kesalahan saat melaporkan.' };
  }
}
