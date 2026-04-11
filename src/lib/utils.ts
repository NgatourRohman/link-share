import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeInstagram(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim().replace(/^@/, '');
  
  if (trimmed.includes('instagram.com/')) {
    const parts = trimmed.split('instagram.com/')[1].split('?')[0].split('/');
    return `https://instagram.com/${parts[0]}`;
  }
  
  return `https://instagram.com/${trimmed}`;
}

export function normalizeLinkedIn(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  
  if (trimmed.includes('linkedin.com/')) {
    return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  }
  
  return `https://linkedin.com/in/${trimmed}`;
}

export function normalizeGithub(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  
  if (trimmed.includes('github.com/')) {
    const parts = trimmed.split('github.com/')[1].split('?')[0].split('/');
    return `https://github.com/${parts[0]}`;
  }
  
  return `https://github.com/${trimmed}`;
}

export function extractUsername(url: string, type: 'instagram' | 'linkedin' | 'github'): string {
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
