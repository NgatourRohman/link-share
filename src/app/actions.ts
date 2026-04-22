'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { validateSocialLink, normalizeSocialLink } from '@/lib/utils';

export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function shareProfile(formData: FormData): Promise<ActionResponse> {
  try {
    const name = (formData.get('name') as string)?.trim() || null;
    const instagramRaw = (formData.get('instagram') as string)?.trim();
    const linkedinRaw = (formData.get('linkedin') as string)?.trim();
    const githubRaw = (formData.get('github') as string)?.trim();

    // 1. Check if at least one link is provided
    if (!instagramRaw && !linkedinRaw && !githubRaw) {
      return { success: false, message: 'Minimal salah satu link (Instagram, LinkedIn, atau GitHub) harus diisi.' };
    }

    // 2. Strict Validation per Platform
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

    // 3. Normalization (Safe to call now)
    const instagram_url = instagramRaw ? normalizeSocialLink(instagramRaw, 'instagram') : null;
    const linkedin_url = linkedinRaw ? normalizeSocialLink(linkedinRaw, 'linkedin') : null;
    const github_url = githubRaw ? normalizeSocialLink(githubRaw, 'github') : null;

    // Duplicate check: only check for non-null URLs
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
        return { success: false, message: 'Salah satu link media sosial ini sudah pernah dibagikan sebelumnya.' };
      }
    }

    // Insert
    const { error } = await supabase.from('links').insert([
      {
        name: name || 'Anon',
        instagram_url,
        linkedin_url,
        github_url,
      },
    ]);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: 'Gagal menyimpan data ke database.' };
    }

    revalidatePath('/');
    return { success: true, message: 'Berhasil ditambahkan!' };
  } catch (error) {
    console.error('Action Error:', error);
    return { success: false, message: 'Terjadi kesalahan sistem.' };
  }
}
