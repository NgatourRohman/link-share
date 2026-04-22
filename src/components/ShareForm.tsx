'use client';

import { useState, useRef } from 'react';
import { Instagram, Linkedin, Github, User, Send } from 'lucide-react';
import { toast } from 'sonner';
import { shareProfile } from '@/app/actions';
import { FormInput } from './ui/FormInput';
import { motion } from 'framer-motion';

export function ShareForm() {
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    
    try {
      const result = await shareProfile(formData);
      
      if (result.success) {
        toast.success(result.message);
        formRef.current?.reset();
        // Scroll to the latest entry after a small delay to allow for revalidation
        setTimeout(() => {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }, 500);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Gagal membagikan link. Silakan coba lagi.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-8 rounded-3xl glass shadow-2xl relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 blur-[80px] rounded-full" />

      <h2 className="text-2xl font-bold text-[var(--fg)] mb-6 flex items-center gap-2">
        <Send className="text-indigo-400" size={24} />
        Share Your Socials
      </h2>

      <form ref={formRef} action={handleSubmit} className="space-y-4 relative z-10">
        {/* Stealth Honeypot Field */}
        <input 
          type="text" 
          name="confirm_email" 
          tabIndex={-1} 
          autoComplete="off"
          style={{ display: 'none', position: 'absolute', left: '-9999px' }}
          aria-hidden="true" 
        />

        <FormInput 
          label="Nama (Opsional)" 
          name="name"
          placeholder="Nama kamu..." 
          icon={User} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput 
            label="Instagram" 
            name="instagram"
            placeholder="@username atau link" 
            icon={Instagram}
            iconColor="text-pink-500"
            helperText="Contoh: @arthur atau link profil"
          />
          <FormInput 
            label="LinkedIn" 
            name="linkedin"
            placeholder="Username atau link" 
            icon={Linkedin}
            iconColor="text-blue-500"
            helperText="Contoh: arthur-dev atau /in/arthur"
          />
        </div>

        <FormInput 
          label="GitHub" 
          name="github"
          placeholder="Username atau link" 
          icon={Github}
          iconColor="text-[var(--fg)]"
          helperText="Contoh: arthur-git"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={18} />
              Share Profile
            </>
          )}
        </button>
        
        <p className="text-center text-xs text-slate-500 mt-4">
          Minimal satu link media sosial harus diisi.
        </p>
      </form>
    </motion.div>
  );
}
