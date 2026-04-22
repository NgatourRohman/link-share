import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SocialPlatform = 'instagram' | 'linkedin' | 'github';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

/**
 * Validates user names: 3-40 chars, must contain letters, no symbols-only.
 */
export function validateName(name: string): ValidationResult {
  if (!name) return { isValid: true, sanitizedValue: 'Anon' }; // Default
  const trimmed = name.trim();
  
  if (trimmed.length < 3 || trimmed.length > 40) {
    return { isValid: false, error: 'Nama harus antara 3 - 40 karakter.' };
  }

  // Regex: Allow letters, spaces, dots, and hyphens. Must have at least one letter.
  const nameRegex = /^(?=.*[a-zA-Z])[a-zA-Z\s.-]+$/;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: 'Nama hanya boleh berisi huruf, spasi, titik, atau tanda hubung.' };
  }

  return { isValid: true, sanitizedValue: trimmed };
}

/**
 * Generates a SHA-256 fingerprint from IP and User-Agent.
 */
export async function getFingerprint(ip: string, ua: string): Promise<string> {
  const data = `${ip}-${ua}`;
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates a social media handle or URL.
 * Returns an object with the result and an optional error message.
 */
export function validateSocialLink(input: string, platform: SocialPlatform): ValidationResult {
  if (!input) return { isValid: false, error: 'Silakan isi link atau username.' };
  
  const trimmed = input.trim().replace(/^@/, '');
  if (!trimmed) return { isValid: false, error: 'Format tidak valid.' };

  // 1. Check if it's a URL
  if (trimmed.includes('http') || trimmed.includes('.')) {
    try {
      const urlString = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      const url = new URL(urlString);
      const hostname = url.hostname.toLowerCase();
      const path = url.pathname.replace(/\/$/, ''); // Remove trailing slash

      // Whitelist domains
      const isOfficialDomain = (domain: string, target: string) => 
        domain === target || domain.endsWith(`.${target}`);

      if (platform === 'instagram') {
        if (!isOfficialDomain(hostname, 'instagram.com')) return { isValid: false, error: 'Bukan domain Instagram resmi.' };
        const username = path.split('/').filter(Boolean)[0];
        if (!username) return { isValid: false, error: 'Link Instagram tidak lengkap (username hilang).' };
        return validateSocialLink(username, 'instagram');
      }

      if (platform === 'github') {
        if (!isOfficialDomain(hostname, 'github.com')) return { isValid: false, error: 'Bukan domain GitHub resmi.' };
        const username = path.split('/').filter(Boolean)[0];
        if (!username) return { isValid: false, error: 'Link GitHub tidak lengkap (username hilang).' };
        return validateSocialLink(username, 'github');
      }

      if (platform === 'linkedin') {
        if (!isOfficialDomain(hostname, 'linkedin.com')) return { isValid: false, error: 'Bukan domain LinkedIn resmi.' };
        const validPaths = ['/in/', '/company/', '/school/', '/pub/'];
        const hasValidPath = validPaths.some(p => path.startsWith(p));
        if (!hasValidPath) return { isValid: false, error: 'Format link LinkedIn tidak dikenali (gunakan /in/ atau /company/).' };
        
        const pathParts = path.split('/').filter(Boolean);
        if (pathParts.length < 2) return { isValid: false, error: 'Link LinkedIn tidak lengkap (slug hilang).' };
        
        const slug = pathParts.slice(1).join('/');
        return { isValid: true, sanitizedValue: slug };
      }
    } catch (e) {
      return { isValid: false, error: 'Format URL tidak valid.' };
    }
  }

  // 2. Format check for handles (Username)
  if (platform === 'instagram') {
    // IG valid: chars, nums, dots, underscores. No trailing dot. 1-30 chars.
    const igRegex = /^[a-zA-Z0-9._]{1,29}[a-zA-Z0-9_]$/;
    if (!igRegex.test(trimmed)) return { isValid: false, error: 'Format username Instagram tidak valid (cek karakter khusus di akhir).' };
    return { isValid: true, sanitizedValue: trimmed.toLowerCase() };
  }

  if (platform === 'github') {
    // GitHub: alfanum or single hyphen. No trailing hyphen. Max 39.
    const githubRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!githubRegex.test(trimmed)) return { isValid: false, error: 'Format username GitHub tidak valid (cek tanda hubung di akhir).' };
    return { isValid: true, sanitizedValue: trimmed.toLowerCase() };
  }

  if (platform === 'linkedin') {
    const linkedinSlugRegex = /^[a-zA-Z0-9-]{3,100}$/;
    if (!linkedinSlugRegex.test(trimmed)) return { isValid: false, error: 'Username LinkedIn minimal 3 karakter.' };
    return { isValid: true, sanitizedValue: trimmed };
  }

  return { isValid: false, error: 'Platform tidak didukung.' };
}

/**
 * Normalizes a validated input into a canonical URL.
 */
export function normalizeSocialLink(input: string, platform: SocialPlatform): string | null {
  const validation = validateSocialLink(input, platform);
  if (!validation.isValid || !validation.sanitizedValue) return null;

  const value = validation.sanitizedValue;

  if (platform === 'instagram') return `https://www.instagram.com/${value}`;
  if (platform === 'github') return `https://github.com/${value}`;
  if (platform === 'linkedin') {
    // If it looks like a full path already, just prepend domain
    if (value.includes('/')) return `https://www.linkedin.com/${value.replace(/^\//, '')}`;
    return `https://www.linkedin.com/in/${value}`;
  }

  return null;
}

export function extractUsername(url: string, type: SocialPlatform): string {
  if (!url) return '';
  
  try {
    const cleanUrl = url.split('?')[0].replace(/\/$/, '');
    const parts = cleanUrl.split('/');
    const username = parts[parts.length - 1];
    
    if (type === 'instagram') return `@${username}`;
    return username;
  } catch (e) {
    return url;
  }
}
