import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className, padding = 'md', hover = false }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 rounded-2xl',
        'border border-gray-200 dark:border-gray-800',
        'shadow-sm',
        paddingClasses[padding],
        hover && 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red';
}

export function StatCard({ title, value, icon, trend, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-emerald-500 to-teal-600',
    purple: 'from-purple-500 to-violet-600',
    amber: 'from-amber-500 to-orange-600',
    red: 'from-red-500 to-rose-600',
  };

  const bgClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-emerald-50 dark:bg-emerald-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className={cn(
              'mt-2 text-sm font-medium',
              trend.positive ? 'text-emerald-600' : 'text-red-600'
            )}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', bgClasses[color])}>
          <div className={cn('p-2 rounded-lg bg-gradient-to-br text-white', colorClasses[color])}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
}
