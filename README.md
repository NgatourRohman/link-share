# Quick Share - Internal Group Social Hub

Quick Share adalah platform sederhana dan cepat untuk berbagi profil Instagram, LinkedIn, dan GitHub di satu tempat sentral. Didesain dengan prinsip **Zero Friction**, aplikasi ini memungkinkan pengguna untuk berbagi link media sosial mereka secara instan tanpa perlu login.

## 🚀 Fitur Utama

- **Link Normalization**: Ketik `@username` atau link mentah, sistem otomatis merapikannya.
- **Smart Username Display**: Menampilkan handle sosial media (misal: `@username`) untuk estetika yang lebih bersih.
- **Duplicate Protection**: Mencegah link yang sama dibagikan berulang kali.
- **Debounced Search**: Cari anggota grup dengan cepat berdasarkan nama.
- **Premium Glassmorphism UI**: Tampilan modern, responsif, dan mobile-first.

## 🛠️ Stack Teknologi

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Toasts**: Sonner

## 📦 Setup Database (Supabase)

Sebelum menjalankan aplikasi, jalankan SQL berikut di Supabase SQL Editor Anda:

```sql
create table if not exists links (
  id uuid default gen_random_uuid() primary key,
  name text,
  instagram_url text,
  linkedin_url text,
  github_url text,
  created_at timestamp with time zone default now()
);

alter table links enable row level security;

create policy "Allow public read access" on links for select using (true);
create policy "Allow insert if link present" on links for insert
with check (
  (instagram_url is not null and instagram_url <> '') or 
  (linkedin_url is not null and linkedin_url <> '') or
  (github_url is not null and github_url <> '')
);
```

## ⚙️ Deployment ke Vercel

1. **Push ke GitHub**:
   - Buat repositori baru di GitHub.
   - Jalankan `git push` dari komputer lokal Anda.

2. **Hubungkan ke Vercel**:
   - Impor repositori ini ke Vercel.
   - Tambahkan Environment Variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Klik **Deploy**.

---
*Dibuat untuk kebutuhan berbagi cepat dalam grup internal.*
