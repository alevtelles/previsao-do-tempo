import { cn } from '@/lib/utils';

interface WeatherIconProps {
  condition: 'sun' | 'cloud' | 'rain';
  className?: string;
  animated?: boolean;
}

export function WeatherIcon({
  condition,
  className = 'w-12 h-12',
  animated = true
}: WeatherIconProps) {
  if (condition === 'sun') {
    return (
      <svg
        className={cn(className, 'text-yellow-400 drop-shadow-lg')}
        viewBox="0 0 64 64"
        fill="none"
      >
        {/* Outer glow */}
        <circle
          cx="32"
          cy="32"
          r="28"
          className={cn(
            'fill-yellow-300/20',
            animated && 'animate-pulse-glow'
          )}
        />

        {/* Sun rays - rotating */}
        <g className={cn(animated && 'animate-spin-slow origin-center')}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="32"
              y1="8"
              x2="32"
              y2="14"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${angle} 32 32)`}
              className="opacity-80"
            />
          ))}
        </g>

        {/* Sun core with gradient */}
        <defs>
          <radialGradient id="sunGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>
        <circle
          cx="32"
          cy="32"
          r="14"
          fill="url(#sunGradient)"
          className="drop-shadow-md"
        />

        {/* Sun highlight */}
        <circle
          cx="28"
          cy="28"
          r="4"
          fill="white"
          opacity="0.4"
        />
      </svg>
    );
  }

  if (condition === 'rain') {
    return (
      <svg
        className={cn(className, 'text-blue-400')}
        viewBox="0 0 64 64"
        fill="none"
      >
        <defs>
          <linearGradient id="cloudGradientRain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="rainDropGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Cloud body - floating */}
        <g className={cn(animated && 'animate-float')}>
          {/* Back cloud */}
          <ellipse
            cx="38"
            cy="26"
            rx="14"
            ry="10"
            fill="url(#cloudGradientRain)"
            opacity="0.8"
          />
          {/* Front cloud */}
          <ellipse
            cx="26"
            cy="28"
            rx="16"
            ry="12"
            fill="url(#cloudGradientRain)"
          />
          {/* Cloud highlight */}
          <ellipse
            cx="22"
            cy="24"
            rx="6"
            ry="4"
            fill="white"
            opacity="0.3"
          />
        </g>

        {/* Rain drops with staggered animation */}
        <g>
          {/* Drop 1 */}
          <path
            d="M20 42 L20 48 Q20 50 22 50 Q24 50 24 48 L24 42 Q22 40 20 42Z"
            fill="url(#rainDropGradient)"
            className={cn(animated && 'animate-rain-drop')}
          />
          {/* Drop 2 */}
          <path
            d="M30 44 L30 50 Q30 52 32 52 Q34 52 34 50 L34 44 Q32 42 30 44Z"
            fill="url(#rainDropGradient)"
            className={cn(animated && 'animate-rain-drop-delayed-1')}
          />
          {/* Drop 3 */}
          <path
            d="M40 42 L40 48 Q40 50 42 50 Q44 50 44 48 L44 42 Q42 40 40 42Z"
            fill="url(#rainDropGradient)"
            className={cn(animated && 'animate-rain-drop-delayed-2')}
          />
        </g>
      </svg>
    );
  }

  // Cloud condition (default)
  return (
    <svg
      className={cn(className, 'text-slate-400')}
      viewBox="0 0 64 64"
      fill="none"
    >
      <defs>
        <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="cloudGradientBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>

      {/* Floating cloud group */}
      <g className={cn(animated && 'animate-float')}>
        {/* Back small cloud */}
        <ellipse
          cx="44"
          cy="28"
          rx="12"
          ry="8"
          fill="url(#cloudGradientBack)"
          opacity="0.7"
        />

        {/* Main cloud body */}
        <ellipse
          cx="32"
          cy="32"
          rx="18"
          ry="12"
          fill="url(#cloudGradient)"
        />

        {/* Cloud left bump */}
        <ellipse
          cx="20"
          cy="34"
          rx="10"
          ry="8"
          fill="url(#cloudGradient)"
        />

        {/* Cloud right bump */}
        <ellipse
          cx="42"
          cy="34"
          rx="8"
          ry="6"
          fill="url(#cloudGradient)"
        />

        {/* Cloud top bump */}
        <ellipse
          cx="30"
          cy="26"
          rx="10"
          ry="8"
          fill="url(#cloudGradient)"
        />

        {/* Highlight */}
        <ellipse
          cx="24"
          cy="28"
          rx="6"
          ry="4"
          fill="white"
          opacity="0.4"
        />
      </g>
    </svg>
  );
}
