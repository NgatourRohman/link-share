# Quick Share - Production-Ready Social Hub

Quick Share adalah platform sederhana, cepat, dan **sangat aman** untuk berbagi profil Instagram, LinkedIn, dan GitHub di satu tempat sentral. Didesain dengan prinsip **Zero Friction**, aplikasi ini memungkinkan pengguna berbagi link media sosial secara instan tanpa perlu login (*Zero-Auth*), namun tetap terlindungi dari spam dan bot.

## 🚀 Fitur Unggulan (Production-Ready)

- **Seamless Light/Dark Mode**: Transisi halus antar tema dengan desain glassmorphism premium yang dioptimalkan untuk readability di segala kondisi cahaya.
- **Production-Grade Validation**: Validasi link sosial media yang ketat menggunakan `URL API` dan Regex resmi untuk memastikan integritas data (mendukung link profil, link perusahaan, dan @username).
- **Hardened Content Guard**:
  - **Anti-Bot**: Stealth Honeypot untuk menjebak bot otomatis.
  - **Advanced Rate Limiting**: Batasan pengiriman cerdas (Sliding Window) berbasis fingerprint (IP + User-Agent).
  - **Community Moderation**: Sistem pelaporan profil (*Report System*) dengan fitur *auto-flagging* dan deduplikasi laporan.
- **Performance Optimized**: Menggunakan B-Tree indexes dan atomic database triggers untuk eksekusi yang sangat cepat di skala menengah–besar.

## 🛠️ Stack Teknologi

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (dengan modern design variables)
- **Database**: Supabase (PostgreSQL)
- **Security**: Fingerprinting, RLS (Row Level Security), & Atomic Triggers
- **Animations**: Framer Motion
- **Toasts**: Sonner

## 📦 Setup Database (Triple-Hardened SQL)

Agar seluruh fitur keamanan dan moderasi berjalan 100%, jalankan script SQL final ini di **Supabase SQL Editor** Anda:

```sql
-- 1. SETUP TABLES
CREATE TABLE IF NOT EXISTS links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  instagram_url text,
  linkedin_url text,
  github_url text,
  is_flagged boolean DEFAULT false,
  report_count int DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT name_length_check CHECK (char_length(name) >= 3 AND char_length(name) <= 40)
);

CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id uuid REFERENCES links(id) ON DELETE CASCADE,
  identifier_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(link_id, identifier_hash)
);

-- 2. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_rate_limits_composite ON rate_limits(identifier_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_link_id ON reports(link_id);

-- 3. ATOMIC MODERATION TRIGGER
CREATE OR REPLACE FUNCTION handle_new_report() 
RETURNS TRIGGER AS $$
DECLARE v_count int;
BEGIN
  SELECT count(*) INTO v_count FROM public.reports WHERE link_id = NEW.link_id;
  UPDATE public.links SET report_count = v_count, is_flagged = CASE WHEN v_count >= 5 THEN true ELSE is_flagged END WHERE id = NEW.link_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS tr_on_report_added ON reports;
CREATE TRIGGER tr_on_report_added AFTER INSERT ON reports FOR EACH ROW EXECUTE FUNCTION handle_new_report();

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policies for links
CREATE POLICY "Public read links" ON links FOR SELECT USING (true);
CREATE POLICY "Public insert links" ON links FOR INSERT WITH CHECK (true);
CREATE POLICY "No public update links" ON links FOR UPDATE USING (false);

-- Policies for security tables
CREATE POLICY "Public insert rate_limits" ON rate_limits FOR INSERT WITH CHECK (identifier_hash IS NOT NULL);
CREATE POLICY "Restrict read rate_limits" ON rate_limits FOR ALL USING (false);
CREATE POLICY "Public insert reports" ON reports FOR INSERT WITH CHECK (identifier_hash IS NOT NULL AND EXISTS (SELECT 1 FROM links WHERE id = link_id));
CREATE POLICY "Restrict read reports" ON reports FOR ALL USING (false);
```

## ⚙️ Deployment ke Vercel

1. **Push ke GitHub**:
   - Impor repositori ini ke Vercel.
2. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy** 🚀

---
*Dibuat untuk berbagi sosial media secara instan, aman, dan tanpa hambatan.*
