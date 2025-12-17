import { cn } from '@/lib/utils';

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Main card skeleton */}
      <div
        className={cn(
          'relative overflow-hidden',
          'rounded-3xl',
          'bg-white/10 backdrop-blur-xl',
          'border border-white/10',
          'p-6 sm:p-8'
        )}
      >
        {/* Header skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-4 h-4 rounded-full bg-white/20 animate-shimmer" />
          <div className="h-6 w-48 rounded-lg bg-white/20 animate-shimmer" />
        </div>

        {/* Main content skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          {/* Icon skeleton */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/20 animate-shimmer" />

          {/* Temperature skeleton */}
          <div className="flex-1 flex flex-col items-center sm:items-start gap-2">
            <div className="h-24 w-40 rounded-2xl bg-white/20 animate-shimmer" />
            <div className="h-6 w-32 rounded-lg bg-white/15 animate-shimmer" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-white/10 animate-shimmer"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Forecast title skeleton */}
      <div className="h-6 w-36 rounded-lg bg-white/20 animate-shimmer" />

      {/* Forecast cards skeleton */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-40 rounded-2xl bg-white/10 animate-shimmer',
              i >= 3 && 'hidden sm:block'
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
