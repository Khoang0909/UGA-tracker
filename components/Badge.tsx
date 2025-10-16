import React, { ReactNode } from 'react';
import styles from '@/styles/Badge.module.css';

interface BadgeProps {
  children: ReactNode;
  variant?: 'applied' | 'interview' | 'offer' | 'rejected' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]} ${className}`}>{children}</span>;
}
