'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-white/5 rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '2rem'),
  };

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={60} height={20} />
      </div>
      <Skeleton variant="text" width="80%" height={24} className="mb-2" />
      <Skeleton variant="text" width="60%" height={16} className="mb-4" />
      <Skeleton variant="text" width={40} height={14} />
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex gap-2">
        <Skeleton variant="text" width={50} height={16} />
        <Skeleton variant="text" width={50} height={16} />
      </div>
      <Skeleton variant="text" width="70%" height={20} className="mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={60} height={14} />
        <Skeleton variant="circular" width={24} height={24} />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton variant="circular" width={32} height={32} />
      </div>
      <Skeleton variant="text" width={40} height={14} className="mb-2" />
      <Skeleton variant="text" width={60} height={32} />
    </div>
  );
}
