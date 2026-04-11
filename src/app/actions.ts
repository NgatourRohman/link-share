'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { normalizeInstagram, normalizeLinkedIn, normalizeGithub } from '@/lib/utils';

export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function shareProfile(formData: FormData): Promise<ActionResponse> {
  try {
    const name = (formData.get('name') as string)?.trim() || null;
    const instagramRaw = formData.get('instagram') as string;
    const linkedinRaw = formData.get('linkedin') as string;
    const githubRaw = formData.get('github') as string;

    // Normalization
    const instagram_url = normalizeInstagram(instagramRaw);
    const linkedin_url = normalizeLinkedIn(linkedinRaw);
    const github_url = normalizeGithub(githubRaw);

    // Validation: At least one link
    if (!instagram_url && !linkedin_url && !github_url) {
      return { success: false, message: 'Minimal salah satu link (Instagram, LinkedIn, atau GitHub) harus diisi.' };
    }

    // Domain validation
    if (instagram_url && !instagram_url.includes('instagram.com')) {
      return { success: false, message: 'Link Instagram tidak valid.' };
    }
    if (linkedin_url && !linkedin_url.includes('linkedin.com')) {
      return { success: false, message: 'Link LinkedIn tidak valid.' };
    }
    if (github_url && !github_url.includes('github.com')) {
      return { success: false, message: 'Link GitHub tidak valid.' };
    }

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
