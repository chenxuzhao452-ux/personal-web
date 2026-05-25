import { cn } from '@/utils';
import styles from './PageShell.module.css';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  as?: 'main' | 'section' | 'div';
}

export function PageShell({
  children,
  className,
  as: Tag = 'main',
}: PageShellProps) {
  return (
    <Tag className={cn(styles.shell, className)}>
      {children}
    </Tag>
  );
}
