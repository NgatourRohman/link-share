import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function FormInput({ label, icon: Icon, iconColor, className, ...props }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-[var(--muted)] ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 transition-colors z-10",
          iconColor || "text-[var(--muted-foreground)] group-focus-within:text-[var(--accent)]"
        )}>
          <Icon size={18} />
        </div>
        <input
          {...props}
          className={cn(
            "w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl py-3 pl-10 pr-4 text-[var(--fg)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-sm",
            className
          )}
        />
      </div>
    </div>
  );
}
