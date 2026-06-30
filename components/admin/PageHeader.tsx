import { cn } from '@/lib/utils';
import React from 'react';

interface PageHeaderProps {
  label: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ label, title, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-border pb-5', className)}>
      <div>
        <span className="font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground block mb-2 font-bold">
          {label}
        </span>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground uppercase">
          {title}
        </h2>
      </div>
      {action && (
        <div className="flex flex-wrap items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
}
