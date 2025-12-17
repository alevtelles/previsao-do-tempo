import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const MIN_CITY_LENGTH = 2;
const MAX_CITY_LENGTH = 100;

const searchSchema = z.object({
  city: z
    .string()
    .min(MIN_CITY_LENGTH, `O nome da cidade deve ter pelo menos ${MIN_CITY_LENGTH} caracteres`)
    .max(MAX_CITY_LENGTH, `O nome da cidade nao pode exceder ${MAX_CITY_LENGTH} caracteres`)
    .transform((val) => val.trim().replace(/[<>"'&;]/g, ''))
    .refine(
      (val) => val.length >= MIN_CITY_LENGTH,
      `O nome da cidade deve ter pelo menos ${MIN_CITY_LENGTH} caracteres validos`
    )
    .refine(
      (val) => /^[\p{L}\p{M}\s\-'.]+$/u.test(val),
      'O nome da cidade contem caracteres invalidos'
    ),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface SearchFormProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchFormData) => {
    onSearch(data.city);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl">
      <div className="relative group">
        {/* Glass container */}
        <div
          className={cn(
            'relative flex items-center',
            'bg-white/20 backdrop-blur-xl',
            'rounded-2xl',
            'border border-white/30',
            'shadow-lg shadow-black/5',
            'transition-all duration-300 ease-out',
            'focus-within:bg-white/30 focus-within:border-white/50 focus-within:shadow-xl',
            'hover:bg-white/25',
            errors.city && 'border-red-400/50 focus-within:border-red-400/70'
          )}
        >
          {/* Search icon */}
          <div className="absolute left-4 pointer-events-none">
            <Search className="w-5 h-5 text-white/70" />
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Buscar cidade..."
            {...register('city')}
            disabled={isLoading}
            maxLength={MAX_CITY_LENGTH}
            className={cn(
              'w-full h-14 pl-12 pr-28',
              'bg-transparent',
              'text-white placeholder:text-white/60',
              'text-base font-medium',
              'outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'absolute right-2',
              'h-10 px-5',
              'bg-white/90 hover:bg-white',
              'text-slate-800 font-semibold text-sm',
              'rounded-xl',
              'transition-all duration-200 ease-out',
              'hover:shadow-md hover:scale-[1.02]',
              'active:scale-[0.98]',
              'disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100',
              'flex items-center gap-2'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Buscando</span>
              </>
            ) : (
              <span>Buscar</span>
            )}
          </button>
        </div>

        {/* Error message */}
        {errors.city && (
          <p className="mt-2 px-4 text-sm text-red-200 animate-fade-in-up">
            {errors.city.message}
          </p>
        )}
      </div>
    </form>
  );
}
